import { type LoaderFunctionArgs, json } from '@remix-run/node'
import invariant from 'tiny-invariant'
import { cache } from '#app/utils/cache.server.ts'
import { requireAdminUser } from '#app/utils/session.server.ts'

export async function loader({ request, params }: LoaderFunctionArgs) {
	await requireAdminUser(request)
	const { cacheKey } = params
	invariant(cacheKey, 'cacheKey is required')
	return json({
		cacheKey,
		value: cache.get(cacheKey),
	})
}
