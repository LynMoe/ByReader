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
        <ion-searchbar :value="searchValue" @ion-change="onSearchInput" :animated="true" placeholder="Search"></ion-searchbar>
      </ion-toolbar>
    </ion-header>

    <IonContent>
      <div class="warpper">
        <ion-segment style="margin: 16px; margin-bottom: 0px;" :scrollable="true" @ion-change="segmentChanged" :value="segmentValue">
          <ion-segment-button value="all">
            <ion-label>All</ion-label>
          </ion-segment-button>
          <ion-segment-button v-for="item in siteList" :key="item.id" :value="item.id">
            <ion-label>{{ item.name }}</ion-label>
          </ion-segment-button>
        </ion-segment>

        <LibraryList :item-list="itemList" />

        <ion-infinite-scroll v-if="segmentValue !== 'all'" @ionInfinite="ionInfinite">
          <ion-infinite-scroll-content></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </div>
    </IonContent>
  </IonPage>
</template>

<script lang="ts">
  import { IonBackButton, IonButtons, IonPage, IonHeader, IonSearchbar, IonTitle, IonToolbar, IonContent, IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue'
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
    },
    data: () => ({
      segmentValue: 'all',
      siteList: [],
      searchValue: '姐',
      timeoutId: 0,
      siteSearchResult: {},
      sitePage: {},
    }),
    computed: {
      itemList() {
        let result = []
        if (this.segmentValue === 'all') {
          for (const key in this.siteSearchResult) {
            const list = this.siteSearchResult[key]
            result = result.concat(list)
          }
        } else {
          result = this.siteSearchResult[this.segmentValue] || []
        }
        console.log(result)

        return result
      },
    },
    methods: {
      segmentChanged(event: any) {
        console.log(event.detail.value)
        this.segmentValue = event.detail.value
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
        this.getData(this.segmentValue).then(() => {
          event.target.complete()
        })
      },
      async getData(siteId = '') {
        console.log('search', this.searchValue)

        if (this.siteList.length === 0) {
          await fetch('/comic/site').then((res) => {
            this.siteList = res.result
          })
        }

        if (siteId === '') {
          await Promise.all(this.siteList.map((item) => {
            console.log('inside', item)
            this.sitePage[item.id] = 1
            return fetch(`/comic/search?siteId=${item.id}&keyword=${encodeURIComponent(this.searchValue)}&page=1`).then((res) => {
              this.siteSearchResult[item.id] = res.result.list
            })
          }))
        } else {
          console.log(siteId)
          if (this.sitePage[siteId] === -1) {
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
        }
      },
    },
    mounted() {
      this.getData()
    },
  })
</script>