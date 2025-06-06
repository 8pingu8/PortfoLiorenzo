import { matchSorter, rankings } from 'match-sorter'
import { getEpisodePath as getCKEpisodePath } from '#app/utils/call-kent.ts'
import { getCWKEpisodePath } from '#app/utils/chats-with-kent.ts'
import { stripHtml } from '#app/utils/markdown.server.ts'
import { typedBoolean } from '#app/utils/misc.tsx'
import { getSeasons as getChatsWithKentSeasons } from '#app/utils/simplecast.server.ts'
import { getTalksAndTags } from '#app/utils/talks.server.ts'
import { getEpisodes as getCallKentEpisodes } from '#app/utils/transistor.server.ts'
import { getWorkshops } from '#app/utils/workshops.server.ts'

type Item = {
	route: string
	title: string
	values: {
		priority: string | Array<string | undefined>
		other: Array<string | undefined>
	}
} & (
	| {
			segment: 'Talks' | 'Workshops'
			metadata: {
				slug: string
				seasonNumber?: never
				episodeNumber?: never
			}
	  }
	| {
			segment: 'Call Kent Podcast Episodes' | 'Chats with Kent Episodes'
			metadata: {
				slug?: never
				seasonNumber: number
				episodeNumber: number
			}
	  }
)

type NormalizedItemGroup = {
	prefix: 't' | 'cwk' | 'ck' | 'w'
	items: Array<Item>
}

export async function searchKCD({
	request,
	query,
}: {
	request: Request
	query: string
}) {
	const [callKentEpisodes, chatsWithKentEpisodes, { talks }, workshops] =
		await Promise.all([
			getCallKentEpisodes({ request }),
			getChatsWithKentSeasons({ request }),
			getTalksAndTags({ request }),
			getWorkshops({ request }),
		])

	const normalizedGroups: Array<NormalizedItemGroup> = [
		{
			prefix: 't',
			items: await Promise.all(
				talks.map(async (t) => ({
					route: `/talks/${t.slug}`,
					segment: 'Talks',
					title: t.title,
					metadata: { slug: t.slug },
					values: {
						priority: t.title,
						other: [
							t.description,
							...t.tags,
							...(
								await Promise.all(
									t.deliveries.map((d) =>
										d.eventHTML ? stripHtml(d.eventHTML) : null,
									),
								)
							).filter(typedBoolean),
						],
					},
				})),
			),
		},
		{
			prefix: 'cwk',
			items: await Promise.all(
				chatsWithKentEpisodes
					.flatMap((s) => s.episodes)
					.map(async (e) => ({
						route: getCWKEpisodePath({
							seasonNumber: e.seasonNumber,
							episodeNumber: e.episodeNumber,
						}),
						title: e.title,
						segment: 'Chats with Kent Episodes',
						metadata: {
							seasonNumber: e.seasonNumber,
							episodeNumber: e.episodeNumber,
						},
						values: {
							priority: [
								e.title,
								...e.guests.flatMap((g) => [g.name, g.x, g.github]),
							],
							other: [
								e.description,
								await stripHtml(e.summaryHTML),
								...e.guests.map((g) => g.company),
								...(await Promise.all(
									e.homeworkHTMLs.map((h) => stripHtml(h)),
								)),
								...e.resources.flatMap((r) => [r.name, r.url]),
							],
						},
					})),
			),
		},
		{
			prefix: 'ck',
			items: callKentEpisodes.map((e) => ({
				route: getCKEpisodePath({
					seasonNumber: e.seasonNumber,
					episodeNumber: e.episodeNumber,
				}),
				title: e.title,
				segment: 'Call Kent Podcast Episodes',
				metadata: {
					seasonNumber: e.seasonNumber,
					episodeNumber: e.episodeNumber,
				},
				values: {
					priority: e.title,
					other: [e.description, ...e.keywords],
				},
			})),
		},
		{
			prefix: 'w',
			items: await Promise.all(
				workshops.map(async (w) => ({
					route: `/workshops/${w.slug}`,
					title: w.title,
					segment: 'Workshops',
					metadata: { slug: w.slug },
					values: {
						priority: w.title,
						other: [
							...w.categories,
							...w.events.map((e) => e.title),
							...(w.meta.keywords ?? []),
							w.description,
							...(
								await Promise.all(
									w.keyTakeawayHTMLs.map(async (t) => [
										await stripHtml(t.title),
										await stripHtml(t.description),
									]),
								)
							).flatMap((s) => s),
							...(await Promise.all(w.topicHTMLs.flatMap((t) => stripHtml(t)))),
						],
					},
				})),
			),
		},
	]

	const matchSorterOptions = {
		keys: [
			{ key: 'values.priority', threshold: rankings.WORD_STARTS_WITH },
			{
				key: 'values.other',
				threshold: rankings.WORD_STARTS_WITH,
				maxRanking: rankings.CONTAINS,
			},
		],
	}

	for (const normalizedGroup of normalizedGroups) {
		const prefix = `${normalizedGroup.prefix}:`
		if (!query.startsWith(prefix)) continue
		const actualQuery = query.slice(prefix.length)
		return findWinners(normalizedGroup.items, actualQuery)
	}
	return findWinners(
		normalizedGroups.flatMap((n) => n.items),
		query,
	)

	function findWinners(items: NormalizedItemGroup['items'], search: string) {
		const results = matchSorter(items, search, matchSorterOptions)
		if (results.length) {
			return results
		}

		// if we couldn't find a winner with the words altogether, try to find one
		// that matches every word
		const words = Array.from(new Set(search.split(' ')))
		// if there's only one word and we got this far we already know it won't match
		// so don't bother and just send back an empty result
		if (words.length <= 1) {
			return []
		}

		return words.reduce(
			(remaining, word) => matchSorter(remaining, word, matchSorterOptions),
			items,
		)
	}
}
