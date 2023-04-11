<template>
  <ion-page>
    <div v-show="!showControl">
      <ReaderOverlay
      v-if="ready"
      :chapter-index="chapterIndex" :chapter-list="chapterList"
      :image-index="imageIndex" :chapter-list-image-list="chapterListImageList"></ReaderOverlay>
    </div>

    <div v-show="showControl">
      <ReaderControl
      v-if="ready"
      v-model:chapter-index="chapterIndex" :chapter-list="chapterList"
      v-model:image-index="imageIndex" :chapter-list-image-list="chapterListImageList"></ReaderControl>
    </div>

    <ReaderModeHorizontal @ready-change="e => this.ready = true" v-model:image-index="imageIndex" v-model:chapter-index="chapterIndex" 
    :chapter-list="chapterList" :chapter-list-image-list="chapterListImageList"
    :get-chapter-image="getChapterImage" @toggle-control="onToggleControl"></ReaderModeHorizontal>
  </ion-page>
</template>

<script lang="ts">
import { toastController, IonPage } from '@ionic/vue'

import ReaderControl from '@/components/ReaderControl.vue'
import ReaderOverlay from '@/components/ReaderOverlay.vue'
import ReaderModeHorizontal from '@/components/ReaderModeHorizontal.vue'

import { defineComponent } from 'vue'
import { fetch } from '@/util/fetch'

import { store, state } from '@/util/store'

export default defineComponent({
  name: 'ReaderPage',
  components: {
    IonPage,
    ReaderModeHorizontal,
    ReaderControl,
    ReaderOverlay,
  },
  computed: {
    mode: () => store.setting.reader.mode,
    comic: () => state.reader.comic,
    chapterList: () => state.reader.chapterList,
    chapterIndex: {
      get() {
        return state.reader.chapterIndex
      },
      set(chapter) {
        console.log('readerChapterIndex', chapter)
        state.reader.chapterIndex = chapter
      },
    },
    nowChapter: () => state.reader.chapterList[state.reader.chapterIndex],
  },
  data: () => ({
    chapterListImageList: {},
    imageIndex: 0,
    loadStatus: 'idle', // idle, loaded,
    showControl: false,
    ready: false,
  }),
  watch: {
    nowChapter (value) {
      console.log('set reading progress', value, this.comic)
      return fetch(`/user/bookshelf/progress`, {
        method: 'POST',
        body: {
          comicId: this.comic.id,
          chapterId: value.id,
        },
      })
        .then((res: any) => {
          console.log('set reading progress', res)
        })
    },
  },
  methods: {
    getChapterImage(chapterId) {
      if (this.chapterListImageList[chapterId]) return Promise.resolve()

      this.loadStatus = 'loading'
      return fetch(`/comic/chapter/detail?comicId=${encodeURIComponent(this.comic.id)}&chapterId=${encodeURIComponent(chapterId)}`, {
        method: 'GET',
      })
        .then((res: any) => {
          console.log(res)
          this.loadStatus = 'loaded'
          this.chapterListImageList[chapterId] = res.result.list
        })
    },
    onToggleControl() {
      // TODO
      this.showControl = !this.showControl
      console.log('onToggleControl', this.showControl)
    },
  },
  watch: {
    imageIndex(index) {
      console.log('imageIndex', index)
    },
  },
  mounted() {
    console.log('ReaderPage mounted')
    console.log(state.reader)
    // this.getChapterImage(this.nowChapter.id)
  },
})
</script>

<style scoped>
.warpper {
  width: 100%;
  text-align: center;
}

.warpper ion-segment {
  width: auto;
  margin: 16px;
}
</style>
