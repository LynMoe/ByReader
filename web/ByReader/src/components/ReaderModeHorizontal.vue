<template>
  <div id="readerDiv"></div>
  <div class="spinner">
    <ion-spinner></ion-spinner>
  </div>
</template>

<script lang="ts">
import PhotoSwipeLightbox from 'photoswipe/lightbox'
import 'photoswipe/style.css'

import { IonPage, IonContent, IonList, IonImg, IonSpinner } from '@ionic/vue'

import { getImageLink } from '@/util/image'

import { defineComponent, ref } from 'vue'

import { getZone } from '@/util/zone'
import { store, state } from '@/util/store'

export default defineComponent({
  name: 'ReaderModeHorizontal',
  props: [
    'chapterIndex',
    'imageIndex',
    'chapterList',
    'chapterListImageList',
    'getChapterImage'
  ],
  emits: [
    'update:chapterIndex',
    'update:imageIndex',
    'toggleControl',
    'readyChange',
  ],
  components: {
    // IonImg,
    IonSpinner,
  },
  setup() {
    return {
      // modules: [Virtual, FreeMode, Zoom],
      getImageLink,
    }
  },
  computed: {
    pageDirection() {
      return store.setting.reader.direction === 'ltr' ? 'ltr' : 'rtl'
      // return 'rtl'
    },
  },
  data() {
    return {
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      loadingChapter: new Set(),
      loadedChapter: new Set(),

      chapterIdIndexMap: {},
      chapterIndexOld: -1,

      ready: false,
      tapTimeoutId: null,

      lightbox: null,

      slideChapterStartIndex: 0,
      slideChapterId: null,
      slideNowPage: 0,
      slideCacheData: {
        slideIndex: -1,
        slideStartIndex: -1,
      },
    }
  },
  watch: {
    imageIndex() {
      if (!this.ready || this.slideNowPage === this.imageIndex) return

      let pageIndex
      if (this.pageDirection === 'ltr') {
        pageIndex = this.slideChapterStartIndex + this.imageIndex
      } else {
        pageIndex = this.slideChapterStartIndex - this.imageIndex
      }

      this.lightbox.pswp.goTo(pageIndex)
    },
    // for external change
    chapterIndex: {
      immediate: true,
      handler() {
        if (this.chapterIndexOld === -1) {
          this.chapterIndexOld = this.chapterIndex
        }
        console.log('insideChapterChange', this.chapterIndex, this.oldChapterIndex)
        if (Math.abs(this.chapterIndex - this.oldChapterIndex) > 1) {
          console.log('chapterIndex', this.chapterIndex, this.oldChapterIndex)
          this.initChapter()
        }
        this.chapterIndexOld = this.chapterIndex
      },
    },
  },
  methods: {
    onResize() {
      this.windowHeight = window.innerHeight
      this.windowWidth = window.innerWidth
    },
    slideChange(slideActivateIndex) {
      // 加载章节并给lightbox添加并goTo到新页面后，lightbox会有延迟更新nowslide，导致slideChange被以错误的参数调用一次
      if (this.slideCacheData.slideIndex === slideActivateIndex && this.slideCacheData.slideActivateIndex !== this.slideChapterStartIndex) return
      this.slideCacheData.slideIndex = slideActivateIndex
      this.slideCacheData.slideActivateIndex = this.slideChapterStartIndex

      let slideNowPage = this.pageDirection === 'ltr' ? slideActivateIndex - this.slideChapterStartIndex : this.slideChapterStartIndex - slideActivateIndex
      this.slideNowPage = slideNowPage
      this.$emit('update:imageIndex', slideNowPage)

      let chapterIndex = this.chapterIdIndexMap[this.slideChapterId]
      let chapterImageList = this.chapterListImageList[this.slideChapterId]
      let chapterImageLength = chapterImageList.length

      console.log('slide change', slideActivateIndex, slideNowPage, this.slideChapterStartIndex, chapterIndex, chapterImageLength)

      let nextChapter = this.chapterList[chapterIndex + 1]
      let prevChapter = this.chapterList[chapterIndex - 1]

      if ((slideNowPage === -1) || slideNowPage >= chapterImageLength) {
        let nextOrPrev
        if ((slideNowPage === -1)) {
          nextOrPrev = 'prev'
        } else {
          nextOrPrev = 'next'
        }
        nextOrPrev === 'prev' ? chapterIndex-- : chapterIndex++
        this.$emit('update:chapterIndex', chapterIndex)
        this.slideChapterId = this.chapterList[chapterIndex].id

        if (nextOrPrev === 'prev' && this.pageDirection === 'ltr') {
          chapterImageLength = this.chapterListImageList[this.slideChapterId].length
          this.slideChapterStartIndex = this.slideChapterStartIndex - chapterImageLength
        } else if (nextOrPrev === 'next' && this.pageDirection === 'ltr') {
          this.slideChapterStartIndex = this.slideChapterStartIndex + chapterImageLength
        } else if (nextOrPrev === 'prev' && this.pageDirection === 'rtl') {
          chapterImageLength = this.chapterListImageList[this.slideChapterId].length
          this.slideChapterStartIndex = this.slideChapterStartIndex + chapterImageLength
        } else if (nextOrPrev === 'next' && this.pageDirection === 'rtl') {
          this.slideChapterStartIndex = this.slideChapterStartIndex - chapterImageLength
        }


        chapterImageList = this.chapterListImageList[this.slideChapterId]
        chapterImageLength = chapterImageList.length

        slideNowPage = this.pageDirection === 'ltr' ? slideActivateIndex - this.slideChapterStartIndex : this.slideChapterStartIndex - slideActivateIndex

        this.$emit('update:imageIndex', slideNowPage)

        nextChapter = this.chapterList[chapterIndex + 1]
        prevChapter = this.chapterList[chapterIndex - 1]
      }

      if (nextChapter && slideNowPage > chapterImageLength - 5) {
        console.log('load next chapter')
        this.loadChapter(nextChapter.id, 'next')
      }

      if (prevChapter && slideNowPage < 5 && slideNowPage >= 0) {
        console.log('load prev chapter', chapterIndex, prevChapter, slideNowPage, slideActivateIndex, this.slideChapterStartIndex)
        this.loadChapter(prevChapter.id, 'prev')
      }
    },
    onTap(releasePoint, event) {
      // this.swiperRef = swipe
      console.log(releasePoint, event)

      const x = event.clientX
      const y = event.clientY
      const width = this.windowWidth
      const height = this.windowHeight

      const zone = getZone(store.setting.reader.touchZone, width, height, x, y)
      console.log('zone', zone)

      switch (zone) {
        case 'left':
          this.prev()
          break
        case 'right':
          this.next()
          break
        case 'middle':
          if (this.tapTimeoutId) {
            clearTimeout(this.tapTimeoutId)
            this.tapTimeoutId = null
            // this.$emit('toggleControl')
          } else {
            this.tapTimeoutId = setTimeout(() => {
              this.$emit('toggleControl')
              this.tapTimeoutId = null
            }, 150)
          }
          break
        default:
          break
      }
    },
    prev() {
      this.lightbox.pswp.prev()
    },
    next() {
      this.lightbox.pswp.next()
    },
    loadChapter(chapterId, direction = 'next') {
      if (this.loadingChapter.has(chapterId) || this.loadedChapter.has(chapterId)) {
        return
      }

      this.loadingChapter.add(chapterId)
      return this.getChapterImage(chapterId)
        .then(() => {
          let result = this.chapterListImageList[chapterId].map((item, index) => {
            return {
              chapterImageIndex: index,
              chapterId: chapterId,
              src: getImageLink(item.url),
              width: 0,
              height: 0,
            }
          })
          if (this.pageDirection === 'rtl') {
            result = result.reverse()
          }
          console.log('loadChapter', direction, result)

          // console.log(this.lightbox, this.lightbox.pswp)
          const lb = this.lightbox.pswp || this.lightbox
          const originLength = lb.options.dataSource.length
          if ((direction === 'next' && this.pageDirection === 'ltr') || (direction === 'prev' && this.pageDirection === 'rtl')) {
            // Concat new slides to the end and refresh
            lb.options.dataSource = lb.options.dataSource.concat(result)

            console.log('next load concat', originLength, lb.options.dataSource.length)
            setTimeout(() => {
              for (let i = originLength; i < lb.options.dataSource.length; i++) {
                lb.refreshSlideContent && lb.refreshSlideContent(i)
              }
            }, 1)
          } else {
            lb.options.dataSource = result.concat(lb.options.dataSource)

            console.log('prev load concat', originLength, this.slideChapterStartIndex, lb.currSlide, result.length, lb.options.dataSource.length)

            if (this.slideChapterStartIndex === 0 && this.pageDirection === 'rtl') this.slideChapterStartIndex--
            this.slideChapterStartIndex = this.slideChapterStartIndex + result.length

            setTimeout(() => {
              for (let i = 0; i < lb.options.dataSource.length; i++) {
                lb.refreshSlideContent && lb.refreshSlideContent(i)
              }
              lb.currSlide && lb.goTo(lb.currSlide.index + result.length)
            }, 500)
          }
          console.log('loadChapter', lb.options.dataSource.length, lb.options.dataSource)

          this.loadingChapter.delete(chapterId)
          this.loadedChapter.add(chapterId)

          return result
        }).catch((e) => {
          console.error(e)
          this.loadingChapter.delete(chapterId)
        })
    },
    initLightbox() {
      const lightbox = new PhotoSwipeLightbox({
        dataSource: [],
        pswpModule: () => import('photoswipe'),
        bgOpacity: 1,
        loop: false,
        pinchToClose: false,
        closeOnVerticalDrag: false,
        imageClickAction: this.onTap,
        tapAction: this.onTap,
        appendToEl: document.querySelector('#readerDiv'),
        preloaderDelay: 0,
        preload: [7, 7],
        wheelToZoom: true,
        arrowPrev: false,
        arrowNext: false,
        escKey: false,
        secondaryZoomLevel: parseFloat(store.setting.reader.zoomLevel),
        spacing: parseFloat(store.setting.reader.spacing),
      })

      // remove counter and close btn
      lightbox.addFilter('uiElement', (element, data) => {
        if (data.name === 'counter' || data.name === 'close' || data.name === 'zoom') {
          element.style.display = 'none'
        }
        return element
      })

      // dyncamic load image size
      lightbox.on('contentLoadImage', ({ content }) => {
        const item = content.data
        if (item.width < 1 || item.height < 1) {
          console.log('load image for', item.src, content.index)
          const img = new Image()
          img.onload = () => {
            item.width = img.width
            item.height = img.height
            console.log('image loaded', item)
            this.lightbox.pswp.refreshSlideContent(content.index)
          }
          img.src = item.src
        }
      })

      lightbox.on('contentActivate', ({ content }) => {
        // content becomes active (the current slide)
        // can be default prevented
        console.log('contentActivate', content)
        this.slideChange(content.index)
      })

      lightbox.init()
      this.lightbox = lightbox
    },

    initChapter() {
      this.ready = false
      this.$emit('update:imageIndex', 0)
      for (let index = 0; index < this.chapterList.length; index++) {
        const item = this.chapterList[index]
        this.chapterIdIndexMap[item.id] = index
      }

      this.loadedChapter.clear()
      this.loadingChapter.clear()

      // load and preload chapters
      const chapterId = this.chapterList[this.chapterIndex].id
      return this.loadChapter(chapterId, 'next').then(() => {
        this.ready = true
        this.slideChapterId = chapterId
        this.$emit('readyChange', true)

        if (this.pageDirection === 'rtl') {
          this.lightbox.loadAndOpen(this.chapterListImageList[chapterId].length - 1)
        } else {
          this.lightbox.loadAndOpen(0)
        }
      })
    },
  },
  unmounted() {
    if (this.lightbox) {
      this.lightbox.destroy();
      this.lightbox = null;
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })

    this.initLightbox()
    this.$nextTick(() => {
      this.initChapter()
    })
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize)
  },
})
</script>

<style>
.pswp {
  --pswp-root-z-index: 500;
  --pswp-bg: #000;
  --pswp-placeholder-bg: #000;
}

@supports(padding: max(0px)) {
  .pswp__ui {
    top: max(0, env(safe-area-inset-top));
  }
}

.pswp__preloader {
  position: absolute;
  right: 0;
  top: env(safe-area-inset-top);
}
</style>

<style scoped>
.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
