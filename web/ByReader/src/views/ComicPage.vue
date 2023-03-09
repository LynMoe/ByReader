<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Comic</ion-title>
        <ion-buttons slot="end">
          <ion-button>Download</ion-button> <!-- TODO: download icon -->
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-grid>
        <ion-row>
          <ion-col size="4">
            <img style="width: 100%" :src="comic.cover" />
          </ion-col>
          <ion-col size="8">
            <div>
              <h3 class="comicInfo comicName">{{ comic.name }}</h3>
              <p class="comicInfo">Author: <a href="#">Example</a></p>
              <p class="comicInfo comicLastUpdate">Last Update: <span>22/11/04</span></p>
            </div>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-grid>
        <ion-row>
          <ion-col size="6">
            <ion-button color="secondary" expand="block">
              <ion-icon slot="start" :icon="heartOutline"></ion-icon>
              Like
            </ion-button>
          </ion-col>
          <ion-col size="6">
            <ion-button @click="onStartReading(0)" color="success" expand="block">
              <ion-icon slot="start" :icon="bookOutline"></ion-icon>
              Continue
            </ion-button>
          </ion-col>
        </ion-row>
      </ion-grid>

      <div class="comicDescription">
        <p>{{ comic.description }}</p>
      </div>

      <div>
        <ion-segment :scrollable="true" @ion-change="segmentChanged" :value="segmentValue">
          <ion-segment-button v-for="item in this.bundle" :key="item.id" :value="item.id">
            <ion-label>{{ item.name }}</ion-label>
          </ion-segment-button>
        </ion-segment>

        <div class="chapterList">
          <ion-item button :detail="true" v-for="(item, index) in filteredChapterList" :key="item.id">
            <ion-label @click="onStartReading(index)">{{ item.name }}</ion-label>
          </ion-item>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonSegment, IonSegmentButton } from '@ionic/vue'
import { IonIcon, IonLabel, IonItem, IonButtons, IonButton, IonBackButton, IonHeader, IonToolbar, IonContent, IonTitle, IonCol, IonGrid, IonRow } from '@ionic/vue'
import { defineComponent } from 'vue'
import { heartOutline, heartDislikeOutline, bookOutline } from 'ionicons/icons'

import { useRoute } from 'vue-router'

import { fetch } from '@/util/fetch'
import { state, store } from '@/util/store'

export default defineComponent({
  setup() {
    const route = useRoute()
    const comicId = route.params.comicId

    return {
      heartOutline,
      heartDislikeOutline,
      bookOutline,
      comicId,
    }
  },
  components: {
    IonPage,
    IonButtons,
    IonButton,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
    IonCol,
    IonGrid,
    IonRow,
    IonLabel,
    IonSegment,
    IonSegmentButton,
    IonItem,
    IonIcon,
    IonBackButton,
  },
  computed: {
    listChapterList() {
      const sort = store.setting.comic.sort
      if (sort == 'asc') {
        return this.chapterList
      } else {
        return [...this.chapterList].reverse()
      }
    },
    filteredChapterList() {
      return this.listChapterList.filter(i => this.segmentValue == '0' || i.type == this.segmentValue)
    },
  },
  data() {
    return {
      chapterList: [],
      bundle: [],
      segmentValue: 'default',
      comic: {},
    }
  },
  methods: {
    segmentChanged(event: any) {
      this.segmentValue = event.detail.value
    },
    onStartReading(chapterIndex) {
      state.reader.comic = this.comic
      state.reader.chapterList = this.filteredChapterList
      state.reader.chapterIndex = chapterIndex

      this.$router.push('/reader')
    },
  },
  beforeMount() {
    if (!state.comicList[this.comicId]) {
      // TODO: fetch data
    } else {
      this.comic = state.comicList[this.comicId]
    }
    console.log(state.comicList)

    this.bundle = [{
      id: '0',
      name: 'All',
    }]
    this.segmentValue = this.bundle[0].id

    this.chapterList = []
    fetch(`/comic/chapter?comicId=${encodeURIComponent(this.comicId)}`, {
      method: 'GET',
    }).then((res) => {
      const presented = new Set()
      res.result.list.forEach((item: any) => {
        presented.add(item.type)
      })

      this.chapterList = res.result.list
      this.bundle = this.bundle.concat(res.result.bundle.filter(i => presented.has(i.id)))
    })
  },
})
</script>

<style scoped>
.comicInfo {
  margin-left: 4px;
}

.comicName {
  font-size: 20px;
  margin: 0;
  margin-bottom: 12px;
  margin-top: 6px;
  margin-left: 4px;
}

.comicLastUpdate {
  font-size: 12px;
}

.comicDescription {
  margin: 4px;
}

.chapterList {
  margin-top: 6px;
  margin-bottom: 42px;
}
</style>
