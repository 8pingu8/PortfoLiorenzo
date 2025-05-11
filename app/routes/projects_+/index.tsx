import { json, LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { getProjects, Project } from '../../utils/projects.server'
import { CourseCard } from '../../components/course-card'
import { Grid } from '../../components/grid'
import { HeaderSection } from '../../components/sections/header-section'

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
      <HeaderSection
        title="Game Development Projects"
        subTitle="Check out my latest games, experiments, and prototypes. Click any project to see more details, images, and videos!"
        className="mb-16"
      />
      <Grid as="main" className="mb-48 !grid-cols-12 gap-10 @container/grid md:gap-10 xl:gap-14">
        {projects.map((project: Project, i: number) =>
          i === 0 ? (
            <div key={project.slug} className="col-span-full @container">
              <CourseCard
                title={project.title}
                description={project.description}
                longDescription={project.longDescription}
                imageBuilder={getImageBuilderFromProject(project)}
                courseUrl={`/projects/${project.slug}`}
                horizontal
                model={project.model}
              />
            </div>
          ) : (
            <div key={project.slug} className="col-span-full @container @2xl:col-span-6">
              <CourseCard
                title={project.title}
                description={project.description}
                longDescription={project.longDescription}
                imageBuilder={getImageBuilderFromProject(project)}
                courseUrl={`/projects/${project.slug}`}
                model={project.model}
              />
            </div>
          )
        )}
      </Grid>
    </>
  )
} 