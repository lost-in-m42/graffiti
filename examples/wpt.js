import { app, AppWindow } from '../lib/index.js'

console.log(`
  Note that this example requires some setup first:
  https://web-platform-tests.org/running-tests/from-local-system.html
`)

const runner = new AppWindow('WPT runner')

// TODO: find ../wpt | grep '\.html$' | grep '/dom/'
const BASE = 'http://web-platform.test:8000'

const urls = [
  `${BASE}/dom/attributes-are-nodes.html`,
  `${BASE}/dom/collections/domstringmap-supported-property-names.html`,
  `${BASE}/dom/collections/HTMLCollection-as-prototype.html`,
  `${BASE}/dom/collections/HTMLCollection-delete.html`,
  `${BASE}/dom/collections/HTMLCollection-empty-name.html`,
  `${BASE}/dom/collections/HTMLCollection-iterator.html`,
  `${BASE}/dom/collections/HTMLCollection-own-props.html`,
  `${BASE}/dom/collections/HTMLCollection-supported-property-indices.html`,
  `${BASE}/dom/collections/HTMLCollection-supported-property-names.html`,
  `${BASE}/dom/collections/namednodemap-supported-property-names.html`,
  `${BASE}/dom/events/AddEventListenerOptions-once.html`,
  `${BASE}/dom/events/AddEventListenerOptions-passive.html`,
  `${BASE}/dom/events/CustomEvent.html`,
  // `${BASE}/dom/events/document-level-touchmove-event-listener-passive-by-default.html`,
  // `${BASE}/dom/events/document-level-wheel-event-listener-passive-by-default.html`,
  `${BASE}/dom/events/Event-cancelBubble.html`,
  `${BASE}/dom/events/Event-constants.html`,
  // `${BASE}/dom/events/Event-constructors.html`,
  `${BASE}/dom/events/Event-defaultPrevented-after-dispatch.html`,
  `${BASE}/dom/events/Event-defaultPrevented.html`,
  `${BASE}/dom/events/event-disabled-dynamic.html`,
  // `${BASE}/dom/events/Event-dispatch-bubble-canceled.html`,
  `${BASE}/dom/events/Event-dispatch-bubbles-false.html`,
  `${BASE}/dom/events/Event-dispatch-bubbles-true.html`,
  // `${BASE}/dom/events/Event-dispatch-click.html`,
  // `${BASE}/dom/events/Event-dispatch-click.tentative.html`,
  // `${BASE}/dom/events/Event-dispatch-detached-click.html`,
  `${BASE}/dom/events/Event-dispatch-detached-input-and-change.html`,
  // `${BASE}/dom/events/Event-dispatch-handlers-changed.html`,
  // `${BASE}/dom/events/Event-dispatch-multiple-cancelBubble.html`,
  // `${BASE}/dom/events/Event-dispatch-multiple-stopPropagation.html`,
  `${BASE}/dom/events/Event-dispatch-omitted-capture.html`,
  `${BASE}/dom/events/Event-dispatch-on-disabled-elements.html`,
  `${BASE}/dom/events/Event-dispatch-order-at-target.html`,
  // `${BASE}/dom/events/Event-dispatch-order.html`,
  // `${BASE}/dom/events/Event-dispatch-other-document.html`,
  // `${BASE}/dom/events/Event-dispatch-propagation-stopped.html`,
  // `${BASE}/dom/events/Event-dispatch-redispatch.html`,
  // `${BASE}/dom/events/Event-dispatch-reenter.html`,
  `${BASE}/dom/events/Event-dispatch-target-moved.html`,
  `${BASE}/dom/events/Event-dispatch-target-removed.html`,
  `${BASE}/dom/events/Event-dispatch-throwing.html`,
  `${BASE}/dom/events/event-global.html`,
  `${BASE}/dom/events/Event-init-while-dispatching.html`,
  `${BASE}/dom/events/Event-initEvent.html`,
  `${BASE}/dom/events/Event-propagation.html`,
  `${BASE}/dom/events/Event-returnValue.html`,
  // `${BASE}/dom/events/Event-stopImmediatePropagation.html`,
  // `${BASE}/dom/events/Event-stopPropagation-cancel-bubbling.html`,
  `${BASE}/dom/events/Event-subclasses-constructors.html`,
  `${BASE}/dom/events/Event-timestamp-high-resolution.html`,
  `${BASE}/dom/events/Event-timestamp-safe-resolution.html`,
  `${BASE}/dom/events/Event-type-empty.html`,
  `${BASE}/dom/events/Event-type.html`,
  `${BASE}/dom/events/EventListener-handleEvent.html`,
  // `${BASE}/dom/events/EventListener-incumbent-global-1.sub.html`,
  // `${BASE}/dom/events/EventListener-incumbent-global-2.sub.html`,
  // `${BASE}/dom/events/EventListener-incumbent-global-subframe-1.sub.html`,
  // `${BASE}/dom/events/EventListener-incumbent-global-subframe-2.sub.html`,
  // `${BASE}/dom/events/EventListener-incumbent-global-subsubframe.sub.html`,
  // `${BASE}/dom/events/EventListener-invoke-legacy.html`,
  `${BASE}/dom/events/EventListenerOptions-capture.html`,
  // `${BASE}/dom/events/EventTarget-add-listener-platform-object.html`,
  `${BASE}/dom/events/EventTarget-add-remove-listener.html`,
  `${BASE}/dom/events/EventTarget-addEventListener.html`,
  `${BASE}/dom/events/EventTarget-dispatchEvent-returnvalue.html`,
  // `${BASE}/dom/events/EventTarget-dispatchEvent.html`,
  `${BASE}/dom/events/EventTarget-removeEventListener.html`,
  `${BASE}/dom/events/EventTarget-this-of-listener.html`,
  // `${BASE}/dom/events/replace-event-listener-null-browsing-context-crash.html`,
  // `${BASE}/dom/events/resources/event-global-extra-frame.html`,
  // `${BASE}/dom/events/scrolling/input-text-scroll-event-when-using-arrow-keys.html`,
  // `${BASE}/dom/events/scrolling/overscroll-deltas.html`,
  // `${BASE}/dom/events/scrolling/overscroll-event-fired-to-document.html`,
  // `${BASE}/dom/events/scrolling/overscroll-event-fired-to-element-with-overscroll-behavior.html`,
  // `${BASE}/dom/events/scrolling/overscroll-event-fired-to-scrolled-element.html`,
  // `${BASE}/dom/events/scrolling/overscroll-event-fired-to-window.html`,
  // `${BASE}/dom/events/scrolling/scrollend-event-fired-after-snap.html`,
  // `${BASE}/dom/events/scrolling/scrollend-event-fired-for-programmatic-scroll.html`,
  // `${BASE}/dom/events/scrolling/scrollend-event-fired-for-scrollIntoView.html`,
  // `${BASE}/dom/events/scrolling/scrollend-event-fired-to-document.html`,
  // `${BASE}/dom/events/scrolling/scrollend-event-fired-to-element-with-overscroll-behavior.html`,
  // `${BASE}/dom/events/scrolling/scrollend-event-fired-to-scrolled-element.html`,
  // `${BASE}/dom/events/scrolling/scrollend-event-fired-to-window.html`,
  // `${BASE}/dom/events/scrolling/scrollend-event-for-user-scroll.html`,
  // `${BASE}/dom/events/shadow-relatedTarget.html`,
  // `${BASE}/dom/events/webkit-animation-end-event.html`,
  // `${BASE}/dom/events/webkit-animation-iteration-event.html`,
  // `${BASE}/dom/events/webkit-animation-start-event.html`,
  // `${BASE}/dom/events/webkit-transition-end-event.html`,
  `${BASE}/dom/historical.html`,
  `${BASE}/dom/interface-objects.html`,
  // `${BASE}/dom/lists/DOMTokenList-coverage-for-attributes.html`,
  // `${BASE}/dom/lists/DOMTokenList-Iterable.html`,
  // `${BASE}/dom/lists/DOMTokenList-iteration.html`,
  // `${BASE}/dom/lists/DOMTokenList-stringifier.html`,
  // `${BASE}/dom/lists/DOMTokenList-value.html`,
  // `${BASE}/dom/nodes/append-on-Document.html`,
  // `${BASE}/dom/nodes/aria-attribute-reflection.tentative.html`,
  // `${BASE}/dom/nodes/aria-element-reflection.tentative.html`,
  // `${BASE}/dom/nodes/attributes-namednodemap.html`,
  // `${BASE}/dom/nodes/attributes.html`,
  // `${BASE}/dom/nodes/case.html`,
  // `${BASE}/dom/nodes/CharacterData-appendChild.html`,
  // `${BASE}/dom/nodes/CharacterData-appendData.html`,
  `${BASE}/dom/nodes/CharacterData-data.html`,
  `${BASE}/dom/nodes/CharacterData-deleteData.html`,
  `${BASE}/dom/nodes/CharacterData-insertData.html`,
  // `${BASE}/dom/nodes/CharacterData-remove.html`,
  `${BASE}/dom/nodes/CharacterData-replaceData.html`,
  `${BASE}/dom/nodes/CharacterData-substringData.html`,
  // `${BASE}/dom/nodes/CharacterData-surrogates.html`,
  // `${BASE}/dom/nodes/ChildNode-after.html`,
  // `${BASE}/dom/nodes/ChildNode-before.html`,
  // `${BASE}/dom/nodes/ChildNode-replaceWith.html`,
  // `${BASE}/dom/nodes/Comment-constructor.html`,
  // `${BASE}/dom/nodes/Document-adoptNode.html`,
  // `${BASE}/dom/nodes/Document-characterSet-normalization.html`,
  // `${BASE}/dom/nodes/Document-constructor.html`,
  // `${BASE}/dom/nodes/Document-contentType/contentType/contenttype_bmp.html`,
  // `${BASE}/dom/nodes/Document-contentType/contentType/contenttype_css.html`,
  // `${BASE}/dom/nodes/Document-contentType/contentType/contenttype_datauri_02.html`,
  // `${BASE}/dom/nodes/Document-contentType/contentType/contenttype_gif.html`,
  // `${BASE}/dom/nodes/Document-contentType/contentType/contenttype_html.html`,
  // `${BASE}/dom/nodes/Document-contentType/contentType/contenttype_javascripturi.html`,
  // `${BASE}/dom/nodes/Document-contentType/contentType/contenttype_jpg.html`,
  // `${BASE}/dom/nodes/Document-contentType/contentType/contenttype_mimeheader_01.html`,
  // `${BASE}/dom/nodes/Document-contentType/contentType/contenttype_mimeheader_02.html`,
  // `${BASE}/dom/nodes/Document-contentType/contentType/contenttype_png.html`,
  // `${BASE}/dom/nodes/Document-contentType/contentType/contenttype_txt.html`,
  // `${BASE}/dom/nodes/Document-contentType/contentType/contenttype_xml.html`,
  // `${BASE}/dom/nodes/Document-contentType/contentType/createDocument.html`,
  // `${BASE}/dom/nodes/Document-contentType/contentType/createHTMLDocument.html`,
  // `${BASE}/dom/nodes/Document-contentType/contentType/xhr_responseType_document.html`,
  // `${BASE}/dom/nodes/Document-createAttribute.html`,
  // `${BASE}/dom/nodes/Document-createCDATASection.html`,
  // `${BASE}/dom/nodes/Document-createComment.html`,
  // `${BASE}/dom/nodes/Document-createElement-namespace-tests/bare_mathml.html`,
  // `${BASE}/dom/nodes/Document-createElement-namespace-tests/bare_svg.html`,
  // `${BASE}/dom/nodes/Document-createElement-namespace-tests/bare_xhtml.html`,
  // `${BASE}/dom/nodes/Document-createElement-namespace-tests/empty.html`,
  // `${BASE}/dom/nodes/Document-createElement-namespace-tests/mathml.html`,
  // `${BASE}/dom/nodes/Document-createElement-namespace-tests/minimal_html.html`,
  // `${BASE}/dom/nodes/Document-createElement-namespace-tests/svg.html`,
  // `${BASE}/dom/nodes/Document-createElement-namespace-tests/xhtml_ns_changed.html`,
  // `${BASE}/dom/nodes/Document-createElement-namespace-tests/xhtml_ns_removed.html`,
  // `${BASE}/dom/nodes/Document-createElement-namespace-tests/xhtml.html`,
  // `${BASE}/dom/nodes/Document-createElement-namespace.html`,
  // `${BASE}/dom/nodes/Document-createElement.html`,
  // `${BASE}/dom/nodes/Document-createElementNS.html`,
  `${BASE}/dom/nodes/Document-createEvent.https.html`,
  // `${BASE}/dom/nodes/Document-createProcessingInstruction.html`,
  // `${BASE}/dom/nodes/Document-createTextNode.html`,
  // `${BASE}/dom/nodes/Document-createTreeWalker.html`,
  // `${BASE}/dom/nodes/Document-doctype.html`,
  `${BASE}/dom/nodes/Document-getElementById.html`,
  `${BASE}/dom/nodes/Document-getElementsByClassName.html`,
  `${BASE}/dom/nodes/Document-getElementsByTagName.html`,
  `${BASE}/dom/nodes/Document-getElementsByTagNameNS.html`,
  `${BASE}/dom/nodes/Document-implementation.html`,
  // `${BASE}/dom/nodes/Document-importNode.html`,
  // `${BASE}/dom/nodes/Document-URL.html`,
  `${BASE}/dom/nodes/DocumentFragment-constructor.html`,
  // `${BASE}/dom/nodes/DocumentFragment-getElementById.html`,
  // `${BASE}/dom/nodes/DocumentFragment-querySelectorAll-after-modification.html`,
  // `${BASE}/dom/nodes/DocumentType-literal.html`,
  // `${BASE}/dom/nodes/DocumentType-remove.html`,
  // `${BASE}/dom/nodes/DOMImplementation-createDocument-with-null-browsing-context-crash.html`,
  `${BASE}/dom/nodes/DOMImplementation-createDocument.html`,
  // `${BASE}/dom/nodes/DOMImplementation-createDocumentType.html`,
  // `${BASE}/dom/nodes/DOMImplementation-createHTMLDocument-with-null-browsing-context-crash.html`,
  // `${BASE}/dom/nodes/DOMImplementation-createHTMLDocument-with-saved-implementation.html`,
  // `${BASE}/dom/nodes/DOMImplementation-createHTMLDocument.html`,
  // `${BASE}/dom/nodes/DOMImplementation-hasFeature.html`,
  `${BASE}/dom/nodes/Element-childElement-null.html`,
  `${BASE}/dom/nodes/Element-childElementCount-dynamic-add.html`,
  `${BASE}/dom/nodes/Element-childElementCount-dynamic-remove.html`,
  `${BASE}/dom/nodes/Element-childElementCount-nochild.html`,
  `${BASE}/dom/nodes/Element-childElementCount.html`,
  `${BASE}/dom/nodes/Element-children.html`,
  // `${BASE}/dom/nodes/Element-classlist.html`,
  `${BASE}/dom/nodes/Element-closest.html`,
  `${BASE}/dom/nodes/Element-firstElementChild-namespace.html`,
  `${BASE}/dom/nodes/Element-firstElementChild.html`,
  // `${BASE}/dom/nodes/Element-getElementsByClassName.html`,
  // `${BASE}/dom/nodes/Element-getElementsByTagName-change-document-HTMLNess.html`,
  `${BASE}/dom/nodes/Element-getElementsByTagName.html`,
  // `${BASE}/dom/nodes/Element-getElementsByTagNameNS.html`,
  `${BASE}/dom/nodes/Element-hasAttribute.html`,
  `${BASE}/dom/nodes/Element-hasAttributes.html`,
  // `${BASE}/dom/nodes/Element-insertAdjacentElement.html`,
  // `${BASE}/dom/nodes/Element-insertAdjacentText.html`,
  // `${BASE}/dom/nodes/Element-lastElementChild.html`,
  // `${BASE}/dom/nodes/Element-matches-namespaced-elements.html`,
  // `${BASE}/dom/nodes/Element-matches.html`,
  `${BASE}/dom/nodes/Element-nextElementSibling.html`,
  `${BASE}/dom/nodes/Element-previousElementSibling.html`,
  `${BASE}/dom/nodes/Element-remove.html`,
  `${BASE}/dom/nodes/Element-removeAttribute.html`,
  `${BASE}/dom/nodes/Element-removeAttributeNS.html`,
  `${BASE}/dom/nodes/Element-setAttribute-crbug-1138487.html`,
  `${BASE}/dom/nodes/Element-setAttribute.html`,
  `${BASE}/dom/nodes/Element-siblingElement-null.html`,
  `${BASE}/dom/nodes/Element-tagName.html`,
  // `${BASE}/dom/nodes/Element-webkitMatchesSelector.html`,
  // `${BASE}/dom/nodes/getElementsByClassName-32.html`,
  // `${BASE}/dom/nodes/getElementsByClassName-empty-set.html`,
  // `${BASE}/dom/nodes/getElementsByClassName-whitespace-class-names.html`,
  // `${BASE}/dom/nodes/insert-adjacent.html`,
  // `${BASE}/dom/nodes/MutationObserver-attributes.html`,
  // `${BASE}/dom/nodes/MutationObserver-callback-arguments.html`,
  // `${BASE}/dom/nodes/MutationObserver-characterData.html`,
  // `${BASE}/dom/nodes/MutationObserver-childList.html`,
  // `${BASE}/dom/nodes/MutationObserver-disconnect.html`,
  // `${BASE}/dom/nodes/MutationObserver-document.html`,
  // `${BASE}/dom/nodes/MutationObserver-inner-outer.html`,
  // `${BASE}/dom/nodes/MutationObserver-sanity.html`,
  // `${BASE}/dom/nodes/MutationObserver-takeRecords.html`,
  `${BASE}/dom/nodes/Node-appendChild.html`,
  // `${BASE}/dom/nodes/Node-baseURI.html`,
  // `${BASE}/dom/nodes/Node-childNodes.html`,
  // `${BASE}/dom/nodes/Node-cloneNode-document-with-doctype.html`,
  // `${BASE}/dom/nodes/Node-cloneNode-external-stylesheet-no-bc.sub.html`,
  // `${BASE}/dom/nodes/Node-cloneNode-on-inactive-document-crash.html`,
  // `${BASE}/dom/nodes/Node-cloneNode-svg.html`,
  // `${BASE}/dom/nodes/Node-cloneNode-XMLDocument.html`,
  // `${BASE}/dom/nodes/Node-cloneNode.html`,
  // `${BASE}/dom/nodes/Node-compareDocumentPosition.html`,
  `${BASE}/dom/nodes/Node-constants.html`,
  // `${BASE}/dom/nodes/Node-contains.html`,
  // `${BASE}/dom/nodes/Node-insertBefore.html`,
  // `${BASE}/dom/nodes/Node-isConnected-shadow-dom.html`,
  // `${BASE}/dom/nodes/Node-isConnected.html`,
  // `${BASE}/dom/nodes/Node-isEqualNode.html`,
  // `${BASE}/dom/nodes/Node-isSameNode.html`,
  // `${BASE}/dom/nodes/Node-lookupNamespaceURI.html`,
  // `${BASE}/dom/nodes/Node-mutation-adoptNode.html`,
  `${BASE}/dom/nodes/Node-nodeName.html`,
  `${BASE}/dom/nodes/Node-nodeValue.html`,
  // `${BASE}/dom/nodes/Node-normalize.html`,
  `${BASE}/dom/nodes/Node-parentElement.html`,
  // `${BASE}/dom/nodes/Node-parentNode-iframe.html`,
  // `${BASE}/dom/nodes/Node-parentNode.html`,
  // `${BASE}/dom/nodes/Node-properties.html`,
  // `${BASE}/dom/nodes/Node-removeChild.html`,
  // `${BASE}/dom/nodes/Node-replaceChild.html`,
  // `${BASE}/dom/nodes/Node-textContent.html`,
  // `${BASE}/dom/nodes/NodeList-Iterable.html`,
  // `${BASE}/dom/nodes/ParentNode-append.html`,
  // `${BASE}/dom/nodes/ParentNode-children.html`,
  // `${BASE}/dom/nodes/ParentNode-prepend.html`,
  // `${BASE}/dom/nodes/ParentNode-querySelector-All-content.html`,
  // `${BASE}/dom/nodes/ParentNode-querySelector-All.html`,
  // `${BASE}/dom/nodes/ParentNode-querySelector-case-insensitive.html`,
  // `${BASE}/dom/nodes/ParentNode-querySelector-escapes.html`,
  // `${BASE}/dom/nodes/ParentNode-querySelector-scope.html`,
  // `${BASE}/dom/nodes/ParentNode-querySelectorAll-removed-elements.html`,
  // `${BASE}/dom/nodes/ParentNode-querySelectors-exclusive.html`,
  // `${BASE}/dom/nodes/ParentNode-querySelectors-namespaces.html`,
  // `${BASE}/dom/nodes/ParentNode-querySelectors-space-and-dash-attribute-value.html`,
  // `${BASE}/dom/nodes/ParentNode-replaceChildren.html`,
  // `${BASE}/dom/nodes/prepend-on-Document.html`,
  // `${BASE}/dom/nodes/query-target-in-load-event.html`,
  // `${BASE}/dom/nodes/query-target-in-load-event.part.html`,
  // `${BASE}/dom/nodes/remove-and-adopt-thcrash.html`,
  // `${BASE}/dom/nodes/remove-from-shadow-host-and-adopt-into-iframe-ref.html`,
  // `${BASE}/dom/nodes/remove-from-shadow-host-and-adopt-into-iframe.html`,
  // `${BASE}/dom/nodes/remove-unscopable.html`,
  // `${BASE}/dom/nodes/rootNode.html`,
  // `${BASE}/dom/nodes/svg-template-querySelector.html`,
  // `${BASE}/dom/nodes/Text-constructor.html`,
  // `${BASE}/dom/nodes/Text-splitText.html`,
  // `${BASE}/dom/nodes/Text-wholeText.html`,
  // `${BASE}/dom/ranges/Range-adopt-test.html`,
  // `${BASE}/dom/ranges/Range-attributes.html`,
  // `${BASE}/dom/ranges/Range-cloneContents.html`,
  // `${BASE}/dom/ranges/Range-cloneRange.html`,
  // `${BASE}/dom/ranges/Range-collapse.html`,
  // `${BASE}/dom/ranges/Range-commonAncestorContainer-2.html`,
  // `${BASE}/dom/ranges/Range-commonAncestorContainer.html`,
  // `${BASE}/dom/ranges/Range-compareBoundaryPoints.html`,
  // `${BASE}/dom/ranges/Range-comparePoint-2.html`,
  // `${BASE}/dom/ranges/Range-comparePoint.html`,
  // `${BASE}/dom/ranges/Range-constructor.html`,
  // `${BASE}/dom/ranges/Range-deleteContents.html`,
  // `${BASE}/dom/ranges/Range-detach.html`,
  // `${BASE}/dom/ranges/Range-extractContents.html`,
  // `${BASE}/dom/ranges/Range-insertNode.html`,
  // `${BASE}/dom/ranges/Range-intersectsNode-2.html`,
  // `${BASE}/dom/ranges/Range-intersectsNode-binding.html`,
  // `${BASE}/dom/ranges/Range-intersectsNode.html`,
  // `${BASE}/dom/ranges/Range-isPointInRange.html`,
  // `${BASE}/dom/ranges/Range-mutations-appendChild.html`,
  // `${BASE}/dom/ranges/Range-mutations-appendData.html`,
  // `${BASE}/dom/ranges/Range-mutations-dataChange.html`,
  // `${BASE}/dom/ranges/Range-mutations-deleteData.html`,
  // `${BASE}/dom/ranges/Range-mutations-insertBefore.html`,
  // `${BASE}/dom/ranges/Range-mutations-insertData.html`,
  // `${BASE}/dom/ranges/Range-mutations-removeChild.html`,
  // `${BASE}/dom/ranges/Range-mutations-replaceChild.html`,
  // `${BASE}/dom/ranges/Range-mutations-replaceData.html`,
  // `${BASE}/dom/ranges/Range-mutations-splitText.html`,
  // `${BASE}/dom/ranges/Range-selectNode.html`,
  // `${BASE}/dom/ranges/Range-set.html`,
  // `${BASE}/dom/ranges/Range-stringifier.html`,
  // `${BASE}/dom/ranges/Range-surroundContents.html`,
  // `${BASE}/dom/ranges/Range-test-iframe.html`,
  // `${BASE}/dom/ranges/StaticRange-constructor.html`,
  // `${BASE}/dom/slot-recalc-ref.html`,
  // `${BASE}/dom/slot-recalc.html`,
  // `${BASE}/dom/svg-insert-crash.html`,
  // `${BASE}/dom/traversal/NodeFilter-constants.html`,
  // `${BASE}/dom/traversal/NodeIterator-removal.html`,
  // `${BASE}/dom/traversal/NodeIterator.html`,
  // `${BASE}/dom/traversal/TreeWalker-acceptNode-filter.html`,
  // `${BASE}/dom/traversal/TreeWalker-basic.html`,
  // `${BASE}/dom/traversal/TreeWalker-currentNode.html`,
  // `${BASE}/dom/traversal/TreeWalker-previousNodeLastChildReject.html`,
  // `${BASE}/dom/traversal/TreeWalker-previousSiblingLastChildSkip.html`,
  // `${BASE}/dom/traversal/TreeWalker-traversal-reject.html`,
  // `${BASE}/dom/traversal/TreeWalker-traversal-skip-most.html`,
  // `${BASE}/dom/traversal/TreeWalker-traversal-skip.html`,
  // `${BASE}/dom/traversal/TreeWalker-walking-outside-a-tree.html`,
  // `${BASE}/dom/traversal/TreeWalker.html`,
  // `${BASE}/dom/window-extends-event-target.html`,
]

for (const url of urls) {
  console.log('running', url)
  await runner.loadURL(url)
  await new Promise(resolve => setTimeout(resolve, 100))

  const summary = await runner.eval(`document.querySelector("#log > section")?.textContent`)

  if (summary?.match(/Fail/)) {
    console.log(await runner.eval(`document.querySelector("#log")?.textContent`))
    console.log('failed, waiting')
    await new Promise(resolve => setTimeout(resolve, 5000))
  }

  console.log(summary)
  console.log('---')
}
