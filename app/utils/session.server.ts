import { createCookieSessionStorage } from '@remix-run/node'
import { getRequiredServerEnvVar } from './misc.tsx'

const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: 'KCD_root_session',
		secure: true,
		secrets: [getRequiredServerEnvVar('SESSION_SECRET')],
		sameSite: 'lax',
		path: '/',
		maxAge: 30 * 24 * 60 * 60, // 30 days
		httpOnly: true,
	},
})

async function getSession(request: Request) {
	const session = await sessionStorage.getSession(request.headers.get('Cookie'))
	const initialValue = await sessionStorage.commitSession(session)

	const commit = async () => {
		const currentValue = await sessionStorage.commitSession(session)
		return currentValue === initialValue ? null : currentValue
	}

	return {
		session,
		commit,
		getHeaders: async (headers: ResponseInit['headers'] = new Headers()) => {
			const value = await commit()
			if (!value) return headers
			if (headers instanceof Headers) {
				headers.set('Set-Cookie', value)
			} else if (Array.isArray(headers)) {
				headers.push(['Set-Cookie', value])
			} else {
				headers['Set-Cookie'] = value
			}
			return headers
		},
	}
}

async function requireAdminUser(): Promise<boolean> {
    return false;
}

export { getSession, sessionStorage, requireAdminUser }
