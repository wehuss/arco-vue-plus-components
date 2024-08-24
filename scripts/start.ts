import path from 'path'
import fs from 'fs-extra'
import { build } from 'vite'
import buildConfig from './configs/vite.prod'
import buildUmdConfig from './configs/vite.prod.umd'

async function run() {
  // const packagePath = path.resolve(__dirname, '../packages/plus-components')
  const packagePath = path.resolve(process.cwd(), 'packages/plus-components')
  const esPath = path.resolve(packagePath, 'es')
  const libPath = path.resolve(packagePath, 'lib')
  const distPath = path.resolve(packagePath, 'dist')
  fs.emptyDir(esPath)
  fs.emptyDir(libPath)
  fs.emptyDir(distPath)

  build(buildConfig({}))
  // build(buildUmdConfig({}))
}

run()

export default run
