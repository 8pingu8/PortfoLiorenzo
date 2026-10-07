import { getGenericSocialImage, images } from '#app/images.tsx'

export function getSocialMetas({
	url,
	title = 'Lorenzo Jacopo Avalle - Full Stack & Flutter Developer',
	description =
		'Portfolio of Lorenzo Jacopo Avalle — Flutter, full stack web & mobile, Industry 4.0, and Unreal Engine game projects.',
	image = getGenericSocialImage({
		url,
		words: title,
		featuredImage: images.kodyFlyingSnowboardingBlue.id,
	}),
	keywords = '',
}: {
	image?: string
	url: string
	title?: string
	description?: string
	keywords?: string
}) {
	return [
		{ title },
		{ name: 'description', content: description },
		{ name: 'keywords', content: keywords },
		{ name: 'image', content: image },
		{ name: 'og:url', content: url },
		{ name: 'og:title', content: title },
		{ name: 'og:description', content: description },
		{ name: 'og:image', content: image },
		{
			name: 'twitter:card',
			content: image ? 'summary_large_image' : 'summary',
		},
		{ name: 'twitter:creator', content: '@kentcdodds' },
		{ name: 'twitter:site', content: '@kentcdodds' },
		{ name: 'twitter:title', content: title },
		{ name: 'twitter:description', content: description },
		{ name: 'twitter:image', content: image },
		{ name: 'twitter:image:alt', content: title },
	]
}
