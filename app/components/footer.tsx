import { Link } from '@remix-run/react'
import { AnchorOrLink } from '#app/utils/misc.tsx'
import { externalLinks } from '../external-links.tsx'
import { IconLink } from './icon-link.tsx'
import { GithubIcon, XIcon, YoutubeIcon } from './icons.tsx'
import { H4 } from './typography.tsx'

function AboutSection() {
	return (
		<div>
			<H4 as="div">Lorenzo Jacopo Avalle</H4>

			<p className="text-secondary mt-6 max-w-md text-2xl">
				Game Developer & Creative Technologist
			</p>

			<div className="text-secondary mt-6 flex items-center gap-4">
				<IconLink href={externalLinks.github}>
					<GithubIcon size={32} />
				</IconLink>
				<IconLink href={externalLinks.youtube}>
					<YoutubeIcon size={32} />
				</IconLink>
				<IconLink href={externalLinks.twitter}>
					<XIcon size={32} />
				</IconLink>
				<AnchorOrLink
					href="mailto:lorenzo.avalle@gmail.com"
					className="text-secondary text-lg hover:text-team-current focus:text-team-current focus:outline-none"
				>
					lorenzo.avalle@gmail.com
				</AnchorOrLink>
			</div>
		</div>
	)
}

function Footer() {
	return (
		<footer className="border-t border-gray-200 py-16 dark:border-gray-600">
			<div className="relative mx-10vw">
				<div className="relative mx-auto max-w-7xl">
					<AboutSection />
				</div>
			</div>
		</footer>
	)
}

export { Footer }
