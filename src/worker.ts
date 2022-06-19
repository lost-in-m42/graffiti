// internal (this is the "main script" of each window)
// we need workers because each window needs separate scope

import { Window, makeGlobal, VIEWPORT_ID } from './window/Window'
import { parseIntoDocument } from './dom/DOMParser'
import { readURL } from './util'
// import { loadStyles } from './dom/HTMLLinkElement'
import { runScripts } from './dom/HTMLScriptElement'
import { send } from './native'

self.addEventListener('message', init, { once: true })

// setup IPC
function init({ data: port }) {
  const api = new WorkerApi()
  port.onmessage = async ({ data: [cmd, args, res] }) => {
    try {
      res.postMessage({ result: await api[cmd](...args) })
    } catch (error) {
      console.log('err', error)
      res.postMessage({ error })
    }
  }
}

class WorkerApi {
  async run(windowId, url) {
    console.log('run', windowId, url)

    // setup env
    const { window, document } = new Window()
    document.URL = url
    makeGlobal(window)

    send({ WindowMsg: [windowId, { SetContent: window[VIEWPORT_ID] }] })

    // load html
    parseIntoDocument(document, await readURL(url))
    Object.assign(document, { defaultView: window, URL: url })

    // load (once) remote styles
    // await loadStyles()

    // run (once) all the scripts
    await runScripts()

    // TODO: we should somehow detect changes and notify parent
    //       so the tick() can skip rendering untouched windows
  }

  async eval(code) {
    return eval.call(null, code)
  }
}

export type { WorkerApi }
