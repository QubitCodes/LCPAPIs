#!/usr/bin/env node
/**
 * Runs the application using the compiled output inside ./build
 * Steps:
 *   1. Ensure build output exists (runs build if missing or --build flag provided)
 *   2. Copy .env into build directory (if present)
 *   3. Start the HTTP server from build/bin/server.js
 */

import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { access, cp } from 'node:fs/promises'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const buildDir = join(projectRoot, 'build')
const buildEnvPath = join(buildDir, '.env')
const rootEnvPath = join(projectRoot, '.env')
const shouldForceBuild = process.argv.includes('--build')

const run = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: false,
      ...options,
    })

    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0) {
        resolve(undefined)
      } else {
        reject(new Error(`Command "${command} ${args.join(' ')}" exited with code ${code}`))
      }
    })
  })

const ensureBuildOutput = async () => {
  if (!shouldForceBuild) {
    try {
      await access(buildDir)
      return
    } catch {
      console.log('ℹ️  Build output not found. Running build first...')
    }
  } else {
    console.log('ℹ️  --build flag detected. Rebuilding project...')
  }

  await run('node', ['scripts/build.mjs'], { cwd: projectRoot })
}

const syncEnvFile = async () => {
  try {
    await access(rootEnvPath)
    await cp(rootEnvPath, buildEnvPath, { force: true })
    console.log('🔁 Copied .env to build/.env')
  } catch {
    console.warn('⚠️  No .env file found in project root. Skipping copy.')
  }
}

const startServer = async () => {
  console.log('🚀 Starting production server from build/bin/server.js')

  // Ensure production environment variables are set for cloud platforms
  // Force HOST to 0.0.0.0 in production to bind to all interfaces (required for Render, Heroku, etc.)
  const env = {
    ...process.env,
    NODE_ENV: process.env.NODE_ENV || 'production',
    // Always use 0.0.0.0 in production, overriding any existing HOST value
    HOST: '0.0.0.0',
  }

  console.log(`🌐 Server will bind to: ${env.HOST}:${env.PORT || 'PORT from env'}`)

  await run('node', ['bin/server.js'], {
    cwd: buildDir,
    env,
  })
}

try {
  await ensureBuildOutput()
  await syncEnvFile()
  await startServer()
} catch (error) {
  console.error('❌ Failed to start production server')
  console.error(error)
  process.exitCode = 1
}
