// import { parse } from 'vue-docgen-api'
// import path from 'path'
// import consola from 'consola'

// async function run() {
//   const packagePath = path.resolve(process.cwd(), 'packages/plus-components/components')
//   console.log('packagePath',packagePath,path.resolve(packagePath, 'table/table.tsx'));
//   parse(path.resolve(packagePath, 'table/table.tsx')).then((component) => {
//     consola.log(component)
//     component.props?.forEach((prop) => {
//       console.log(prop.defaultValue?.value,prop.type?.name);
//     })
//   })
// }

// run()
import path from 'node:path'
import fse from 'fs-extra'
import {
  BundledLanguage,
  BundledTheme,
  getSingletonHighlighter,
  HighlighterGeneric,
} from 'shiki'
import cheapWatch from 'cheap-watch'
// import { getProjectRootDir } from './utils.js';
// import { SCRIPT_TEMPLATE, DEMO_ENTRY_FILE } from './constants.js';

function getProjectRootDir() {
  return process.cwd()
}
// docs demo
export const DEMO_ENTRY_FILE = `
<template>
    <Demo />
</template>

<script setup>
// import {setupFesDesign } from './fes-design.js';
// import Demo from './demo.vue';
// setupFesDesign();
</script>
`
const SCRIPT_TEMPLATE = `
<script setup>
IMPORT_EXPRESSION
</script>
`

const rootDir = getProjectRootDir()
const CODE_PATH = path.join(
  rootDir,
  './docs/.vitepress/theme/components/demoCode.json'
)
const componentDocSrc = path.join(rootDir, './docs/.vitepress/components')

function getDemoCode() {
  if (fse.existsSync(CODE_PATH)) {
    return JSON.parse(fse.readFileSync(CODE_PATH, 'utf-8'))
  }

  return {
    app: DEMO_ENTRY_FILE,
  }
}

const code = getDemoCode()

function genOutputPath(name: string) {
  return path.join(rootDir, `./docs/components/${name}.md`)
}

function handleCompDoc(compCode: string, compName: string, demoName: string) {
  const codeName = `${compName}.${demoName}`
  // const codeSrc = encodeURIComponent(code[`${codeName}`]);
  // const codeFormat = encodeURIComponent(code[`${codeName}-code`]);
  // console.log('compCode',compCode);
  return compCode
    .replace(
      /<template>([\s\S]*)<\/template>/,
      (match, p1) =>
        `<template><ComponentDoc codeName="${codeName}" :codeFormat="codeFormat" :rawCode="rawCode"><ClientOnly>${p1}</ClientOnly></ComponentDoc></template>`
    )
    .replace(/<script\s*(setup)?\s*(lang="ts(x)?")?\s*>([\s\S]*?)<\/script>/g, (match, p1, p2, p3, p4) => {
        const startTagRegex = /<script\s*(setup)?\s*(lang="ts(x)?")?\s*>/;
        // console.log('p1',p4);

        const startTagMatch = match.match(startTagRegex);
      return `${startTagMatch![0]}
      import {codeFormat,rawCode} from './${demoName}-code';
     ${p4}
     </script>`
    })
}

const htmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

function escapeHtml(html: string) {
  return html.replace(/[&<>"']/g, (chr) => htmlEscapes[chr])
}

let highlighter: HighlighterGeneric<BundledLanguage, BundledTheme>
const codeTheme = 'github-light'
const highlight = async (code: string, lang = 'vue') => {
  if (!lang || lang === 'text') {
    return `<pre v-pre><code>${escapeHtml(code)}</code></pre>`
  }

  if (!highlighter) {
    highlighter = await getSingletonHighlighter({
      langs: ['vue'],
      themes: [codeTheme],
    })
  }
  return highlighter
    .codeToHtml(code, { lang, theme: codeTheme })
    .replace(/^<pre.*?>/, '<pre v-pre>')
}

async function genComponentExample(dir: string, name: string) {
  const output = genOutputPath(name)
  const indexPath = path.join(dir, 'index.md')
  if (!fse.existsSync(indexPath)) return

  let fileContent = fse.readFileSync(indexPath, 'utf-8')

  const demos = fse.readdirSync(dir)
  const demoMDStrs = []
  const scriptCode = {
    imports: [] as string[],
    components: [] as string[],
  }
  const tempCode: Record<string, any> = {}
  for (const filename of demos) {
    const fullPath = path.join(dir, filename)
    if (fse.statSync(fullPath).isFile() && path.extname(fullPath) === '.vue') {
      const demoContent = []
      const demoName = path.basename(fullPath, '.vue')

      const compName = demoName.replace(/^\S/, (s) => s.toUpperCase())
      const tempCompPath = path.join(
        dir,
        `../../.temp/components/${name}/${demoName}.vue`
      )

      scriptCode.imports.push(
        `import ${compName} from '../.vitepress/.temp/components/${name}/${demoName}.vue'`
      )
      // scriptCode.imports.push(
      //     `import { codeFormat } from '../.vitepress/.temp/components/${name}/${demoName}-code'`,
      // );
      // console.log('code',code);
      fse.outputFileSync(
        path.join(dir, `../../.temp/components/${name}/${demoName}-code.js`),
        `export const codeFormat = "${encodeURIComponent(
          code[`${name}.${demoName}-code`]
        )}";
        export const rawCode = "${encodeURIComponent(
          code[`${name}.${demoName}`]
        )}";
        `
      )
      fse.outputFileSync(
        tempCompPath,
        handleCompDoc(fse.readFileSync(fullPath, 'utf-8'), name, demoName)
      )
      scriptCode.components.push(compName)

      // 防止文档样式覆盖组件样式，详见：https://vitepress.dev/guide/markdown#raw
      demoContent.push(`::: raw\n<${compName} />\n:::`)

      const rawCode = fse.readFileSync(fullPath, 'utf-8')
      tempCode[`${name}.${demoName}`] = rawCode
      tempCode[`${name}.${demoName}-code`] = await highlight(rawCode)

      const dashMatchRegExp = new RegExp(`--${demoName}`, 'ig')
      const colonMatchRegExp = new RegExp(
        `:::demo[\\s]*${demoName}\.vue[\\s]*:::`,
        'g'
      )

      if (
        dashMatchRegExp.test(fileContent) ||
        colonMatchRegExp.test(fileContent)
      ) {
        fileContent = fileContent
          .replace(dashMatchRegExp, demoContent.join('\n\n\n'))
          .replace(colonMatchRegExp, demoContent.join('\n\n\n'))
      } else {
        demoMDStrs.push(...demoContent)
      }
    }
  }

  const scriptStr = SCRIPT_TEMPLATE.replace(
    'IMPORT_EXPRESSION',
    scriptCode.imports.join('\n')
  )

  demoMDStrs.push(scriptStr)
  // console.log('demoMDStrs',demoMDStrs);

  const dashCodeMatchRegExp = new RegExp(`--CODE`)
  const colonCodeMatchRegExp = new RegExp(`:::code[\\s\\S]*:::`)
  if (
    !(
      dashCodeMatchRegExp.test(fileContent) ||
      colonCodeMatchRegExp.test(fileContent)
    )
  ) {
    const appendContent = '\n\n:::code:::\n\n'
    fileContent = fileContent + appendContent
  }
  fse.outputFileSync(
    output,
    fileContent
      .replace(dashCodeMatchRegExp, demoMDStrs.join('\n\n'))
      .replace(colonCodeMatchRegExp, demoMDStrs.join('\n\n'))
  )

  if (Object.keys(tempCode).length) {
    fse.outputFileSync(
      CODE_PATH,
      JSON.stringify(Object.assign(code, tempCode), null, 2)
    )
  }
}

async function genComponents(src: string) {
  const components = fse.readdirSync(src)
  for (const name of components) {
    await genComponentExample(path.join(src, name), name)
  }
}

export async function watch(src: string) {
  const watcher = new cheapWatch({
    dir: src,
    debounce: 50,
  })

  await watcher.init()

  const handleGen = (file: any) => {
    // 只监听目录变更
    if (file.stats.isDirectory()) {
      const pathSeps = file.path.split(path.sep)
      const pkgName = pathSeps[0]
      genComponentExample(path.join(src, pkgName), pkgName)
    }
  }
  const handleDelete = (file: any) => {
    const pathSeps = file.path.split(path.sep)

    // 删除组件文档
    if (pathSeps.length === 1) {
      const name = pathSeps[0]
      let hasDeleteCode = false
      Object.keys(code).forEach((key) => {
        if (key.startsWith(name)) {
          hasDeleteCode = true
          delete code[key]
        }
      })

      if (hasDeleteCode) {
        fse.writeFileSync(CODE_PATH, JSON.stringify(code, null, 2))
      }
      const outputPath = genOutputPath(name)
      if (fse.existsSync(outputPath)) {
        fse.unlinkSync(outputPath)
      }
    } else if (file.stats.isFile() && path.extname(file.path) === '.vue') {
      const pkgName = pathSeps[0]
      // 删除组件属性
      const codekey = `${pkgName}.${path.basename(file.path, '.vue')}`
      if (code[codekey]) {
        delete code[codekey]
        fse.writeFileSync(CODE_PATH, JSON.stringify(code, null, 2))
      }
      genComponentExample(path.join(src, pkgName), pkgName)
    }
  }

  watcher.on('+', handleGen)
  watcher.on('-', handleDelete)
}

export const genComponentDoc = async () => {
  await genComponents(componentDocSrc)
}
export const genComponentDocWatch = async () => {
  await watch(componentDocSrc)
}

genComponentDoc()
