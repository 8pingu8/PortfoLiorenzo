import {
	type ActionFunctionArgs,
	json,
	type LoaderFunctionArgs,
} from '@remix-run/node'
import {
	Form,
	useFetcher,
	useLoaderData,
	useSearchParams,
	useSubmit,
} from '@remix-run/react'
import invariant from 'tiny-invariant'
import { Button } from '#app/components/button.tsx'
import {
	Field,
	FieldContainer,
	inputClassName,
} from '#app/components/form-elements.tsx'
import { SearchIcon } from '#app/components/icons.tsx'
import { Spacer } from '#app/components/spacer.tsx'
import { H2, H3 } from '#app/components/typography.tsx'
import {
	cache,
	getAllCacheKeys,
	lruCache,
	searchCacheKeys,
} from '#app/utils/cache.server.ts'
import {
	useDebounce,
	useDoubleCheck,
	useCapturedRouteError,
} from '#app/utils/misc.tsx'
import { requireAdminUser } from '#app/utils/session.server.ts'

export async function loader({ request }: LoaderFunctionArgs) {
	await requireAdminUser(request)
	const searchParams = new URL(request.url).searchParams
	const query = searchParams.get('query')
	const limit = Number(searchParams.get('limit') ?? 100)

	let cacheKeys: { sqlite: Array<string>; lru: Array<string> }
	if (typeof query === 'string') {
		cacheKeys = await searchCacheKeys(query, limit)
	} else {
		cacheKeys = await getAllCacheKeys(limit)
	}
	return json({ cacheKeys })
}

export async function action({ request }: ActionFunctionArgs) {
	await requireAdminUser(request)
	const formData = await request.formData()
	const key = formData.get('cacheKey')
	const type = formData.get('type')

	invariant(typeof key === 'string', 'cacheKey must be a string')
	invariant(typeof type === 'string', 'type must be a string')

	switch (type) {
		case 'sqlite': {
			await cache.delete(key)
			break
		}
		case 'lru': {
			lruCache.delete(key)
			break
		}
		default: {
			throw new Error(`Unknown cache type: ${type}`)
		}
	}
	return json({ success: true })
}

export default function CacheAdminRoute() {
	const data = useLoaderData<typeof loader>()
	const [searchParams] = useSearchParams()
	const submit = useSubmit()
	const query = searchParams.get('query') ?? ''
	const limit = searchParams.get('limit') ?? '100'

	const handleFormChange = useDebounce((form: HTMLFormElement) => {
		submit(form)
	}, 400)

	return (
		<div className="mx-10vw">
			<H2 className="mt-3">Cache Admin</H2>
			<Spacer size="2xs" />
			<Form
				method="get"
				className="flex flex-col gap-4"
				onChange={(e) => handleFormChange(e.currentTarget)}
			>
				<div className="flex-1">
					<div className="relative flex-1">
						<button
							type="submit"
							className="absolute left-6 top-0 flex h-full items-center justify-center border-none bg-transparent p-0 text-slate-500"
						>
							<SearchIcon />
						</button>
						<input
							type="search"
							defaultValue={query}
							name="query"
							placeholder="Filter Cache Keys"
							className="text-primary bg-primary border-secondary focus:bg-secondary w-full rounded-full border py-6 pl-14 pr-6 text-lg font-medium hover:border-team-current focus:border-team-current focus:outline-none md:pr-24"
						/>
						<div className="absolute right-2 top-0 flex h-full w-14 items-center justify-between text-lg font-medium text-slate-500">
							<span title="Total results shown">
								{data.cacheKeys.sqlite.length + data.cacheKeys.lru.length}
							</span>
						</div>
					</div>
				</div>
			</Form>
			<Spacer size="2xs" />
			<div className="flex flex-col gap-4">
				<H3>LRU Cache:</H3>
				{data.cacheKeys.lru.map((key) => (
					<CacheKeyRow
						key={key}
						cacheKey={key}
						type="lru"
					/>
				))}
			</div>
			<Spacer size="3xs" />
			<div className="flex flex-col gap-4">
				<H3>SQLite Cache:</H3>
				{data.cacheKeys.sqlite.map((key) => (
					<CacheKeyRow
						key={key}
						cacheKey={key}
						type="sqlite"
					/>
				))}
			</div>
		</div>
	)
}

function CacheKeyRow({
	cacheKey,
	type,
}: {
	cacheKey: string
	type: string
}) {
	const fetcher = useFetcher()
	const dc = useDoubleCheck()
	return (
		<div className="flex items-center gap-2 font-mono">
			<fetcher.Form method="POST">
				<input type="hidden" name="cacheKey" value={cacheKey} />
				<input type="hidden" name="type" value={type} />
				<Button
					size="small"
					variant="danger"
					{...dc.getButtonProps({ type: 'submit' })}
				>
					{fetcher.state === 'idle'
						? dc.doubleCheck
							? 'You sure?'
							: 'Delete'
						: 'Deleting...'}
				</Button>
			</fetcher.Form>
			<a
				href={`/resources/cache/${type}/${encodeURIComponent(
					cacheKey,
				)}`}
			>
				{cacheKey}
			</a>
		</div>
	)
}

export function ErrorBoundary() {
	const error = useCapturedRouteError()
	console.error(error)

	if (error instanceof Error) {
		return <div>An unexpected error occurred: {error.message}</div>
	} else {
		return <div>Unknown error</div>
	}
}
