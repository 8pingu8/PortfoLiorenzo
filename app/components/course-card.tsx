import React from 'react'
import { clsx } from 'clsx'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { getImgProps, type ImageBuilder } from '#app/images.tsx'
import { Themed } from '#app/utils/theme.tsx'
import { ArrowIcon } from './icons.tsx'
import { Canvas, useFrame } from '@react-three/fiber'
import { useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { useGLTF, OrbitControls } from '@react-three/drei'
import { ClientOnly } from '../components/ClientOnly'

const arrowVariants: Variants = {
	initial: { x: 0, y: 0, opacity: 1, scale: 1 },
	action: {
		scale: [1, 1.2, 1.2, 1],
		x: [2, 10, -10, 0],
		y: [-2, -10, 10, 0],
		opacity: [1, 0, 0, 1],
		transition: {
			duration: 0.4,
			times: [0, 0.3, 0.7, 1],
			ease: ['easeIn', 'easeOut', 'backOut'],
		},
	},
}

export type CourseCardProps = {
	title: string
	description: string
	courseUrl: string
	horizontal?: boolean
	label?: string
	model?: string
	longDescription?: string
	isDetail?: boolean
	emoji?: string
	date?: string
	tags?: string[]
} & (
	| {
			imageBuilder: ImageBuilder
			lightImageBuilder?: never
			darkImageBuilder?: never
	  }
	| {
			imageBuilder?: never
			lightImageBuilder: ImageBuilder
			darkImageBuilder: ImageBuilder
	  }
)

const titleClassName =
	'text-xl/7 font-semibold text-balance tracking-tight text-gray-800 @sm:text-2xl/7 @2xl/grid:text-xl/7 @3xl/grid:text-2xl/7 @6xl/grid:text-3xl/9 dark:font-medium dark:tracking-normal dark:text-gray-200'
const descriptionClassName =
	'mt-2 text-balance text-base/6 text-gray-500 dark:prose-dark @6xl/grid:text-lg/6'

function CourseCardLink({
	href,
	className,
	textClassName,
}: {
	href: string
	className?: string
	textClassName?: string
}) {
	const shouldReduceMotion = useReducedMotion()

	return (
		<motion.a
			className={clsx(
				'course-card-button-gradient inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full border border-gray-300 bg-gray-100 text-gray-900 transition-all duration-300 hover:border-gray-500 hover:bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:border-slate-500',
				className,
			)}
			href={href}
			initial="initial"
			whileHover="action"
			whileTap="action"
			animate="initial"
		>
			<span
				className={clsx(
					'shrink-0 -translate-y-px whitespace-nowrap text-base @6xl/grid:text-lg',
					textClassName,
				)}
			>
				View Details
			</span>

			<motion.span variants={shouldReduceMotion ? {} : arrowVariants}>
				<svg 
					xmlns="http://www.w3.org/2000/svg" 
					viewBox="0 0 24 24" 
					fill="none" 
					stroke="currentColor" 
					strokeWidth="2" 
					strokeLinecap="round" 
					strokeLinejoin="round" 
					className="shrink-0 w-5 h-5"
				>
					<circle cx="11" cy="11" r="8" />
					<path d="m21 21-4.3-4.3" />
				</svg>
			</motion.span>
		</motion.a>
	)
}

function Project3DModel({ model, isDetail }: { model?: string; isDetail?: boolean }) {
	const groupRef = useRef<THREE.Group>(null)
	// Fix model path for detail page
	let modelPath = model
	if (isDetail && model && (model.endsWith('.glb') || model.endsWith('.gltf')) && !model.startsWith('..')) {
		modelPath = '../' + model.replace(/^\//, '')
	}
	// Load custom model if model is a .glb/.gltf path
	const isGLTF = modelPath && (modelPath.endsWith('.glb') || modelPath.endsWith('.gltf'))
	const gltf = isGLTF ? useGLTF(modelPath as string) : null

	useFrame(() => {
		// Add any additional animation here if needed
		if (groupRef.current) {
			groupRef.current.rotation.y += 0.005 // Subtle continuous rotation
		}
	})

	if (gltf) {
		return <primitive ref={groupRef} object={gltf.scene} scale={1.2} />
	}

	// Fallback to built-in shapes
	let geometry = <boxGeometry args={[1, 1, 1]} />
	if (model === 'sphere') geometry = <sphereGeometry args={[0.8, 32, 32]} />
	// Add more shapes as needed
	return (
		<mesh ref={groupRef} scale={1.2}>
			{geometry}
			<meshStandardMaterial color="#4f8cff" metalness={0.6} roughness={0.4} />
		</mesh>
	)
}

export { Project3DModel }

export function CourseCard({
	title,
	description,
	imageBuilder,
	darkImageBuilder,
	lightImageBuilder,
	courseUrl,
	label,
	horizontal = false,
	model,
	longDescription,
	isDetail = false,
	emoji,
	date,
	tags,
}: CourseCardProps) {
	function getImg(builder: ImageBuilder) {
		return (
			<img
				loading="lazy"
				{...getImgProps(builder, {
					className: clsx('z-10 h-[70%] w-auto'),
					widths: [152, 304, 456, 608, 760, 940],
					sizes: [
						'(max-width: 375px) 152px',
						'(min-width: 376px) and (max-width: 767px) 304px',
						'470px',
					],
				})}
			/>
		)
	}

	return (
		<>
			<div
				className={clsx(
					'course-card-gradient dark:bg-gray-850 relative flex h-full gap-5 overflow-hidden rounded-2xl bg-gray-100 p-6 ring-1 ring-inset ring-[rgba(0,0,0,0.05)] @sm:gap-6 @sm:p-9 @2xl/grid:gap-6 @2xl/grid:p-9 @6xl/grid:p-12 dark:ring-[rgba(255,255,255,0.05)]',
					horizontal ? 'flex-col @2xl:flex-row' : 'flex-col',
				)}
			>
				<div
					className={clsx(
						'relative',
						horizontal && 'w-full @2xl:order-last @2xl:w-[62%]',
					)}
				>
					<div className="absolute right-0 top-0 hidden origin-bottom-right -translate-y-full translate-x-5 -rotate-90 text-right font-mono text-[11px]/none uppercase tracking-widest text-gray-400 opacity-80 @sm:block @2xl/grid:block @6xl/grid:translate-x-6 @6xl/grid:text-xs/none dark:text-slate-500 dark:opacity-60">
						{label ?? `${title} project`}
					</div>
					<div
						className={clsx(
							'dark:border-gray-950 flex aspect-4/3 items-center justify-center rounded-xl border border-gray-300 dark:border-black',
							horizontal && '@2xl:aspect-[11/6]',
						)}
						style={{ position: 'relative', overflow: 'hidden' }}
					>
						{/* Mouse tracking for 3D cube */}
						{(() => {
							const [mouse, setMouse] = useState({ x: 0, y: 0 })
							const [size, setSize] = useState({ width: 1, height: 1 })
							const ref = useRef<HTMLDivElement>(null)
							const handleMouseMove = useCallback((e: React.MouseEvent) => {
								const rect = ref.current?.getBoundingClientRect()
								if (rect) {
									setMouse({
										x: e.clientX - rect.left,
										y: e.clientY - rect.top,
									})
								}
							}, [])
							const handleResize = useCallback(() => {
								const rect = ref.current?.getBoundingClientRect()
								if (rect) setSize({ width: rect.width, height: rect.height })
							}, [])
							// Update size on mount and resize
							React.useEffect(() => {
								handleResize()
								window.addEventListener('resize', handleResize)
								return () => window.removeEventListener('resize', handleResize)
							}, [handleResize])
							return (
								<div
									ref={ref}
									style={{ position: 'absolute', inset: 0, zIndex: 2 }}
									onMouseMove={handleMouseMove}
									onMouseLeave={() => setMouse({ x: size.width / 2, y: size.height / 2 })}
								>
									<ClientOnly>
										<Canvas 
											style={{ width: '100%', height: '100%' }} 
											camera={{ position: [2, 2, 2], fov: 50 }} 
											shadows
										>
											<ambientLight intensity={0.7} />
											<directionalLight position={[5, 5, 5]} intensity={0.5} castShadow />
											<Project3DModel model={model} isDetail={false} />
											<OrbitControls 
												enableZoom={false}
												enablePan={false}
												minPolarAngle={Math.PI / 4}
												maxPolarAngle={Math.PI * 3/4}
												rotateSpeed={0.5}
											/>
											<mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
												<planeGeometry args={[10, 10]} />
												<shadowMaterial opacity={0.4} />
											</mesh>
										</Canvas>
									</ClientOnly>
									{/* Add hint box */}
									<div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-800/90 px-3 py-1.5 rounded-full text-sm text-gray-600 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700 z-10">
										Click and drag to rotate
									</div>
								</div>
							)
						})()}
						{/* SVG overlays below the cube */}
						<svg
							viewBox="0 0 440 240"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className={clsx(
								'pointer-events-none absolute z-0 hidden h-full w-full text-gray-300 dark:text-black',
								horizontal && '@2xl:block',
							)}
						>
							<path
								d="M0 40H440M0 80H440M0 120H440M0 160H440M0 200H440M40 0V240M80 0V240M120 0V240M160 0V240M200 0V240M240 0V240M280 0V240M320 0V240M360 0V240M400 0V240"
								stroke="currentColor"
								strokeWidth="1"
								vectorEffect="non-scaling-stroke"
							/>
						</svg>
						<svg
							viewBox="0 0 320 240"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							className={clsx(
								'pointer-events-none absolute z-0 h-full w-full text-gray-300 dark:text-black',
								horizontal && '@2xl:hidden',
							)}
						>
							<path
								d="M0 39.5H320M0 79.5H320M0 119.5H320M0 159.5H320M0 199.5H320M39.5 240L39.5 0M79.5 240L79.5 0M119.5 240L79.5 0M159.5 240V0M199.5 240L199.5 0M239.5 240L239.5 0M279.5 240V0"
								stroke="currentColor"
								strokeWidth="1"
								vectorEffect="non-scaling-stroke"
							/>
						</svg>
					</div>
				</div>

				<div
					className={clsx(
						'flex flex-1 items-start gap-2 @xs:gap-4 @sm:gap-8',
						horizontal && '@sm:gap-1 @2xl:flex-col',
					)}
				>
					<div className="flex-1">
						<div className="flex items-center gap-3 mb-4">
							{emoji && (
								<div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
									<span className="text-2xl">{emoji}</span>
								</div>
							)}
							<div>
								<h2 className={titleClassName}>{title}</h2>
								{date && (
									<p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
										{date}
									</p>
								)}
							</div>
						</div>
						<p className={descriptionClassName}>{description}</p>
						{longDescription && isDetail && (
							<p className={descriptionClassName}>{longDescription}</p>
						)}
						{tags && tags.length > 0 && (
							<div className="flex flex-wrap gap-2 mt-4">
								{tags.slice(0, 3).map((tag) => (
									<span
										key={tag}
										className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm px-3 py-1 rounded-full shadow-sm border border-gray-200 dark:border-gray-700 font-medium"
									>
										{tag}
									</span>
								))}
								{tags.length > 3 && (
									<span className="inline-block text-gray-500 dark:text-gray-400 text-sm">
										+{tags.length - 3} more
									</span>
								)}
							</div>
						)}
					</div>

					<CourseCardLink
						href={courseUrl}
						className={clsx(
							'h-11 w-11 translate-x-0.5 translate-y-0.5 self-end @lg:h-12 @lg:w-auto @lg:pl-6 @lg:pr-4',
							horizontal && '@2xl:self-auto',
						)}
						textClassName="@lg:not-sr-only sr-only"
					/>
				</div>
			</div>
		</>
	)
}

export function SmallCourseCard({
	title,
	description,
	imageBuilder,
	lightImageBuilder,
	darkImageBuilder,
	courseUrl,
}: CourseCardProps) {
	function getImg(builder: ImageBuilder) {
		return (
			<img
				loading="lazy"
				{...getImgProps(builder, {
					className: 'h-32 w-auto flex-none object-contain',
					widths: [128, 256, 384],
					sizes: ['8rem'],
				})}
			/>
		)
	}

	return (
		<div className="course-card-gradient dark:bg-gray-850 relative col-span-full flex flex-col items-start overflow-hidden rounded-2xl bg-gray-100 p-6 ring-1 ring-inset ring-[rgba(0,0,0,0.05)] @sm:p-9 @2xl/grid:col-span-6 @2xl/grid:p-9 @6xl/grid:p-12 dark:ring-[rgba(255,255,255,0.05)] [&:nth-child(3n-2)]:col-span-12">
			{imageBuilder ? (
				getImg(imageBuilder)
			) : (
				<Themed
					light={getImg(lightImageBuilder)}
					dark={getImg(darkImageBuilder)}
				/>
			)}

			<h2 className={clsx(titleClassName, 'mt-12 pr-10')}>{title}</h2>
			<p className={clsx(descriptionClassName, 'mb-6 mt-2 max-w-[700px]')}>
				{description}
			</p>

			<CourseCardLink
					href={courseUrl}
					className={clsx(
						'-translate-x-0.5 h-12 pl-6 pr-4 mt-auto',
					)}
				/>
		</div>
	)
}
