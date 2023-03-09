<template>
  <ion-item v-for="item in itemList" :key="item.name">
    <ion-thumbnail slot="start">
      <img :src="item.icon" />
    </ion-thumbnail>
    <ion-label>
      <h3>{{ item.name }}</h3>
      <p>R18!!!</p>
    </ion-label>
    <ion-buttons slot="end" @click="onClickSetting(item)">
      <ion-button size="default">Setting</ion-button>
    </ion-buttons>
    <!-- <ion-button slot="end" fill="outline" shape="round">
      <ion-icon aria-hidden="true" :icon="settingsOutline" slot="icon-only"></ion-icon>
    </ion-button> -->
  </ion-item>
</template>

<script lang="ts">
import { IonLabel, IonItem, IonThumbnail, IonIcon, IonButtons, IonButton } from '@ionic/vue'
import { defineComponent } from 'vue'


import { settingsOutline } from 'ionicons/icons'

import { fetch } from '@/util/fetch'

import { store } from '@/util/store'

export default defineComponent({
  setup() {
    return {
      settingsOutline,
    }
  },
  emits: ['onSettingSite'],
  components: {
    // Waterfall,
    IonItem,
    IonThumbnail,
    IonLabel,
    // IonIcon,
    IonButtons,
    IonButton,
    // settingsOutline,
  },
  computed: {
  },
  data: () => ({
    itemList: [],
    breakpoint: {
      580: {
        rowPerView: 1,
      },
      720: {
        rowPerView: 2,
      },
      960: {
        rowPerView: 3,
      },
    },
    width: 580,
  }),
  methods: {
    onClickSetting(item) {
      this.$emit('onSettingSite', item)
    },
  },
  beforeMount() {
    fetch('/comic/site').then((res) => {
        this.itemList = res.result
      })
  },
});
</script>

<style scoped>
/* iOS places the subtitle above the title */
ion-card-header.ios {
  display: flex;
  flex-flow: column-reverse;
}

ion-thumbnail {
  --border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

ion-thumbnail img {
  width: 50%;
  height: 50%;
}
</style>