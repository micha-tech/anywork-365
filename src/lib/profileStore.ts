import { mkdir, readFile, writeFile } from 'fs/promises'
import { join } from 'path'
import type { AuthUser } from '@/types'

type StoredProfile = Partial<Pick<AuthUser, 'firstName' | 'lastName' | 'phone' | 'city' | 'bio' | 'avatarUrl'>>
type ProfileStore = Record<string, StoredProfile>

const DATA_DIR = join(process.cwd(), 'data')
const STORE_PATH = join(DATA_DIR, 'profiles.json')

async function ensureStore(): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true })
  try {
    await readFile(STORE_PATH, 'utf-8')
  } catch {
    await writeFile(STORE_PATH, '{}', 'utf-8')
  }
}

async function readStore(): Promise<ProfileStore> {
  await ensureStore()
  try {
    const raw = await readFile(STORE_PATH, 'utf-8')
    return JSON.parse(raw) as ProfileStore
  } catch {
    return {}
  }
}

async function writeStore(store: ProfileStore): Promise<void> {
  await ensureStore()
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), 'utf-8')
}

export async function getStoredProfile(userId: string): Promise<StoredProfile | null> {
  const store = await readStore()
  return store[userId] ?? null
}

export async function updateStoredProfile(userId: string, updates: StoredProfile): Promise<StoredProfile> {
  const store = await readStore()
  const next = {
    ...(store[userId] ?? {}),
    ...Object.fromEntries(Object.entries(updates).filter(([, value]) => value !== undefined)),
  }
  store[userId] = next
  await writeStore(store)
  return next
}

export async function mergeStoredProfile(user: AuthUser): Promise<AuthUser> {
  const stored = await getStoredProfile(user.id)
  if (!stored) return user
  return {
    ...user,
    ...stored,
  }
}
