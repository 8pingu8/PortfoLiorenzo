import { redirect, type LoaderFunctionArgs } from '@remix-run/node'
import { getEpisodes } from '#app/utils/transistor.server.ts'

export async function loader({ request }: LoaderFunctionArgs) {
	return redirect('/')
}

export default function CallsIndex() {
	return <div>Oops... You should not see this.</div>
}
