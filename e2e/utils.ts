import path from 'path'
import { test as base } from '@playwright/test'
import { parse } from 'cookie'
import fsExtra from 'fs-extra'
import invariant from 'tiny-invariant'
import '../app/entry.server.tsx'
import { getSession } from '../app/utils/session.server.ts'
import { type User } from '../types'

type Email = {
	to: string
	from: string
	subject: string
	text: string
	html?: string | null
}

type MSWData = {
	email: Record<string, Email>
}

export async function readEmail(
	recipientOrFilter: string | ((email: Email) => boolean),
) {
	try {
		const mswOutput = fsExtra.readJsonSync(
			path.join(process.cwd(), './mocks/msw.local.json'),
		) as unknown as MSWData
		const emails = Object.values(mswOutput.email).reverse() // reverse so we get the most recent email first
		// TODO: add validation
		if (typeof recipientOrFilter === 'string') {
			return emails.find(
				(email: Email) => email.to === recipientOrFilter,
			) as Email | null
		} else {
			return emails.find(recipientOrFilter) as Email | null
		}
	} catch (error: unknown) {
		console.error(`Error reading the email fixture`, error)
		return null
	}
}

export function extractUrl(text: string) {
	const urlRegex = /(?<url>https?:\/\/[^\s$.?#].[^\s]*)/
	const match = text.match(urlRegex)
	return match?.groups?.url
}

const users = new Set<User>()

export async function insertNewUser(userProperties?: Partial<User>): Promise<User> {
	const defaultUser: User = {
		id: 'test-user-id',
		email: 'test@example.com',
		name: 'Test User',
		username: 'testuser',
		createdAt: new Date(),
		updatedAt: new Date(),
		...userProperties,
	}
	return defaultUser
}

export async function deleteUserByEmail(email: string) {
	// Implementation needed
}

export const test = base.extend<{
	login: (userOverrides?: Partial<User>) => Promise<User>
}>({
	login: [
		async ({ page, baseURL }, use) => {
			invariant(baseURL, 'baseURL is required playwright config')
			return use(async (userOverrides) => {
				const user = await insertNewUser(userOverrides)
				const session = await getSession(new Request(baseURL))
				await session.signIn(user)
				const cookieValue = await session.commit()
				invariant(
					cookieValue,
					'Something weird happened creating a session for a new user. No cookie value given from session.commit()',
				)
				const { KCD_root_session } = parse(cookieValue)
				invariant(KCD_root_session, 'No KCD_root_session cookie found')
				await page.context().addCookies([
					{
						name: 'KCD_root_session',
						sameSite: 'Lax',
						url: baseURL,
						httpOnly: true,
						secure: process.env.NODE_ENV === 'production',
						value: KCD_root_session,
					},
				])
				return user
			})
		},
		{ auto: true },
	],
})

export const { expect } = test

test.afterEach(async () => {
	// Implementation needed
})

// Mock database client for e2e tests
class MockClient {
	async user(where: { email: string }): Promise<User | null> {
		// Mock implementation
		return null
	}
}

export const db = new MockClient()

export function readFixture(subdir: string, name: string) {
	return fsExtra.readJSON(
		path.join(process.cwd(), 'tests', '__fixtures__', subdir, `${name}.json`),
	)
}

export function createFixture(subdir: string, name: string, data: MSWData) {
	return fsExtra.outputJSON(
		path.join(process.cwd(), 'tests', '__fixtures__', subdir, `${name}.json`),
		data,
		{ spaces: 2 },
	)
}

export function requireFixture(subdir: string, name: string) {
	return require(path.join(
		process.cwd(),
		'tests',
		'__fixtures__',
		subdir,
		`${name}.json`,
	))
}

export function getSessionSetCookieHeader(response: { headers: { get(name: string): string | null } }) {
	const setCookieHeader = response.headers.get('set-cookie')
	if (!setCookieHeader) return null
	const sessionMatch = setCookieHeader.match(
		/(?:session|__session)=(?<sessionId>[^;]+)/,
	)
	if (!sessionMatch?.groups?.sessionId) return null
	return sessionMatch.groups.sessionId
}

export async function getSessionFromSetCookieHeader(response: { headers: { get(name: string): string | null } }) {
	const sessionId = getSessionSetCookieHeader(response)
	if (!sessionId) return null
	// Create a mock Request object
	const mockRequest = new Request('http://example.com', {
		headers: new Headers({
			Cookie: `KCD_root_session=${sessionId}`,
		}),
	})
	return getSession(mockRequest)
}

export function getSessionFromCookieHeader(cookieHeader: string | null) {
	if (!cookieHeader) return null
	const cookies = parse(cookieHeader)
	return cookies.session || cookies.__session || null
}
