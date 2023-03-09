<template>
  <Waterfall :list="itemList" :width="width" imgSelector="cover" :delay="150" :breakpoints="breakpoint">
    <template #item="{ item }">
      <ion-card @click="onComicClick(item)">
        <LazyImg alt="{{ item.name }}" :url="getImageLink(item.cover)" />
        <ion-card-header>
          <ion-card-title>{{ item.name }}</ion-card-title>
          <ion-card-subtitle v-if="item.alias.length !== 0">{{ item.alias.join(', ') }}</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content v-if="item.description">
          {{ item.description.length > 20 ? item.description.slice(0, 20) + '...' : item.description }}
        </ion-card-content>
      </ion-card>
    </template>
  </Waterfall>
  <!-- <div class="loading">
    <ion-spinner name="crescent" />
  </div> -->
</template>

<script lang="ts">
import { IonCard, IonCardHeader, IonCardContent, IonCardTitle, IonCardSubtitle } from '@ionic/vue'
import { defineComponent } from 'vue'

import { fetch } from '@/util/fetch'
import { store, state } from '@/util/store'

import { useIonRouter } from '@ionic/vue'

import { getImageLink } from '@/util/image'

import { LazyImg, Waterfall } from 'vue-waterfall-plugin-next'
import 'vue-waterfall-plugin-next/dist/style.css'

export default defineComponent({
  name: 'LibraryPage',
  setup() {
    return {
      getImageLink,
    }
  },
  props: [
    'itemList',
  ],
  components: {
    IonCard,
    IonCardHeader,
    IonCardContent,
    IonCardTitle,
    IonCardSubtitle,
    Waterfall,
    LazyImg,
  },
  computed: {
    breakpoint() {
      return store.breakpoint
    },
  },
  data: () => ({
    width: 200,
    isOpen: false,
    comic: {},
  }),
  methods: {
    onComicClick(item) {
      console.log(item)
      state.comicList[item.id] = item

      this.$router.push({
        name: 'ComicPage',
        params: {
          comicId: item.id,
        },
      })
    },
  },
  mounted: function () {
    const router = useIonRouter()
    // this.getData()
  },
})
</script>

<style scoped>
ion-card {
  margin: 8px 10px;
}

ion-card img {
  width: 100%;
}

ion-card-header {
  padding: 8px;
  padding-bottom: 0;
}

ion-card-title {
  font-size: 18px;
}

ion-card-content {
  padding: 8px;
  font-size: 14px;
}
</style>
