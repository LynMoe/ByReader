<template>
  <IonPage>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Search</ion-title>
      </ion-toolbar>
      <ion-toolbar>
        <ion-searchbar :value="''" @ion-input="onSearchInput" :animated="true" placeholder="Search"></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <IonContent>
      <ion-segment style="margin: 16px; margin-bottom: 0px;" :scrollable="true" :disabled="siteList.length === 0"
        @ion-change="segmentChanged" :value="segmentValue">
        <ion-segment-button v-if="siteList.length === 0" value="loading">
          <ion-label>Loading</ion-label>
        </ion-segment-button>
        <ion-segment-button v-for="item in siteList" :key="item.id" :value="item.id">
          <ion-label>{{ item.name }}</ion-label>
        </ion-segment-button>
      </ion-segment>

      <LibraryList :item-list="itemList" />

      <ion-infinite-scroll v-if="segmentValue !== 'loading' && itemList.length > 0" @ionInfinite="ionInfinite">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </IonContent>
  </IonPage>
</template>

<script lang="ts">
import {
  IonBackButton,
  IonButtons,
  IonPage,
  IonHeader,
  IonSearchbar,
  IonTitle,
  IonToolbar,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from '@ionic/vue'
import { defineComponent } from 'vue'

import { fetch } from '@/util/fetch'

import LibraryList from '@/components/LibraryList.vue'

export default defineComponent({
  components: {
    IonHeader,
    IonSearchbar,
    IonTitle,
    IonToolbar,
    IonContent,
    LibraryList,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonPage,
    IonBackButton,
    IonButtons,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
  },
  data: () => ({
    segmentValue: 'loading',
    siteList: [],
    searchValue: '',
    searchValueOld: '',
    timeoutId: 0,
    siteSearchResult: {},
    sitePage: {},
  }),
  computed: {
    itemList() {
      const result = this.siteSearchResult[this.segmentValue] || []
      console.log(result)

      return result
    },
  },
  methods: {
    segmentChanged(event: any) {
      console.log(event.detail.value)
      this.segmentValue = event.detail.value
      this.getData()
    },
    onSearchInput(event: any) {
      console.log(event.detail.value)

      if (this.timeoutId) {
        clearTimeout(this.timeoutId)
      }
      this.timeoutId = setTimeout(() => {
        this.searchValue = event.detail.value
        this.getData()
      }, 1000)
    },
    ionInfinite(event: any) {
      console.log('ionInfinite')
      this.getData().then(() => {
        event.target.complete()
      })
    },
    async getData() {
      const siteId = this.segmentValue
      if (this.searchValue === '') {
        return
      }
      console.log('search', this.searchValue)
      if (this.searchValue !== this.searchValueOld) {
        this.searchValueOld = this.searchValue
        this.siteSearchResult = {}
        this.sitePage = {}
      }

      // if (this.siteList.length === 0) {
      //   await fetch('/comic/site').then((res) => {
      //     this.siteList = res.result
      //   })
      // }

      console.log(siteId)
      if (this.sitePage[siteId] === undefined) {
        this.sitePage[siteId] = 0
      } else if (this.sitePage[siteId] === -1) {
        console.log(siteId, 'end')
        return
      }

      this.sitePage[siteId]++
      await fetch(`/comic/search?siteId=${siteId}&keyword=${encodeURIComponent(this.searchValue)}&page=${this.sitePage[siteId]}`).then((res) => {
        const ori = this.siteSearchResult[siteId] || []
        if (res.result.isEnd) {
          this.sitePage[siteId] = -1
        }
        this.siteSearchResult[siteId] = ori.concat(res.result.list)
      })
    },
  },
  ionViewWillEnter() {
    this.getData()
    fetch('/comic/site').then((res) => {
      this.siteList = res.result
      this.segmentValue = this.siteList[0].id
    })
  },
})
</script>