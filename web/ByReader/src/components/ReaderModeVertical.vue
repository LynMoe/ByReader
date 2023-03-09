<template>
  <swiper v-if="ready" :modules="modules" :space-between="0" :zoom="{
    maxRatio: 2,
  }" :free-mode="false" :virtual="{
    addSlidesAfter: 3,
    addSlidesBefore: 3,
  }" @tap="onTap" @slideChange="slideChange" @afterInit="s => swiperRef = s">
    <swiper-slide v-for="slideContent in slides" :key="slideContent.url" :virtualIndex="slideContent.url">
      <div class="imgWarpper" style="height: 100%;">
        <div class="swiper-zoom-container" style="height: 100%">
          <img :src="getImageLink(slideContent.url)" />
        </div>
      </div>
    </swiper-slide>
  </swiper>

  <!-- <div>
    <img v-for="item in filteredItems" :key="item.url" :src="item.url.replace('copymanga:', '')" />
  </div> -->
</template>

<script lang="ts">

import { Swiper, SwiperSlide } from 'swiper/vue'
import { Pagination, Virtual, FreeMode, Zoom } from 'swiper'

import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/virtual'

import { IonPage, IonContent, IonList, IonImg } from '@ionic/vue'

import { getImageLink } from '@/util/image'

import { defineComponent, ref } from 'vue'

import { getZone } from '@/util/zone'
import { store, state } from '@/util/store'

export default defineComponent({
  name: 'ReaderModeVertical',
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
    Swiper,
    SwiperSlide,
    // IonImg,
  },
  setup() {
    return {
      modules: [Virtual, FreeMode, Zoom],
      getImageLink,
    }
  },
  data() {
    return {
      slides: [],
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth,
      swiperRef: null,
      loadingChapter: new Set(),
      loadedChapter: new Set(),
      chapterIdIndexMap: {},
      activeSlideStartIndex: 0,
      oldChapterIndex: -1,
      ready: false,
      tapTimeoutId: null,
    }
  },
  watch: {
    imageIndex() {
      if (!this.ready) return
      this.swiperRef.slideTo(this.activeSlideStartIndex + this.imageIndex)
    },
    chapterIndex: {
      immediate: true,
      handler() {
        if (this.oldChapterIndex === -1) {
          this.oldChapterIndex = this.chapterIndex
        }
        console.log('insideChapterChange', this.chapterIndex, this.oldChapterIndex)
        if (Math.abs(this.chapterIndex - this.oldChapterIndex) > 1) {
          console.log('chapterIndex', this.chapterIndex, this.oldChapterIndex)
          this.initChapter()
        }
        this.oldChapterIndex = this.chapterIndex
      },
    },
  },
  methods: {
    onResize() {
      this.windowHeight = window.innerHeight
      this.windowWidth = window.innerWidth
    },
    slideChange() {
      console.log('slideChange', this.swiperRef.activeIndex, this.slides[this.swiperRef.activeIndex])
      const nowSlide = this.slides[this.swiperRef.activeIndex]
      const chapterId = nowSlide.chapterId
      const chapterIndex = this.chapterIdIndexMap[chapterId]
      console.log('slideChange', chapterId, chapterIndex, nowSlide.index, this.chapterList, this.chapterIdIndexMap)

      this.activeSlideStartIndex = this.swiperRef.activeIndex - nowSlide.index

      this.$emit('update:chapterIndex', chapterIndex)
      this.$emit('update:imageIndex', nowSlide.index)
      this.preloadChapter(chapterIndex, nowSlide.index)
    },
    preloadChapter(chapterIndex, imageIndex) {
      console.log('preloadChapter', chapterIndex, imageIndex)
      const chapterId = this.chapterList[chapterIndex].id

      const chapterImageList = this.chapterListImageList[chapterId]
      const chapterImageLength = chapterImageList.length

      const nextChapter = this.chapterList[chapterIndex + 1]
      const prevChapter = this.chapterList[chapterIndex - 1]

      if (nextChapter && imageIndex > chapterImageLength - 5 && !this.loadedChapter.has(nextChapter.id)) {
        console.log('load next chapter')
        this.loadItem(nextChapter.id, 'next')
      }

      if (prevChapter && imageIndex < 5 && !this.loadedChapter.has(prevChapter.id)) {
        console.log('load prev chapter')
        this.loadItem(prevChapter.id, 'prev')
      }
    },
    onTap(swipe, event) {
      this.swiperRef = swipe

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
            }, 200)
          }
          break
        default:
          break
      }
    },
    prev() {
      this.swiperRef.slidePrev(300)
    },
    next() {
      this.swiperRef.slideNext(300)
    },
    loadItem(chapterId, direction = 'next') {
      if (this.loadingChapter.has(chapterId)) {
        return
      }
      this.loadingChapter.add(chapterId)
      return this.getChapterImage(chapterId)
        .then(() => {
          const result = this.chapterListImageList[chapterId].map((item, index) => {
            return {
              index: index,
              chapterId: chapterId,
              url: item.url,
            }
          })
          if (direction === 'next') {
            this.slides = this.slides.concat(result)
          } else {
            this.slides = result.concat(this.slides)
            console.log('concat', this.swiperRef.activeIndex, result.length, this.swiperRef.activeIndex + result.length)
            this.swiperRef.slideTo(this.swiperRef.activeIndex + result.length, 0)
          }
          this.loadingChapter.delete(chapterId)
          this.loadedChapter.add(chapterId)

          return result
        }).catch(() => {
          this.loadingChapter.delete(chapterId)
        })
    },

    initChapter() {
      this.ready = false
      this.$emit('update:imageIndex', 0)
      for (let index = 0; index < this.chapterList.length; index++) {
        const item = this.chapterList[index]
        this.chapterIdIndexMap[item.id] = index
      }

      this.slides = []
      this.loadedChapter.clear()
      this.loadingChapter.clear()

      let chapterId = this.chapterList[this.chapterIndex].id
      this.loadItem(chapterId, 'next')
        .then(() => {
          if (this.chapterIndex < this.chapterList.length - 1) {
            console.log('chapterIndex < chapterList.length - 1', this.chapterIndex)
            chapterId = this.chapterList[this.chapterIndex + 1].id
            return this.loadItem(chapterId, 'next')
          }
        }).then(() => {
          this.ready = true
          this.$emit('readyChange', true)
        }).then(() => {
          if (this.chapterIndex > 0) {
            console.log('chapterIndex > 0', this.chapterIndex)
            chapterId = this.chapterList[this.chapterIndex - 1].id
            return this.loadItem(chapterId, 'prev')
          }
        })
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })

    this.initChapter()
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize)
  },
})
</script>

<style>
.swiper {
  width: 100%;
  height: 100%;

}

.swiper-zoom-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff;

  /* Center slide text vertically */
  display: flex;
  justify-content: center;
  align-items: center;
}

.swiper-slide img {
  display: block;
  max-width: 100%;
  max-block-size: 100%;
  object-fit: cover;
}
</style>
