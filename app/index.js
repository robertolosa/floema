/* eslint-disable no-new */
import each from 'lodash/each'

import Preloader from 'components/Preloader'

import About from 'pages/About'
import Collections from 'pages/Collections'
import Home from 'pages/Home'
import Product from 'pages/Product'

class App {
  constructor () {
    this.createContent()

    this.createPreloader()
    this.createPages()

    this.addLinksListener()
    this.addEventListeners()

    this.onResize()

    this.update()
  }

  createPreloader () {
    this.preloader = new Preloader()
    this.preloader.once('completed', this.onPreloaded.bind(this))
  }

  createContent () {
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
  }

  createPages () {
    this.pages = {
      about: new About(),
      collections: new Collections(),
      home: new Home(),
      product: new Product()
    }

    this.page = this.pages[this.template]
    this.page.create()
  }

  /**
   * Events
   */
  onPreloaded () {
    this.preloader.destroy()

    this.onResize()

    this.page.show()
  }

  async onChange (url) {
    await this.page.hide()

    const request = await window.fetch(url)

    if (request.status === 200) {
      const html = await request.text()
      const div = document.createElement('div')

      div.innerHTML = html

      const divContent = div.querySelector('.content')

      this.template = divContent.getAttribute('data-template')

      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML

      this.page = this.pages[this.template]

      this.page.create()

      this.onResize()

      this.page.show()

      this.addLinksListener()
    } else {
      console.log('Error')
    }
  }

  onResize () {
    if (this.page && this.page.onResize) {
      this.page.onResize()
    }
  }

  /**
   * Loop
   */
  update () {
    if (this.page && this.page.update) {
      this.page.update()
    }

    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }

  /**
   * Listeners
   */
  addEventListeners () {
    window.addEventListener('resize', this.onResize.bind(this))
  }

  addLinksListener () {
    const links = document.querySelectorAll('a')

    each(links, link => {
      link.onclick = event => {
        event.preventDefault()

        const { href } = link

        this.onChange(href)
      }
    })
  }
}

new App()
