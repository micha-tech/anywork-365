import type { User } from '@/types'
import { getUserFullByUid } from './queries'

const userStore: Map<string, User & { passwordHash: string }> = new Map()

export async function findUserById(id: string): Promise<User | undefined> {
  try {
    const user = await getUserFullByUid(id)
    if (user) return user
  } catch {}
  for (const u of userStore.values()) {
    if (u.id === id) return u
  }
  return undefined
}

export function findUserByEmail(email: string): (User & { passwordHash: string }) | undefined {
  return userStore.get(email)
}

export function createUser(data: Omit<User, 'id' | 'createdAt'> & { passwordHash: string }): User & { passwordHash: string } {
  const user = {
    ...data,
    id: `user-${Date.now()}`,
    createdAt: new Date().toISOString(),
  }
  userStore.set(user.email, user)
  return user
}

export function addUser(user: User & { passwordHash: string }) {
  userStore.set(user.email, user)
}