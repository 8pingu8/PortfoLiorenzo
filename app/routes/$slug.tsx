import {
	type LoaderFunctionArgs,
	json,
	redirect,
} from '@remix-run/node'
import { pathedRoutes } from '#app/other-routes.server.ts'

export async function loader({ params, request }: LoaderFunctionArgs) {
	// because this is our catch-all thing, we'll do an early return for anything
	// that has a other route setup. The response will be handled there.
	if (pathedRoutes[new URL(request.url).pathname]) {
		throw new Response('Use other route', { status: 404 })
	}

	// Since we're not using MDX anymore, just redirect to 404
	throw redirect('/404')
}
