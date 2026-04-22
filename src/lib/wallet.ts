/**
 * Wallet business logic — in-memory for MVP
 * Replace all store operations with DB calls (Prisma/Drizzle) in production
 *
 * Security model:
 *  - availableBalance: withdrawable funds
 *  - escrowBalance: locked until job marked complete
 *  - All mutations go through atomic functions to prevent race conditions
 *  - Every transaction is recorded with a unique reference
 *  - Withdrawal requires verified bank account
 */

import type { Wallet, WalletTransaction, WithdrawalRequest } from '@/types'
import { generateReference } from './paystack'

// ─── In-memory stores (replace with DB in production) ────────────────────────

const walletStore  = new Map<string, Wallet>()
const txStore      = new Map<string, WalletTransaction>()
const withdrawStore = new Map<string, WithdrawalRequest>()

// ─── Get or create wallet ─────────────────────────────────────────────────────

export function getOrCreateWallet(userId: string): Wallet {
  if (!walletStore.has(userId)) {
    const wallet: Wallet = {
      userId,
      availableBalance: 0,
      escrowBalance:    0,
      totalEarned:      0,
      isVerified:       false,
      createdAt:        new Date().toISOString(),
      updatedAt:        new Date().toISOString(),
    }
    walletStore.set(userId, wallet)
  }
  return walletStore.get(userId)!
}

// ─── Record a transaction ─────────────────────────────────────────────────────

export function recordTransaction(
  tx: Omit<WalletTransaction, 'id' | 'createdAt'>
): WalletTransaction {
  const full: WalletTransaction = {
    ...tx,
    id:        `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  }
  txStore.set(full.id, full)
  return full
}

// ─── Get transaction history for a user ──────────────────────────────────────

export function getUserTransactions(userId: string): WalletTransaction[] {
  return Array.from(txStore.values())
    .filter((tx) => tx.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function hasSuccessfulTransactionReference(reference: string): boolean {
  return Array.from(txStore.values()).some(
    (tx) => tx.reference === reference && tx.status === 'success'
  )
}

// ─── Lock funds in escrow (called when client pays for a job) ─────────────────

export function lockEscrow(clientId: string, amountNGN: number, jobId: string): WalletTransaction {
  const wallet = getOrCreateWallet(clientId)

  // Deduct from client's available balance
  wallet.availableBalance -= amountNGN
  wallet.escrowBalance    += amountNGN
  wallet.updatedAt         = new Date().toISOString()
  walletStore.set(clientId, wallet)

  return recordTransaction({
    userId:      clientId,
    type:        'escrow_lock',
    amount:      amountNGN * 100,
    amountNGN,
    description: `Payment locked in escrow for job #${jobId}`,
    reference:   generateReference('ESC'),
    status:      'success',
    metadata:    { jobId },
  })
}

// ─── Release escrow to professional (called when job is completed) ────────────

export function releaseEscrow(
  clientId: string,
  proId: string,
  amountNGN: number,
  jobId: string
): { clientTx: WalletTransaction; proTx: WalletTransaction } {
  // Platform fee: 5% of transaction
  const PLATFORM_FEE_PERCENT = 5
  const platformFee           = Math.round(amountNGN * PLATFORM_FEE_PERCENT / 100)
  const proAmount             = amountNGN - platformFee

  // Deduct escrow from client
  const clientWallet = getOrCreateWallet(clientId)
  clientWallet.escrowBalance -= amountNGN
  clientWallet.updatedAt      = new Date().toISOString()
  walletStore.set(clientId, clientWallet)

  // Credit pro's available balance
  const proWallet = getOrCreateWallet(proId)
  proWallet.availableBalance += proAmount
  proWallet.totalEarned      += proAmount
  proWallet.updatedAt         = new Date().toISOString()
  walletStore.set(proId, proWallet)

  const ref = generateReference('REL')

  const clientTx = recordTransaction({
    userId:      clientId,
    type:        'escrow_release',
    amount:      amountNGN * 100,
    amountNGN,
    description: `Escrow released for job #${jobId}`,
    reference:   ref,
    status:      'success',
    metadata:    { jobId, proId },
  })

  // Also credit pro's wallet for job earnings
  const proTx = creditWallet(proId, proAmount, generateReference('PAY'), true)

  return { clientTx, proTx }
}

// ─── Credit wallet after successful Paystack payment ─────────────────────────

export function creditWallet(userId: string, amountNGN: number, reference: string, isJobEarnings = false): WalletTransaction {
  const existing = Array.from(txStore.values()).find(
    (tx) => tx.reference === reference && (tx.type === 'credit' || tx.type === 'earning')
  )
  if (existing) {
    return existing
  }

  const wallet = getOrCreateWallet(userId)
  wallet.availableBalance += amountNGN
  if (isJobEarnings) {
    wallet.totalEarned += amountNGN
  }
  wallet.updatedAt         = new Date().toISOString()
  walletStore.set(userId, wallet)

  return recordTransaction({
    userId,
    type:        isJobEarnings ? 'earning' : 'credit',
    amount:      amountNGN * 100,
    amountNGN,
    description: isJobEarnings ? 'Job earnings received' : 'Wallet funded via Paystack',
    reference,
    status:      'success',
  })
}

// ─── Request a withdrawal ─────────────────────────────────────────────────────

export function requestWithdrawal(
  userId: string,
  amountNGN: number,
  bankDetails: { accountNumber: string; bankCode: string; bankName: string; accountName: string }
): WithdrawalRequest | { error: string } {
  const wallet = getOrCreateWallet(userId)

  // Security: can't withdraw more than available balance
  if (amountNGN > wallet.availableBalance) {
    return { error: 'Insufficient available balance' }
  }

  // Security: minimum withdrawal
  if (amountNGN < 500) {
    return { error: 'Minimum withdrawal amount is ₦500' }
  }

  // Security: bank account must be verified
  if (!wallet.isVerified) {
    return { error: 'Please verify your bank account before withdrawing' }
  }

  // Deduct immediately to prevent double-spend
  wallet.availableBalance -= amountNGN
  wallet.updatedAt         = new Date().toISOString()
  walletStore.set(userId, wallet)

  const withdrawal: WithdrawalRequest = {
    id:                `wd-${Date.now()}`,
    userId,
    amount:            amountNGN,
    amountKobo:        amountNGN * 100,
    bankAccountNumber: bankDetails.accountNumber,
    bankCode:          bankDetails.bankCode,
    bankName:          bankDetails.bankName,
    accountName:       bankDetails.accountName,
    status:            'pending',
    createdAt:         new Date().toISOString(),
    updatedAt:         new Date().toISOString(),
  }
  withdrawStore.set(withdrawal.id, withdrawal)

  // Record the debit transaction
  recordTransaction({
    userId,
    type:        'debit',
    amount:      amountNGN * 100,
    amountNGN,
    description: `Withdrawal to ${bankDetails.bankName} ••••${bankDetails.accountNumber.slice(-4)}`,
    reference:   generateReference('WD'),
    status:      'pending',
    metadata:    { withdrawalId: withdrawal.id },
  })

  return withdrawal
}

export function rollbackWithdrawal(withdrawalId: string, reason = 'Transfer failed'): WithdrawalRequest | null {
  const withdrawal = withdrawStore.get(withdrawalId)
  if (!withdrawal || withdrawal.status === 'failed') {
    return withdrawal ?? null
  }

  const wallet = getOrCreateWallet(withdrawal.userId)
  wallet.availableBalance += withdrawal.amount
  wallet.updatedAt         = new Date().toISOString()
  walletStore.set(withdrawal.userId, wallet)

  withdrawal.status    = 'failed'
  withdrawal.updatedAt = new Date().toISOString()
  withdrawal.reason    = reason
  withdrawStore.set(withdrawalId, withdrawal)

  const debitTx = Array.from(txStore.values()).find(
    (tx) => tx.metadata?.withdrawalId === withdrawalId && tx.type === 'debit'
  )

  if (debitTx) {
    debitTx.status      = 'failed'
    debitTx.description = `${debitTx.description} (${reason})`
    txStore.set(debitTx.id, debitTx)
  }

  recordTransaction({
    userId:      withdrawal.userId,
    type:        'refund',
    amount:      withdrawal.amountKobo,
    amountNGN:   withdrawal.amount,
    description: `Withdrawal reversal - ${reason}`,
    reference:   generateReference('WDR'),
    status:      'success',
    metadata:    { withdrawalId },
  })

  return withdrawal
}

// ─── Verify & save bank account ───────────────────────────────────────────────

export function saveBankAccount(
  userId: string,
  bankDetails: {
    accountNumber: string
    bankCode: string
    bankName: string
    recipientCode: string
  }
): Wallet {
  const wallet = getOrCreateWallet(userId)
  wallet.bankAccountNumber       = bankDetails.accountNumber
  wallet.bankCode                = bankDetails.bankCode
  wallet.bankName                = bankDetails.bankName
  wallet.paystackRecipientCode   = bankDetails.recipientCode
  wallet.isVerified              = true
  wallet.updatedAt               = new Date().toISOString()
  walletStore.set(userId, wallet)
  return wallet
}

// ─── Get withdrawal history ───────────────────────────────────────────────────

export function getUserWithdrawals(userId: string): WithdrawalRequest[] {
  return Array.from(withdrawStore.values())
    .filter((w) => w.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

// ─── Confirm withdrawal success ───────────────────────────────────────────────

export function confirmWithdrawalSuccess(_transferCode: string): WithdrawalRequest | null {
  const withdrawal = Array.from(withdrawStore.values())
    .find((w) => w.status === 'pending')
  
  if (!withdrawal) {
    return null
  }

  withdrawal.status    = 'paid'
  withdrawal.updatedAt = new Date().toISOString()
  withdrawStore.set(withdrawal.id, withdrawal)

  const debitTx = Array.from(txStore.values()).find(
    (tx) => tx.metadata?.withdrawalId === withdrawal.id && tx.type === 'debit'
  )

  if (debitTx) {
    debitTx.status = 'success'
    txStore.set(debitTx.id, debitTx)
  }

  return withdrawal
}

// ─── Credit user for refund (failed transfer rollback) ─────────────────────────

export function creditUser(userId: string, amountNGN: number, reference: string, description: string): WalletTransaction {
  const existing = Array.from(txStore.values()).find(
    (tx) => tx.reference === reference
  )
  if (existing) {
    return existing
  }

  const wallet = getOrCreateWallet(userId)
  wallet.availableBalance += amountNGN
  wallet.updatedAt         = new Date().toISOString()
  walletStore.set(userId, wallet)

  return recordTransaction({
    userId,
    type:        'refund',
    amount:      amountNGN * 100,
    amountNGN,
    description,
    reference,
    status:      'success',
  })
}

// ─── Find pending withdrawal for webhook ──────────────────────────────────────

export function findPendingWithdrawal(): WithdrawalRequest | null {
  const pending = Array.from(withdrawStore.values())
    .find((w) => w.status === 'pending')
  return pending ?? null
}
