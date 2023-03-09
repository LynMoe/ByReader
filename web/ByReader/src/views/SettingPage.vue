<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Setting</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Setting</ion-title>
        </ion-toolbar>
      </ion-header>

      <SettingList />
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue'

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
  },
})
</script>
