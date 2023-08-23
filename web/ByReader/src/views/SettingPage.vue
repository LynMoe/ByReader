<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Setting</ion-title>
        <!-- <ion-buttons slot="end">
          <ion-button>Download</ion-button>
        </ion-buttons> -->
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <SettingList />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton } from '@ionic/vue'

import { defineComponent } from 'vue'

import SettingList from '@/components/SettingList.vue'

export default defineComponent({
  name: 'SettingPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    SettingList,
    IonBackButton,
    IonButtons,
  },
})
</script>
