<template>
  <IonPage class="readerControl">
    <ion-header class="header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-buttons slot="start">
            <ion-button @click="this.$router.go(-1)"><IonIcon :icon="arrowBack"></IonIcon></ion-button>
          </ion-buttons>
        </ion-buttons>
        <ion-title>{{ chapterItem.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    
    <ion-footer class="footer">
      <ion-toolbar>
        <ion-grid>
          <ion-row>
            <ion-range :pin="true" :pin-formatter="pinFormatter"
            :ticks="true" :snaps="true" :min="1" :max="imageNum" :value="this.imageIndex + 1"
            @ion-change="onRangeValueChange"
            @ion-knob-move-start="e => this.rangeTouch = true"
            @ion-knob-move-end="e => this.rangeTouch = false"
            ></ion-range>
          </ion-row>
          <ion-row>
            <ion-col size="3">
              <ion-button @click="onChapterListClick" expand="block" fill="outline">Chapters</ion-button>
            </ion-col>
            <ion-col size="3">
              <ion-button expand="block" fill="outline">Outline</ion-button>
            </ion-col>
            <ion-col size="3">
              <ion-button expand="block" fill="outline">Outline</ion-button>
            </ion-col>
            <ion-col size="3">
              <ion-button expand="block" fill="outline">Outline</ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-toolbar>
    </ion-footer>
  </IonPage>

  <ReaderControlChapterList v-model:is-open="isOpen" v-model:chapter-index="selfChapterIndex"
  :chapter-list="chapterList"></ReaderControlChapterList>
</template>

<script lang="ts">

import { defineComponent } from 'vue'

import { IonIcon, IonPage, IonRange, IonHeader, IonFooter, IonTitle, IonToolbar, IonBackButton, IonButton, IonButtons, IonRow, IonCol, IonGrid } from '@ionic/vue'

import { arrowBack } from 'ionicons/icons'

import ReaderControlChapterList from './ReaderControlChapterList.vue'

import { store, state } from '@/util/store'

export default defineComponent({
  name: 'ReaderControl',
  setup() {
    return {
      arrowBack,
    }
  },
  props: [
    'chapterIndex',
    'chapterList',
    'imageIndex',
    'chapterListImageList',
  ],
  emits: [
    'update:imageIndex',
    'update:chapterIndex',
  ],
  components: {
    // IonContent,
    IonFooter,
    IonTitle,
    IonToolbar,
    IonHeader,
    IonButton,
    IonButtons,
    IonGrid,
    IonRow,
    IonCol,
    IonRange,
    ReaderControlChapterList,
    IonPage,
    IonIcon,
  },
  computed: {
    chapterItem () {
      return this.chapterList[this.chapterIndex] || {}
    },
    chapterNum () {
      return this.chapterList.length
    },
    imageNum () {
      if (!this.chapterListImageList[this.chapterItem.id]) return 0
      return this.chapterListImageList[this.chapterItem.id].length
    },
    // rangeValue: {
    //   get () {
    //     return this.imageIndex + 1
    //   },
    //   set (value: number) {
    //     console.log(value)
    //     this.$emit('update:imageIndex', value - 1)
    //   },
    // },
    selfChapterIndex: {
      get () {
        return this.chapterIndex
      },
      set (value: number) {
        console.log('selfChapterIndex', value)
        this.$emit('update:chapterIndex', value)
      },
    },
  },
  data: () => {
    return {
      isOpen: false,
      rangeTouch: false,
    }
  },
  methods: {
    pinFormatter(value: number) {
      return `${value} / ${this.imageNum}`
    },
    onRangeValueChange(event) {
      if (!this.rangeTouch) return
      console.log('rangeValueChange', event)
      const value = event.detail.value
      console.log('rangeValueChange', value)
      this.$emit('update:imageIndex', value - 1)
    },
    onChapterListClick() {
      this.isOpen = false
      this.$nextTick(() => {
        this.isOpen = true
      })
    },
  },
})

</script>

<style scoped>
.readerControl {
  position: fixed;
  height: 100vh;
  width: 100vw;
  z-index: 999;
  
  background: rgba(0, 0, 0, 0.3);
  pointer-events: none;
}

.header {
  position: absolute;
  top: 0;
  width: 100%;
  pointer-events: all;
}

.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  pointer-events: all;
}

</style>
