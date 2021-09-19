import { Node, CharacterData } from './index'
import { normalize } from './CharacterData'
import { native, getNativeId, register } from '../native'
import { encode } from '../util'

export class Text extends CharacterData implements globalThis.Text {
  constructor(data = '', doc = document) {
    super(doc)

    register(this, native.gft_Document_create_text_node(getNativeId(doc), encode(normalize(data))))
  }

  get nodeType() {
    return Node.TEXT_NODE
  }

  get nodeName() {
    return '#text'
  }

  // TODO
  wholeText
  splitText
}
