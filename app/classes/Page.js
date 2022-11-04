import GSAP from 'gsap'
import each from 'lodash/each'

export default class Page {
  constructor ({ id, element, elements }) {
    this.id = id

    this.selector = element
    this.selectorChildren = { ...elements } // Deconstructuring
  }

  create () {
    this.element = document.querySelector(this.selector)
    this.elements = {}

    each(this.selectorChildren, (entry, key) => {
      if (entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)) {
        this.elements[key] = entry
      } else {
        this.elements[key] = document.querySelectorAll(entry)

        if (this.elements[key].length === 0) {
          this.elements[key] = null
        } else if (this.elements[key].length === 1) {
          this.elements[key] = document.querySelector(entry)
        }
      }
    })
  }

  show () {
    return new Promise(resolve => {
      GSAP.from(this.element, {
        autoAlpha: 0,
        onComplete: resolve
      })
    })
  }

  hide () {
    return new Promise(resolve => {
      GSAP.to(this.element, {
        autoAlpha: 0,
        onComplete: resolve
      })
    })
  }
}
