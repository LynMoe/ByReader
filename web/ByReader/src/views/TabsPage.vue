<template>
  <ion-page>
    <!-- <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar v-if="!$route.path.startsWith('/reader')" slot="bottom">
        <ion-tab-button tab="tab1" href="/library">
          <ion-icon aria-hidden="true" :icon="libraryOutline" />
          <ion-label>Library</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/site">
          <ion-icon aria-hidden="true" :icon="fileTrayFullOutline" />
          <ion-label>Site</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/setting">
          <ion-icon aria-hidden="true" :icon="settingsOutline" />
          <ion-label>Setting</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs> -->
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet } from '@ionic/vue'
import { libraryOutline, settingsOutline, fileTrayFullOutline } from 'ionicons/icons'
</script>

<style scoped>
ion-icon {
  font-size: 28px;
}
</style>
