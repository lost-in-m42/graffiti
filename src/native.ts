import { version as VERSION } from '../package.json'
import { ERR, PLATFORM } from './util'

export let native: any = new Proxy({}, { get: ERR.bind(null, 'not loaded, init first') })

// TODO: PREBUILT
const SUFFIX = PLATFORM === 'darwin' ? 'dylib' : PLATFORM === 'windows' ? 'dll' : 'so'
const LIB = new URL(`../libgraffiti/target/debug/libgraffiti.${SUFFIX}`, import.meta.url).pathname
//const PREBUILT_URL = `https://github.com/cztomsik/graffiti/releases/download/${VERSION}`

// export async fn, nothing should be done at import time (testing)
export const loadNativeApi = async () => {
  if ('Deno' in globalThis) {
    return await loadDenoPlugin()
  }

  if ('process' in globalThis) {
    return await loadNodejsAddon()
  }

  return ERR('unsupported JS engine')
}

export const loadNodejsAddon = async () => {
  // tell dylib to register napi extension
  process.env.GFT_NODEJS = '1'

  // require() would make ncc bundle some unnecessary build artifacts
  process['dlopen']({ exports: native = {} }, LIB)
}

const loadDenoPlugin = async (Deno = globalThis.Deno) => {
  // TODO: fetch using https://deno.land/x/cache (Plug doesn't really add anything here)

  const rid = Deno.openPlugin(LIB)

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  native = Object.fromEntries(
    Object.entries(Deno.core.ops())
      .filter(([opName, opId]) => opName.startsWith('GFT_'))
      .map(([opName, opId]) => {
        return [
          opName.slice(4),
          // TODO: Deno.core.jsonOpSync(op, argsArr)
          (...args) => {
            //console.log(opName, ...args)
            const res = Deno.core.dispatch(opId, encoder.encode(JSON.stringify(args)))
            //console.log(res && decoder.decode(res))

            if (res) {
              return JSON.parse(decoder.decode(res))
            }
          },
        ]
      })
  )
}