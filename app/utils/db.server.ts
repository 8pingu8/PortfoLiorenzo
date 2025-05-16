// This is a placeholder file to replace prisma.server.ts
// Since we're not using a database in this version of the site

import { type User, type Session } from '#app/types.ts'

// Mock database implementation
export const db = {
  async createSession(userId: string): Promise<Session> {
    return {
      id: 'mock-session-id',
      userId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    }
  },

  async getSession(sessionId: string): Promise<Session | null> {
    // Mock implementation
    return null
  },

  async deleteSession(sessionId: string): Promise<void> {
    // Mock implementation
  },

  async findUserById(userId: string): Promise<User | null> {
    // Mock implementation
    return null
  },

  async findUserByEmail(email: string): Promise<User | null> {
    // Mock implementation
    return null
  },

  async deleteUserSessions(userId: string, currentSessionId: string): Promise<void> {
    // Mock implementation
  }
}

export function getMagicLink({
  emailAddress,
  validateSessionMagicLink,
  domainUrl,
}: {
  emailAddress: string
  validateSessionMagicLink: boolean
  domainUrl: string
}): string {
  // Mock implementation
  return `${domainUrl}/magic-link?token=mock-token&email=${encodeURIComponent(emailAddress)}`
}

export function validateMagicLink(url: string, storedMagicLink: string | null): Promise<string> {
  // Mock implementation
  return Promise.resolve('mock@example.com')
}

export const sessionExpirationTime = 30 * 24 * 60 * 60 * 1000 // 30 days

export type DbUser = never
export type DbSession = never 