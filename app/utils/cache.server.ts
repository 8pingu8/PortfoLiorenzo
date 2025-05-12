import {
	type Cache,
	cachified as baseCachified,
	verboseReporter,
	type CacheEntry,
	type Cache as CachifiedCache,
	type CachifiedOptions,
	totalTtl,
} from '@epic-web/cachified'
import { remember } from '@epic-web/remember'
import { LRUCache } from 'lru-cache'
import { getUser } from './session.server.ts'
import { time, type Timings } from './timing.server.ts'

const lruInstance = remember(
	'lru-cache',
	() => new LRUCache<string, CacheEntry<unknown>>({ max: 5000 }),
)

export const lruCache = {
	set(key, value) {
		const ttl = totalTtl(value.metadata)
		return lruInstance.set(key, value, {
			ttl: ttl === Infinity ? undefined : ttl,
			start: value.metadata.createdTime,
		})
	},
	get(key) {
		return lruInstance.get(key)
	},
	delete(key) {
		return lruInstance.delete(key)
	},
} satisfies Cache

export const cache: CachifiedCache = {
	name: 'LRU cache',
	get(key) {
		return lruCache.get(key)
	},
	async set(key, entry) {
		return lruCache.set(key, entry)
	},
	async delete(key) {
		return lruCache.delete(key)
	},
}

export async function getAllCacheKeys(limit: number) {
	return {
		sqlite: [],
		lru: [...lruInstance.keys()],
	}
}

export async function searchCacheKeys(search: string, limit: number) {
	return {
		sqlite: [],
		lru: [...lruInstance.keys()].filter((key) => key.includes(search)),
	}
}

export async function shouldForceFresh({
	forceFresh,
	request,
	key,
}: {
	forceFresh?: boolean | string
	request?: Request
	key: string
}) {
	if (typeof forceFresh === 'boolean') return forceFresh
	if (typeof forceFresh === 'string') return forceFresh.split(',').includes(key)

	if (!request) return false
	const fresh = new URL(request.url).searchParams.get('fresh')
	if (typeof fresh !== 'string') return false
	if ((await getUser(request))?.role !== 'ADMIN') return false
	if (fresh === '') return true

	return fresh.split(',').includes(key)
}

export async function cachified<Value>({
	request,
	timings,
	...options
}: Omit<CachifiedOptions<Value>, 'forceFresh'> & {
	request?: Request
	timings?: Timings
	forceFresh?: boolean | string
}): Promise<Value> {
	let cachifiedResolved = false
	const cachifiedPromise = baseCachified(
		{
			...options,
			forceFresh: await shouldForceFresh({
				forceFresh: options.forceFresh,
				request,
				key: options.key,
			}),
			getFreshValue: async (context) => {
				// if we've already retrieved the cached value, then this may be called
				// after the response has already been sent so there's no point in timing
				// how long this is going to take
				if (!cachifiedResolved && timings) {
					return time(() => options.getFreshValue(context), {
						timings,
						type: `getFreshValue:${options.key}`,
						desc: `request forced to wait for a fresh ${options.key} value`,
					})
				}
				return options.getFreshValue(context)
			},
		},
		verboseReporter(),
	)
	const result = await time(cachifiedPromise, {
		timings,
		type: `cache:${options.key}`,
		desc: `${options.key} cache retrieval`,
	})
	cachifiedResolved = true
	return result
}
