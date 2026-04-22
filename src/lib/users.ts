import type { User } from '@/types'
import { MOCK_PROFESSIONALS } from './mockData'

// In-memory user store (shared with auth)
const userStore: Map<string, User & { passwordHash: string }> = new Map()

export function findUserById(id: string): User | undefined {
  // Check mock professionals first
  const mockUser = MOCK_PROFESSIONALS.find((u: User) => u.id === id)
  if (mockUser) return mockUser
  
  // Check registered users
  for (const user of userStore.values()) {
    if (user.id === id) return user
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