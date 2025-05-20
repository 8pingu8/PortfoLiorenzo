import { json, LoaderFunctionArgs, type MetaFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getProjectBySlug, Project } from '../../utils/projects.server'
import { Grid } from '../../components/grid'
import { BackLink } from '../../components/arrow-button'
import { Project3DModel } from '../../components/course-card'
import { ClientOnly } from '../../components/ClientOnly'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useRef, useState, useCallback } from 'react'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) {
    return [
      { title: 'Project Not Found' },
      { name: 'description', content: 'The requested project could not be found.' },
    ]
  }

  const { project } = data
  const title = `${project.title} - Lorenzo Jacopo Avalle`
  const description = project.description
  const imageUrl = project.cover_image ? `${data.requestInfo.origin}${project.cover_image}` : `${data.requestInfo.origin}/pics/socialpic.png`
  const url = `${data.requestInfo.origin}/projects/${project.slug}`

  return [
    // Basic metadata
    { title },
    { name: 'description', content: description },
    // Open Graph
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:image', content: imageUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: url },
    // Twitter
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
    // Additional metadata
    { name: 'keywords', content: project.tags?.join(', ') || 'Game Development, Software Engineering' },
  ]
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const slug = params.slug
  if (!slug) throw new Response('Not found', { status: 404 })
  const project = await getProjectBySlug(slug, { request })
  if (!project) throw new Response('Not found', { status: 404 })
  
  const requestInfo = {
    origin: new URL(request.url).origin,
  }
  
  return json({ project, requestInfo })
}

export default function ProjectDetailPage() {
  const { project } = useLoaderData<typeof loader>()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
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
      <Grid as="main" className="mb-12 !grid-cols-12 gap-10 @container/grid md:gap-10 xl:gap-14">
        {/* CourseCard-style horizontal layout header */}
        <div className="col-span-full @container">
          <div
            className={
              'course-card-gradient dark:bg-gray-850 relative flex gap-5 overflow-hidden rounded-2xl bg-gray-100 p-6 ring-1 ring-inset ring-[rgba(0,0,0,0.05)] @sm:gap-6 @sm:p-9 @2xl/grid:gap-6 @2xl/grid:p-9 @6xl/grid:p-12 dark:ring-[rgba(255,255,255,0.05)] flex-col @2xl:flex-row mt-24'
            }
          >
            {/* 3D model and grid overlays (left side) */}
            <div className="relative w-full @2xl:order-last @2xl:w-[150%]">
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
                    <Canvas 
                      style={{ width: '100%', height: '100%' }} 
                      camera={{ position: [2, 2, 2], fov: 50 }} 
                      shadows
                    >
                      <ambientLight intensity={0.7} />
                      <directionalLight position={[5, 5, 5]} intensity={0.5} castShadow />
                      <Project3DModel model={project.model} isDetail={true} />
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
            {/* Right side: title, tags, description */}
            <div className="flex flex-col gap-2 @xs:gap-4 @sm:gap-8">
              <div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center"
                  >
                    <span className="text-2xl">{project.emoji || "🎮"}</span>
                  </motion.div>
                  <div>
                    <motion.h1 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="text-xl/7 font-semibold text-balance tracking-tight text-gray-800 @sm:text-2xl/7 @2xl/grid:text-xl/7 @3xl/grid:text-2xl/7 @6xl/grid:text-3xl/9 dark:font-medium dark:tracking-normal dark:text-gray-200"
                    >
                      {project.title}
                    </motion.h1>
                    {project.date && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-sm text-gray-500 dark:text-gray-400 mt-1"
                      >
                        {project.date}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="flex flex-wrap gap-3 mt-2 mb-4"
                >
                  {project.tags && project.tags.map((tag: string, index: number) => (
                    <motion.span 
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="inline-block bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm px-4 py-2 rounded-full shadow-sm border-2 border-gray-200 dark:border-gray-700 font-medium transition-all hover:shadow-md"
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="mt-2 text-balance text-base/6 text-gray-500 dark:text-gray-400 @6xl/grid:text-lg/6"
                >
                  {project.description}
                </motion.p>
              </div>
            </div>
          </div>
        </div>
      </Grid>

      {/* Main video in its own card */}
      {project.video && (
        <Grid className="mb-12">
          <div className="col-span-full flex justify-center">
            <div className="course-card-gradient dark:bg-gray-850 rounded-2xl p-6 w-full max-w-4xl flex flex-col items-center justify-center shadow">
              {project.videoDescription && (
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-center italic">
                  {project.videoDescription}
                </p>
              )}
              <video 
                controls 
                className="w-full rounded shadow-lg"
                onLoadedMetadata={(e) => {
                  const video = e.currentTarget;
                  video.playbackRate = 2.0;
                }}
              >
                <source src={project.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </Grid>
      )}

      {/* Long Description Section */}
      {project.longDescription && (
        <Grid className="mb-12">
          <div className="col-span-full lg:col-span-10 lg:col-start-2">
            <div className="course-card-gradient dark:bg-gray-850 rounded-2xl p-8 text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mt-8 mb-4 text-gray-800 dark:text-gray-100" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl font-medium mt-6 mb-3 text-gray-800 dark:text-gray-100" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4" {...props} />,
                    li: ({node, ...props}) => <li className="mb-2" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-gray-800 dark:text-gray-100" {...props} />
                  }}
                >
                  {project.longDescription}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </Grid>
      )}

      {/* Images card */}
      <Grid className="mb-24 lg:mb-64">
        <div className="col-span-full lg:col-span-10 lg:col-start-2">
          {project.images && project.images.length > 0 && (
            <div className="course-card-gradient dark:bg-gray-850 rounded-2xl p-6 grid gap-4 grid-cols-1 md:grid-cols-2">
              {project.images.map((img: string, i: number) => (
                <motion.div 
                  key={i} 
                  className="bg-white dark:bg-gray-800 rounded-xl p-2 shadow flex items-center justify-center cursor-pointer overflow-hidden"
                  whileHover={{ 
                    scale: 1.05,
                    rotate: Math.random() * 2 - 1,
                    transition: { duration: 0.2 }
                  }}
                  onClick={() => setSelectedImage(img)}
                >
                  <img
                    src={img}
                    alt={`${project.title} screenshot ${i + 1}`}
                    className="w-full object-cover rounded"
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </Grid>

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={selectedImage}
                alt="Enlarged view"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Links row */}
      <Grid className="mb-12">
        <div className="col-span-full flex flex-wrap gap-2 justify-center">
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