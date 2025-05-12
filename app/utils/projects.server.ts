import * as YAML from 'yaml'
import { cachified } from '@epic-web/cachified'
import { cache, shouldForceFresh } from './cache.server.ts'
import { downloadFile } from './github.server.ts'
import { typedBoolean } from './misc.tsx'

export type Project = {
  title: string
  slug: string
  description: string
  longDescription?: string
  cover_image: string
  images: string[]
  video?: string
  videoDescription?: string
  tags?: string[]
  links?: Record<string, string>
  model?: string
  date?: string
  emoji?: string
}

export async function getProjects({
  request,
  forceFresh,
}: {
  request?: Request
  forceFresh?: boolean
} = {}) {
  const key = 'content:data:projects.yml'
  const isDev = process.env.NODE_ENV === 'development'
  const allProjects = await cachified({
    key,
    cache,
    forceFresh: isDev ? true : await shouldForceFresh({ forceFresh, request, key }),
    ttl: isDev ? 0 : 1000 * 60 * 60 * 24 * 30,
    staleWhileRevalidate: isDev ? 0 : 1000 * 60 * 60 * 24,
    getFreshValue: async () => {
      const projectsString = await downloadFile('content/data/projects.yml')
      const rawProjects = YAML.parse(projectsString)
      if (!Array.isArray(rawProjects)) {
        console.error('Projects is not an array', rawProjects)
        throw new Error('Projects is not an array.')
      }
      return rawProjects.filter(typedBoolean)
    },
    checkValue: (value: unknown) => Array.isArray(value),
  })
  return allProjects as Project[]
}

export async function getProjectBySlug(slug: string, opts: { request?: Request; forceFresh?: boolean } = {}) {
  const projects = await getProjects(opts)
  return projects.find((p) => p.slug === slug) || null
} 