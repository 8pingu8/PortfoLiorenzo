import { nodeProfilingIntegration } from '@sentry/profiling-node'
import Sentry from '@sentry/remix'

export function init() {
	if (!process.env.SENTRY_DSN) return

	Sentry.init({
		dsn: process.env.SENTRY_DSN,
		environment: process.env.NODE_ENV,
		tracesSampleRate: process.env.NODE_ENV === 'production' ? 1 : 0,
		autoInstrumentRemix: true,
		denyUrls: [
			/\/healthcheck/,
			/\/refresh-cache/,
			/\/refresh-content/,
			/\/refresh-memory/,
			/\/refresh-stats/,
			/\/stats\.json/,
			/\/sitemap\.xml/,
			/\/_content\/mdx/,
			/\/_content\/talks\.json/,
			/\/_content\/workshops\.json/,
			/\/_content\/testimonials\.json/,
			/\/_content\/blog\.json/,
			/\/_content\/blog-rss\.xml/,
		],
		integrations: [
			Sentry.httpIntegration(),
			nodeProfilingIntegration(),
		],
		tracesSampler(samplingContext) {
			if (samplingContext.request?.url) {
				const url = new URL(samplingContext.request.url)
				if (url.pathname === '/refresh-memory') return 0
			}
			return 1
		},
	})
}
