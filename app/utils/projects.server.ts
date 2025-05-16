import * as YAML from 'yaml'
import { cachified } from '@epic-web/cachified'
import { cache } from './cache.server.ts'
import { typedBoolean } from './misc.tsx'
import fs from 'fs'
import path from 'path'

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
  const key = 'content:data:projects'
  const isDev = process.env.NODE_ENV === 'development'

  return cachified({
    key,
    cache,
    forceFresh: isDev || forceFresh,
    ttl: isDev ? 0 : 1000 * 60 * 60, // 1 hour in production
    staleWhileRevalidate: isDev ? 0 : 1000 * 60 * 5, // 5 minutes in production
    getFreshValue: async () => {
      const projectsPath = path.join(process.cwd(), 'content', 'data', 'projects.yml')
      const projectsString = fs.readFileSync(projectsPath, 'utf-8')
      const rawProjects = YAML.parse(projectsString)
      
      if (!Array.isArray(rawProjects)) {
        console.error('Projects is not an array', rawProjects)
        throw new Error('Projects is not an array.')
      }
      
      return rawProjects.filter(typedBoolean)
    },
    checkValue: (value: unknown) => Array.isArray(value),
  }) as Promise<Project[]>
}

export async function getProjectBySlug(slug: string, opts: { request?: Request; forceFresh?: boolean } = {}) {
  const projects = await getProjects(opts)
  return projects.find((p) => p.slug === slug) || null
} 