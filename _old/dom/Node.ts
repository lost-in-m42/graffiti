// x follow spec as possible, avoid custom extensions
//   x it's ok to include mixins (to avoid duplication)

import { EventTarget } from '../events/index'
import { NodeList, HTMLElement } from './index'
import { assert, last, UNSUPPORTED } from '../util'
import { appendChild, insertBefore, removeChild, querySelector, querySelectorAll } from './Document'
import { IChildNode, IDocument, INode, INonDocumentTypeChildNode, IParentNode, ISlottable } from '../types'

// prettier-ignore
export abstract class Node extends EventTarget
  implements INode, IParentNode, IChildNode, INonDocumentTypeChildNode, ISlottable {
  abstract readonly nodeType: number
  abstract readonly nodeName: string
  readonly parentNode: Element | null = null
  // defined in prototype
  readonly childNodes

  // nodes should only be created by document
  protected constructor(public readonly ownerDocument: IDocument) {
    super()
  }

  appendChild<T extends INode>(child: T): T {
    return this.insertBefore(child, null)
  }

  insertBefore<T extends INode>(child: T, refNode: INode | null): T {
    // should be !== null but some libs pass undefined too
    if (refNode) {
      assert(refNode.parentNode === this, 'invalid refNode')

      while (refNode?.nodeType === Node.COMMENT_NODE) {
        refNode = refNode!.previousSibling
      }
    }

    // fragment
    if (child.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
      child.childNodes.splice(0).forEach(c => this.insertBefore(c, refNode))
      return child
    }

    // remove first (in case it was in the same element already)
    ;(child as any).remove()

    const index = refNode ? this.childNodes.indexOf(refNode) : this.childNodes.length
    this.childNodes.splice(index, 0, child)
    ;(child as any).parentNode = this

    if (this.nodeType !== Node.DOCUMENT_FRAGMENT_NODE && (child.nodeType !== Node.COMMENT_NODE)) {
      if (refNode) {
        this.ownerDocument[insertBefore](this, child, refNode)
      } else {
        this.ownerDocument[appendChild](this, child)
      }
    }

    return child
  }

  removeChild<T extends INode>(child: T): T {
    assert(child.parentNode === this, 'not a child')

    ;(child as any).parentNode = null
    this.childNodes.splice(this.childNodes.indexOf(child), 1)

    if (this.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
      this.ownerDocument[removeChild](this, child)
    }

    return child
  }

  replaceChild<T extends INode>(child: INode, oldChild: T): T {
    this.insertBefore(child, oldChild)

    return this.removeChild(oldChild)
  }

  hasChildNodes(): boolean {
    return this.childNodes.length > 0
  }

  get firstChild(): IChildNode | null {
    return this.childNodes[0] ?? null
  }

  get lastChild(): IChildNode | null {
    return last(this.childNodes) ?? null
  }

  get parentElement(): HTMLElement | null {
    return this.parentNode instanceof HTMLElement ? this.parentNode : null
  }

  get nextSibling(): IChildNode | null {
    return sibling(this.parentNode?.childNodes, this, 1)
  }

  get previousSibling(): IChildNode | null {
    return sibling(this.parentNode?.childNodes, this, -1)
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeValue
  // overridden by CharacterData
  get nodeValue(): string | null {
    return null
  }

  // overridden by CharacterData
  // comment.textContent should return a value but it
  // shouldn't be part of element.textContent
  get textContent(): string | null {
    return this.childNodes
      .filter(c => c.nodeType == Node.ELEMENT_NODE || c.nodeType == Node.TEXT_NODE)
      .map(c => c.textContent)
      .join('')
  }

  // overridden by CharacterData
  set textContent(v) {
    this.childNodes.forEach(c => c.remove())

    // note we can't just update already present text node because it has to remain untouched
    this.appendChild(this.ownerDocument.createTextNode('' + v))
  }

  getRootNode(options?: GetRootNodeOptions): INode {
    return this.ownerDocument
  }

  isSameNode(node): boolean {
    return node === this
  }

  get baseURI(): string {
    return this.ownerDocument.location.href
  }

  get namespaceURI(): string | null {
    return 'http://www.w3.org/1999/xhtml'
  }

  lookupNamespaceURI(prefix: string | null): string | null {
    return null
  }

  lookupPrefix(namespace: string | null): string | null {
    return null
  }

  isDefaultNamespace(namespace: string | null): boolean {
    return false
  }

  get isConnected(): boolean {
    return this.parentNode?.isConnected ?? false
  }

  normalize() {
    UNSUPPORTED()
  }

  isEqualNode(otherNode: INode | null): boolean {
    return UNSUPPORTED()
  }

  cloneNode(deep?: boolean): INode {
    return UNSUPPORTED()
  }

  compareDocumentPosition(other: INode): number {
    return UNSUPPORTED()
  }

  // prefresh calls this
  contains(other: INode | null): boolean {
    // go through other parents and check if one of them is us
    while (other) {
      if (other === this) {
        return true
      }

      other = other.parentNode
    }

    return false
  }

  // node types
  static readonly ELEMENT_NODE = 1
  static readonly ATTRIBUTE_NODE = 2
  static readonly TEXT_NODE = 3
  static readonly CDATA_SECTION_NODE = 4
  static readonly ENTITY_REFERENCE_NODE = 5
  static readonly ENTITY_NODE = 6
  static readonly PROCESSING_INSTRUCTION_NODE = 7
  static readonly COMMENT_NODE = 8
  static readonly DOCUMENT_NODE = 9
  static readonly DOCUMENT_TYPE_NODE = 10
  static readonly DOCUMENT_FRAGMENT_NODE = 11
  static readonly NOTATION_NODE = 12

  // types again (instance)
  // (getters are defined on prototype so they don't consume instance space)
  get ELEMENT_NODE(): number { return Node.ELEMENT_NODE }
  get ATTRIBUTE_NODE(): number { return Node.ATTRIBUTE_NODE }
  get TEXT_NODE(): number { return Node.TEXT_NODE }
  get CDATA_SECTION_NODE(): number { return Node.CDATA_SECTION_NODE }
  get ENTITY_REFERENCE_NODE(): number { return Node.ENTITY_REFERENCE_NODE }
  get ENTITY_NODE(): number { return Node.ENTITY_NODE }
  get PROCESSING_INSTRUCTION_NODE(): number { return Node.PROCESSING_INSTRUCTION_NODE }
  get COMMENT_NODE(): number { return Node.COMMENT_NODE }
  get DOCUMENT_NODE(): number { return Node.DOCUMENT_NODE }
  get DOCUMENT_TYPE_NODE(): number { return Node.DOCUMENT_TYPE_NODE }
  get DOCUMENT_FRAGMENT_NODE(): number { return Node.DOCUMENT_FRAGMENT_NODE }
  get NOTATION_NODE(): number { return Node.NOTATION_NODE }

  // maybe later
  DOCUMENT_POSITION_CONTAINED_BY
  DOCUMENT_POSITION_CONTAINS
  DOCUMENT_POSITION_DISCONNECTED
  DOCUMENT_POSITION_FOLLOWING
  DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
  DOCUMENT_POSITION_PRECEDING

  // ---
  // ParentNode:

  get children(): HTMLCollection {
    // TODO: HTMLCollection
    return this.childNodes.filter(c => c.nodeType === Node.ELEMENT_NODE) as any
  }

  get childElementCount(): number {
    return this.children.length
  }

  get firstElementChild(): Element | null {
    return this.children[0] ?? null
  }

  get lastElementChild(): Element | null {
    return last(this.children) ?? null
  }

  append(...nodes: (INode | string)[]) {
    nodes.forEach(n => this.appendChild(strToNode(this, n)))
  }

  prepend(...nodes: (INode | string)[]) {
    nodes.forEach(n => this.insertBefore(strToNode(this, n), this.firstChild))
  }

  replaceChildren(...nodes: (INode | string)[]) {
    this.childNodes.forEach(n => this.removeChild(n))
    this.append(...nodes)
  }

  getElementById(id) {
    return this.querySelector(`#${id}`)
  }

  querySelector(selector) {
    return this.ownerDocument[querySelector](this, selector)
  }

  querySelectorAll(selector) {
    return NodeList.from(this.ownerDocument[querySelectorAll](this, selector)) as any
  }

  getElementsByTagName(tagName) {
    return this.getElementsByTagNameNS(tagName, '')
  }

  getElementsByTagNameNS(tagName, _ns) {
    return this.querySelectorAll(tagName)
  }

  getElementsByClassName(className) {
    return this.querySelectorAll(`.${className}`)
  }

  // ---
  // ChildNode:

  after(...nodes: (INode | string)[]) {
    const refNode = this.nextSibling

    if (this.parentNode) {
      nodes.forEach(n => this.parentNode!.insertBefore(strToNode(this, n), refNode))
    }
  }

  before(...nodes: (INode | string)[]) {
    if (this.parentNode) {
      nodes.forEach(n => this.parentNode!.insertBefore(strToNode(this, n), this))
    }
  }

  replaceWith(...nodes: (INode | string)[]) {
    this.before(...nodes)
    this.remove()
  }

  remove() {
    if (this.parentNode) {
      this.parentNode.removeChild(this)
    }
  }

  // ---
  // NonDocumentTypeChildNode:

  get nextElementSibling(): Element | null {
    return sibling(this.parentNode?.children, this, 1)
  }

  get previousElementSibling(): Element | null {
    return sibling(this.parentNode?.children, this, -1)
  }

  // ---
  // Slottable:
  // TODO

  assignedSlot
}

// define fallback .childNodes
Object.defineProperty(Node.prototype, 'childNodes', { value: Object.freeze(new NodeList()), writable: true })

const sibling = (nodes, child, offset) => (nodes && nodes[nodes.indexOf(child) + offset]) ?? null

const strToNode = (parent, n) => (typeof n === 'string' ? parent.ownerDocument.createTextNode('' + n) : n)