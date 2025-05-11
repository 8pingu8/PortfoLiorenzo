import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getProjectBySlug, Project } from '../../utils/projects.server'
import { Grid } from '../../components/grid'
import { BackLink } from '../../components/arrow-button'
import { Project3DModel } from '../../components/course-card'
import { ClientOnly } from '../../components/ClientOnly'
import { Canvas } from '@react-three/fiber'
import { useRef, useState, useCallback } from 'react'
import React from 'react'

export async function loader({ params, request }: LoaderFunctionArgs) {
  const slug = params.slug
  if (!slug) throw new Response('Not found', { status: 404 })
  const project = await getProjectBySlug(slug, { request })
  if (!project) throw new Response('Not found', { status: 404 })
  return json({ project })
}

export default function ProjectDetailPage() {
  const { project } = useLoaderData<typeof loader>()
  // Mouse tracking for 3D model (copied from CourseCard)
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
    <>
    <Grid as="main" className="mb-48 !grid-cols-12 gap-10 @container/grid md:gap-10 xl:gap-14">
      {/* CourseCard-style horizontal layout header, matching index page */}
      <div className="col-span-full @container">
        <div
          className={
            'course-card-gradient dark:bg-gray-850 relative flex h-full gap-5 overflow-hidden rounded-2xl bg-gray-100 p-6 ring-1 ring-inset ring-[rgba(0,0,0,0.05)] @sm:gap-6 @sm:p-9 @2xl/grid:gap-6 @2xl/grid:p-9 @6xl/grid:p-12 dark:ring-[rgba(255,255,255,0.05)] flex-col @2xl:flex-row mb-12 mt-24'
          }
        >
          {/* 3D model and grid overlays (left side) */}
          <div className="relative w-full @2xl:order-last @2xl:w-[62%] flex-shrink-0">
            <div className="absolute right-0 top-0 hidden origin-bottom-right -translate-y-full translate-x-5 -rotate-90 text-right font-mono text-[11px]/none uppercase tracking-widest text-gray-400 opacity-80 @sm:block @2xl/grid:block @6xl/grid:translate-x-6 @6xl/grid:text-xs/none dark:text-slate-500 dark:opacity-60">
              {project.title + ' project'}
            </div>
            <div
              className="dark:border-gray-950 flex aspect-4/3 @2xl:aspect-[11/6] items-center justify-center rounded-xl border border-gray-300 dark:border-black"
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              <div
                ref={ref}
                style={{ position: 'absolute', inset: 0, zIndex: 2 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setMouse({ x: size.width / 2, y: size.height / 2 })}
              >
                <ClientOnly>
                  <Canvas style={{ width: '100%', height: '100%' }} camera={{ position: [2, 2, 2] }} shadows>
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[5, 5, 5]} intensity={0.5} />
                    <Project3DModel mouse={mouse} width={size.width} height={size.height} model={project.model} isDetail={true} />
                  </Canvas>
                </ClientOnly>
              </div>
              {/* SVG overlays below the cube */}
              <svg
                viewBox="0 0 440 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="pointer-events-none absolute z-0 hidden h-full w-full text-gray-300 dark:text-black @2xl:block"
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
                className="pointer-events-none absolute z-0 h-full w-full text-gray-300 dark:text-black @2xl:hidden"
              >
                <path
                  d="M0 39.5H320M0 79.5H320M0 119.5H320M0 159.5H320M0 199.5H320M39.5 240L39.5 0M79.5 240L79.5 0M119.5 240L119.5 0M159.5 240V0M199.5 240L199.5 0M239.5 240L239.5 0M279.5 240V0"
                  stroke="currentColor"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            </div>
          </div>
          {/* Right side: title, tags, description (top-aligned, not centered) */}
          <div className="flex flex-1 items-start gap-2 @xs:gap-4 @sm:gap-8 @sm:gap-1 @2xl:flex-col">
            <div className="flex-1">
              <h1 className="text-xl/7 font-semibold text-balance tracking-tight text-gray-800 @sm:text-2xl/7 @2xl/grid:text-xl/7 @3xl/grid:text-2xl/7 @6xl/grid:text-3xl/9 dark:font-medium dark:tracking-normal dark:text-gray-200 mb-2">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-3 mt-2 mb-4">
                {project.tags && project.tags.map((tag: string) => (
                  <span key={tag} className="inline-block bg-blue-200 text-blue-900 text-base px-4 py-2 rounded-full shadow-sm border border-blue-300 font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-balance text-base/6 text-gray-500 dark:prose-dark @6xl/grid:text-lg/6">
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </div>
      </Grid>

      {/* Main video in its own card */}
      {project.video && (
        <Grid className="mb-8 mt-8">
          <div className="col-span-full flex justify-center">
            <div className="course-card-gradient dark:bg-gray-850 rounded-2xl p-6 w-full max-w-3xl flex items-center justify-center shadow">
              <video controls className="w-full rounded shadow-lg">
                <source src={project.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </Grid>
      )}

      {/* Images card */}
      <Grid as="main" className="mb-24 lg:mb-64">
        
        <div className="col-span-full lg:col-span-8 lg:col-start-3 flex flex-col gap-8">
          {project.images && project.images.length > 0 && (
            <div className="course-card-gradient dark:bg-gray-850 rounded-2xl p-6 grid gap-4 grid-cols-1 md:grid-cols-2">
                {project.longDescription && (
        <div className="">
          {project.longDescription}
        </div>
      )}
              {project.images.map((img: string, i: number) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow flex items-center justify-center">
                  <img
                    src={img}
                    alt={`${project.title} screenshot ${i + 1}`}
                    className="w-full object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Grid>

      {/* Links row */}
      <Grid>
        
        <div className="col-span-full flex flex-wrap gap-2 justify-center mt-4">
          {project.links &&
            Object.entries(project.links).map(([key, url]) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition shadow"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </a>
            ))}
        </div>
      </Grid>

      {/* Back link */}
      <Grid className="mb-10">
        <div className="col-span-full flex justify-center">
          <BackLink to="/projects">Back to Projects</BackLink>
        </div>
      </Grid>
    </>
  )
} 