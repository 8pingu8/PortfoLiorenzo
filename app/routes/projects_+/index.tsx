import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getProjects, Project } from '../../utils/projects.server'
import { CourseCard } from '../../components/course-card'
import { Grid } from '../../components/grid'
import { HeroSection } from '../../components/sections/hero-section'
import { motion } from 'framer-motion'
import { images } from '../../images'

export async function loader({ request }: LoaderFunctionArgs) {
  const projects = await getProjects({ request })
  return json({ projects })
}

function getImageBuilderFromProject(project: Project) {
  // Minimal ImageBuilder for static images
  const builder = ((/* transformations? */) => project.cover_image) as any
  builder.id = project.cover_image
  builder.alt = project.title
  return builder
}

export default function ProjectsPage() {
  const { projects } = useLoaderData<typeof loader>()
  return (
    <>
      <HeroSection
        title="Game Development Portfolio"
        subtitle="Exploring the intersection of creativity and technology through interactive experiences"
        imageProps={{
          src: images.kodyFlyingBackFlippingBlue(),
          alt: "Kody the Koala back flipping",
          className: "opacity-90 hover:opacity-100 transition-opacity duration-300"
        }}
        imageSize="large"
      />
      <Grid as="main" className="mb-48 !grid-cols-12 gap-10 @container/grid md:gap-10 xl:gap-14">
        {projects.map((project: Project, i: number) => (
          <motion.div
            key={project.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={i === 0 ? "col-span-full @container" : "col-span-full @container @2xl:col-span-6"}
          >
            <CourseCard
              title={project.title}
              description={project.description}
              longDescription={project.longDescription}
              imageBuilder={getImageBuilderFromProject(project)}
              courseUrl={`/projects/${project.slug}`}
              horizontal={i === 0}
              model={project.model}
              emoji={project.emoji}
              date={project.date}
              tags={project.tags}
            />
          </motion.div>
        ))}
      </Grid>
    </>
  )
} 