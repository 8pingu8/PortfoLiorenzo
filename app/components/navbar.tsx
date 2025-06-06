import './navbar.css'
import { Link, useFetcher, useLocation } from '@remix-run/react'
import { clsx } from 'clsx'
import { motion, useAnimation, useReducedMotion } from 'framer-motion'
import * as React from 'react'
import { kodyProfiles } from '#app/images.tsx'
import { type OptionalTeam } from '#app/utils/misc.tsx'
import { useRequestInfo } from '#app/utils/request-info.ts'
import { useTeam } from '#app/utils/team-provider.tsx'
import { THEME_FETCHER_KEY, useOptimisticThemeMode } from '#app/utils/theme.tsx'
import { useRootData } from '#app/utils/use-root-data.ts'
import { useElementState } from './hooks/use-element-state.tsx'
import { LaptopIcon, MoonIcon, SunIcon, DownloadIcon } from './icons.tsx'
import { TeamCircle } from './team-circle.tsx'

const LINKS = [
	{ name: 'Bio', to: '/' },
	{ name: 'Portfolio', to: '/projects' },
	{ name: 'CV', to: '/cv/CV_LJA_2025.pdf', download: true },
]

const MOBILE_LINKS = [
	{ name: 'Bio', to: '/' },
	{ name: 'Portfolio', to: '/projects' },
	{ name: 'CV', to: '/cv/CV_LJA_2025.pdf', download: true },
]

function NavLink({
	to,
	download,
	...rest
}: Omit<Parameters<typeof Link>['0'], 'to'> & { to: string; download?: boolean }) {
	const location = useLocation()
	const isSelected =
		(to === '/projects' && location.pathname === '/projects') ||
		(to === '/' && location.pathname === '/')

	return (
		<li className="px-5 py-2">
			{download ? (
				<a
					href={to}
					download
					target="_blank"
					className={clsx(
						'block whitespace-nowrap text-lg font-medium hover:text-team-current focus:text-team-current focus:outline-none underlined',
						{
							'text-team-current active': isSelected,
							'text-secondary': !isSelected,
						},
					)}
					{...rest}
				>
					<span className="flex items-center gap-2">
						{rest.children}
						<DownloadIcon size={20} />
					</span>
				</a>
			) : (
				<Link
					prefetch="intent"
					target={download ? "_blank" : undefined}
					className={clsx(
						'block whitespace-nowrap text-lg font-medium hover:text-team-current focus:text-team-current focus:outline-none underlined',
						{
							'text-team-current active': isSelected,
							'text-secondary': !isSelected,
						},
					)}
					to={to}
					{...rest}
				>
					{rest.children}
				</Link>
			)}
		</li>
	)
}

const iconTransformOrigin = { transformOrigin: '50% 100px' }
function DarkModeToggle({
	variant = 'icon',
}: {
	variant?: 'icon' | 'labelled'
}) {
	const requestInfo = useRequestInfo()
	const fetcher = useFetcher({ key: THEME_FETCHER_KEY })

	const optimisticMode = useOptimisticThemeMode()
	const mode = optimisticMode ?? requestInfo.userPrefs.theme ?? 'dark'
	const nextMode =
		mode === 'system' ? 'light' : mode === 'light' ? 'dark' : 'system'

	const iconSpanClassName =
		'absolute inset-0 transform transition-transform duration-700 motion-reduce:duration-[0s]'
	return (
		<fetcher.Form method="POST" action="/action/set-theme">
			<input type="hidden" name="theme" value={nextMode} />

			<button
				type="submit"
				className={clsx(
					'border-secondary hover:border-primary focus:border-primary inline-flex h-14 items-center justify-center overflow-hidden rounded-full border-2 p-1 transition focus:outline-none',
					{
						'w-14': variant === 'icon',
						'px-8': variant === 'labelled',
					},
				)}
			>
				{/* note that the duration is longer then the one on body, controlling the bg-color */}
				<div className="relative h-8 w-8">
					<span
						className={clsx(
							iconSpanClassName,
							mode === 'dark' ? 'rotate-0' : 'rotate-90',
						)}
						style={iconTransformOrigin}
					>
						<MoonIcon />
					</span>
					<span
						className={clsx(
							iconSpanClassName,
							mode === 'light' ? 'rotate-0' : '-rotate-90',
						)}
						style={iconTransformOrigin}
					>
						<SunIcon />
					</span>

					<span
						className={clsx(
							iconSpanClassName,
							mode === 'system' ? 'translate-y-0' : 'translate-y-10',
						)}
						style={iconTransformOrigin}
					>
						<LaptopIcon size={32} />
					</span>
				</div>
				<span className={clsx('ml-4', { 'sr-only': variant === 'icon' })}>
					{`Switch to ${
						nextMode === 'system'
							? 'system'
							: nextMode === 'light'
								? 'light'
								: 'dark'
					} mode`}
				</span>
			</button>
		</fetcher.Form>
	)
}

function MobileMenu() {
	const menuButtonRef = React.useRef<HTMLButtonElement>(null)
	const popoverRef = React.useRef<HTMLDivElement>(null)
	return (
		<div
			onBlur={(event) => {
				if (!popoverRef.current || !menuButtonRef.current) return
				if (
					popoverRef.current.matches(':popover-open') &&
					!event.currentTarget.contains(event.relatedTarget)
				) {
					const isRelatedTargetBeforeMenu =
						event.relatedTarget instanceof Node &&
						event.currentTarget.compareDocumentPosition(event.relatedTarget) ===
							Node.DOCUMENT_POSITION_PRECEDING
					const focusableElements = Array.from(
						event.currentTarget.querySelectorAll('button,a'),
					)
					const elToFocus = isRelatedTargetBeforeMenu
						? focusableElements.at(-1)
						: focusableElements.at(0)
					if (elToFocus instanceof HTMLElement) {
						elToFocus.focus()
					} else {
						menuButtonRef.current.focus()
					}
				}
			}}
		>
			<button
				ref={menuButtonRef}
				className="focus:border-primary hover:border-primary border-secondary text-primary inline-flex h-14 w-14 items-center justify-center rounded-full border-2 p-1 transition focus:outline-none"
				popoverTarget="mobile-menu"
			>
				<svg
					width="32"
					height="32"
					viewBox="0 0 32 32"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<rect x="6" y="9" width="20" height="2" rx="1" fill="currentColor" />
					<rect x="6" y="15" width="20" height="2" rx="1" fill="currentColor" />
					<rect x="6" y="21" width="20" height="2" rx="1" fill="currentColor" />
				</svg>
			</button>
			<div
				id="mobile-menu"
				ref={popoverRef}
				popover=""
				onToggle={() => window.scrollTo(0, 0)}
				className="fixed bottom-0 left-0 right-0 top-[128px] m-0 h-[calc(100svh-128px)] w-full"
			>
				<div className="bg-primary flex h-full flex-col overflow-y-scroll border-t border-gray-200 pb-12 dark:border-gray-600">
					{MOBILE_LINKS.map((link) => (
						<Link
							className="hover:bg-secondary focus:bg-secondary text-primary border-b border-gray-200 px-5vw py-9 hover:text-team-current dark:border-gray-600"
							key={link.to}
							to={link.to}
							target={link.download ? "_blank" : undefined}
							onClick={() => {
								popoverRef.current?.hidePopover()
							}}
						>
							{link.name}
						</Link>
					))}
					{/*<div className="py-9 text-center">
						<DarkModeToggle variant="labelled" />
					</div>*/}
				</div>
			</div>
		</div>
	)
}

// Timing durations used to control the speed of the team ring in the profile button.
// Time is seconds per full rotation
const durations = {
	initial: 40,
	hover: 3,
	focus: 3,
	active: 0.25,
}

function ProfileButton({
	imageUrl,
	imageAlt,
	team,
}: {
	imageUrl: string
	imageAlt: string
	team: OptionalTeam
}) {
	const controls = useAnimation()
	const [ref, state] = useElementState()
	const shouldReduceMotion = useReducedMotion()

	React.useEffect(() => {
		void controls.start((_, { rotate = 0 }) => {
			const target =
				typeof rotate === 'number'
					? state === 'initial'
						? rotate - 360
						: rotate + 360
					: 360

			return shouldReduceMotion
				? {}
				: {
						rotate: [rotate, target],
						transition: {
							duration: durations[state],
							repeat: Infinity,
							ease: 'linear',
						},
					}
		})
	}, [state, controls, shouldReduceMotion])

	return (
		<div
			className={clsx(
				'ml-4 inline-flex h-14 w-14 items-center justify-center rounded-full focus:outline-none',
			)}
			ref={ref}
		>
			<motion.div
				className="absolute"
				animate={controls}
			>
				<TeamCircle size={56} team={team} />
			</motion.div>
			<img
				className={clsx('inline h-10 w-10 select-none rounded-full')}
				src={imageUrl}
				alt={imageAlt}
				crossOrigin="anonymous"
			/>
		</div>
	)
}

function Navbar() {
	const [team] = useTeam()
	const { requestInfo } = useRootData()
	const avatar = kodyProfiles[team]
	const location = useLocation()
	
	// Check if we're on a project detail page
	const isProjectDetail = location.pathname.startsWith('/projects/')
	const projectName = isProjectDetail ? location.pathname.split('/').pop()?.replace(/-/g, ' ') : null

	return (
		<div className="px-5vw py-9 lg:py-12">
			<nav className="text-primary mx-auto flex max-w-8xl items-center justify-between">
				<div className="flex justify-center gap-4 align-middle">
					<Link
						prefetch="intent"
						to="/"
						className="text-primary block whitespace-nowrap text-2xl font-medium transition focus:outline-none underlined"
					>
						<h1>Lorenzo Jacopo Avalle</h1>
					</Link>
				</div>

				<div className="flex items-center gap-8">
					<ul className="hidden lg:flex">
						{LINKS.map((link) => (
							<NavLink key={link.to} to={link.to} download={link.download}>
								{link.name}
							</NavLink>
						))}
					</ul>

					{isProjectDetail && (
						<div className="hidden lg:block">
							<span className="text-lg font-medium text-team-current active underlined">
								{projectName}
							</span>
						</div>
					)}
				</div>

				<div className="flex items-center justify-center">
					<div className="block lg:hidden">
						<MobileMenu />
					</div>
					{/*<div className="noscript-hidden hidden lg:block">
						<DarkModeToggle />
					</div>*/}

					<ProfileButton
						imageUrl={avatar.src}
						imageAlt={avatar.alt}
						team={team}
					/>
				</div>
			</nav>
		</div>
	)
}

export { Navbar }
