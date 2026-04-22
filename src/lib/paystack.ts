import { createHmac } from 'crypto'

const PAYSTACK_BASE = 'https://api.paystack.co'

function getPaystackSecret() {
  const secret = process.env.PAYSTACK_SECRET_KEY ?? ''

  if (!secret) {
    throw new Error('PAYSTACK_SECRET_KEY is not set')
  }

  return secret
}

async function paystackRequest<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const paystackSecret = getPaystackSecret()
  const res = await fetch(`${PAYSTACK_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${paystackSecret}`,
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  })

  const json = await res.json()

  if (!res.ok || !json.status) {
    throw new Error(json.message ?? `Paystack error: ${res.status}`)
  }

  return json
}

export async function initializePayment({
  email,
  amountNGN,
  reference,
  metadata,
  callbackUrl,
}: {
  email: string
  amountNGN: number
  reference: string
  metadata: Record<string, string>
  callbackUrl: string
}) {
  return paystackRequest<{
    status: boolean
    data: { authorization_url: string; access_code: string; reference: string }
  }>('/transaction/initialize', {
    method: 'POST',
    body: JSON.stringify({
      email,
      amount: amountNGN * 100,
      reference,
      callback_url: callbackUrl,
      metadata,
      channels: ['card', 'bank', 'ussd', 'bank_transfer'],
    }),
  })
}

export async function verifyPayment(reference: string) {
  return paystackRequest<{
    status: boolean
    data: {
      status: 'success' | 'failed' | 'abandoned'
      reference: string
      amount: number
      currency: string
      customer: { email: string; id: number }
      metadata: Record<string, string>
      paid_at: string
    }
  }>(`/transaction/verify/${encodeURIComponent(reference)}`)
}

export async function createTransferRecipient({
  accountName,
  accountNumber,
  bankCode,
}: {
  accountName: string
  accountNumber: string
  bankCode: string
}) {
  return paystackRequest<{
    status: boolean
    data: { recipient_code: string; id: number }
  }>('/transferrecipient', {
    method: 'POST',
    body: JSON.stringify({
      type: 'nuban',
      name: accountName,
      account_number: accountNumber,
      bank_code: bankCode,
      currency: 'NGN',
    }),
  })
}

export async function initiateTransfer({
  amountNGN,
  recipientCode,
  reference,
  reason,
}: {
  amountNGN: number
  recipientCode: string
  reference: string
  reason: string
}) {
  return paystackRequest<{
    status: boolean
    data: {
      transfer_code: string
      status: string
      amount: number
    }
  }>('/transfer', {
    method: 'POST',
    body: JSON.stringify({
      source: 'balance',
      amount: amountNGN * 100,
      recipient: recipientCode,
      reference,
      reason,
    }),
  })
}

export async function verifyTransfer(transferCode: string) {
  return paystackRequest<{
    status: boolean
    data: { status: string; amount: number; transfer_code: string }
  }>(`/transfer/${encodeURIComponent(transferCode)}`)
}

export async function resolveAccountNumber({
  accountNumber,
  bankCode,
}: {
  accountNumber: string
  bankCode: string
}) {
  return paystackRequest<{
    status: boolean
    data: { account_name: string; account_number: string }
  }>(`/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`)
}

export async function listBanks() {
  return paystackRequest<{
    status: boolean
    data: Array<{ id: number; name: string; code: string; slug: string }>
  }>('/bank?country=nigeria&currency=NGN&perPage=100')
}

export function verifyWebhookSignature(payload: string, signature: string): boolean {
  const hash = createHmac('sha512', getPaystackSecret())
    .update(payload)
    .digest('hex')

  return hash === signature
}

export function generateReference(prefix = 'AW365'): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}_${timestamp}_${random}`
}
