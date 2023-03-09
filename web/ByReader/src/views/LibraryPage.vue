<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Library</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Library</ion-title>
          <ion-buttons style="margin-right: 8px" :collapse="true" slot="end">
            <ion-button @click="this.$router.push('/library/search')"><IonIcon :icon="searchOutline"></IonIcon></ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <div class="warpper">
        <ion-segment @ion-change="segmentChanged" :value="segmentValue">
          <ion-segment-button value="fav">
            <ion-label>Favorite</ion-label>
          </ion-segment-button>
          <ion-segment-button value="history">
            <ion-label>History</ion-label>
          </ion-segment-button>
        </ion-segment>
        <LibraryList :item-list="itemList" />
      </div>
      
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel, IonButtons, IonButton, IonIcon } from '@ionic/vue'
import { searchOutline } from 'ionicons/icons'
import LibraryList from '@/components/LibraryList.vue'

import { store, state } from '@/util/store'
import { fetch } from '@/util/fetch'
import { getImageLink } from '@/util/image'

import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LibraryPage',
  setup() {
    return {
      searchOutline,
    }
  },
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    LibraryList,
    IonLabel,
    IonButton,
    IonButtons,
    IonIcon,
  },
  data: () => ({
    segmentValue: 'fav',
    itemList: [],
  }),
  computed: {
    historyIds() {
      return store.historyIds
    },
  },
  methods: {
    segmentChanged(event: any) {
      console.log(event.detail.value)
      this.segmentValue = event.detail.value
    },
    getBatchComicInfo(comicIds: Array<number>) {
      if (comicIds.length === 0) return Promise.resolve([])
      return fetch('/comic/comic?comicIds=' + encodeURIComponent(comicIds.join(',')), {
        method: 'GET',
      }).then((res: any) => {
        res = res.result.map((item: any) => {
          // item.data = {
          //   ...item.data,
          //   cover: getImageLink(item.data.cover),
          // }
          return item.data
        })

        console.log(res)

        return res
      })
    },
    getData() {
      console.log('getData', this.segmentValue)

      if (this.segmentValue === 'fav') {
        this.itemList = store.libraryItems

        return fetch('/user/bookshelf', {
          method: 'GET',
        }).then(res => res.result.comicIds).then(res => this.getBatchComicInfo(res)).then(res => {
          store.libraryItems = res
          if (this.segmentValue === 'fav') {
            this.itemList = res
          }
        })
      } else if (this.segmentValue === 'history') {
        // const history = store.historyIds
        this.itemList = store.historyItems
      }

      return Promise.resolve()
    },
  },
  watch: {
    segmentValue() {
      this.getData()
    },
    historyIds() {
      this.getData()
    },
  },
  beforeMount() {
    this.getData()
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
