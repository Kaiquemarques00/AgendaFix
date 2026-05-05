import path from 'node:path'

const projectRoot = path.resolve(process.cwd())
process.env.AGENDAFIX_PROJECT_ROOT = projectRoot

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: projectRoot,
  },
}

export default nextConfig
