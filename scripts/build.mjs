#!/usr/bin/env node
/**
 * Simple helper to run the AdonisJS build process from Node.
 */

import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))

const run = (command, args, options = {}) =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: projectRoot,
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

try {
  console.log('🏗️  Building project...')
  await run('node', ['ace', 'build'])
  console.log('✅ Build completed')
} catch (error) {
  console.error('❌ Build failed')
  console.error(error)
  process.exitCode = 1
}

