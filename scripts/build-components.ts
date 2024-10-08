import path from 'path'
import fs from 'fs-extra'
import { build } from 'vite'
import buildConfig from './configs/vite.prod'
import buildUmdConfig from './configs/vite.prod.umd'

async function run(watch?: any) {
  const packagePath = path.resolve(process.cwd(), 'packages/plus-components')
  // const packagePath = path.resolve(process.cwd(), 'packages/plus-components')
  const esPath = path.resolve(packagePath, 'es')
  const libPath = path.resolve(packagePath, 'lib')
  const distPath = path.resolve(packagePath, 'dist')
  fs.emptyDir(esPath)
  fs.emptyDir(libPath)
  fs.emptyDir(distPath)

  await build(buildConfig(watch))
  await build(buildUmdConfig())
}

run()

export default run
