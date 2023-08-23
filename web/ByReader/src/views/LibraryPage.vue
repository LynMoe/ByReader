<template>
  <ion-page>
    <ion-header v-if="getPlatforms().includes('ios')" :translucent="true">
      <ion-toolbar>
        <ion-title>Library</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-header v-else>
      <ion-toolbar>
        <ion-title>Library</ion-title>
        <ion-buttons style="margin-right: 8px" slot="end">
          <!-- <ion-button @click="this.$router.push({ name: 'SettingPage' })">
            <IonIcon :icon="settingsOutline"></IonIcon>
          </ion-button> -->
          <ion-button @click="this.$router.push({ name: 'SearchPage' })">
            <IonIcon :icon="searchOutline"></IonIcon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header v-if="getPlatforms().includes('ios')" collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Library</ion-title>
          <ion-buttons style="margin-right: 8px" :collapse="true" slot="end">
            <!-- <ion-button @click="this.$router.push({ name: 'SettingPage' })">
              <IonIcon :icon="settingsOutline"></IonIcon>
            </ion-button> -->
            <ion-button @click="this.$router.push({ name: 'SearchPage' })">
              <IonIcon :icon="searchOutline"></IonIcon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <div class="warpper">
        <ion-segment @ion-change="segmentChanged" :value="segmentValue">
          <ion-segment-button v-for="item in this.segmentList" :key="item" :value="item">
            <ion-label>{{ item }}</ion-label>
          </ion-segment-button>
        </ion-segment>
        <LibraryList :item-list="itemList" />
      </div>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { getPlatforms, onIonViewWillEnter, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel, IonButtons, IonButton, IonIcon } from '@ionic/vue'
import { searchOutline, settingsOutline } from 'ionicons/icons'
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
      settingsOutline,
      getPlatforms,
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
    segmentValue: '',
    segmentList: [],
    itemList: [],
  }),
  computed: {
    newItemList() {
      const list = []

      return list
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

      return fetch('/user/bookshelf', {
        method: 'GET',
      }).then(res => res.result.comicIds)
        .then(res => {
          this.segmentList = Object.keys(res)
          if (!this.segmentList.includes(this.segmentValue)) {
            this.segmentValue = this.segmentList[0]
          }
          store.bookshelfList = res

          res = res[this.segmentValue]
          return res
        })
        .then(res => this.getBatchComicInfo(res)).then(res => {
          this.itemList = res
        })
    },
  },
  watch: {
    segmentValue: {
      handler() {
        this.getData()
      },
      immediate: false,
    },
  },
  ionViewWillEnter() {
    console.log('ionViewWillEnter event fired')
    this.getData()
  },
})
</script>

<style scoped>.warpper {
  width: 100%;
  text-align: center;
}

.warpper ion-segment {
  width: auto;
  margin: 16px;
}</style>
