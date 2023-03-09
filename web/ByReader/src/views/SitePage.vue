<template>
  <ion-page ref="page">
    <ion-header>
      <ion-toolbar>
        <ion-title>Site</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Site</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="warpper">
        <SiteList @on-setting-site="onSettingSite" />
      </div>
      
    </ion-content>
    <SiteSetting :siteId="settingSiteId" v-model:is-open="isOpen" />
  </ion-page>
</template>

<script lang="ts">
import { IonButton, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue'
import { defineComponent, ref } from 'vue'

import SiteSetting from './SiteSetting.vue'
import SiteList from '@/components/SiteList.vue'

export default defineComponent({
  name: 'SitePage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    // IonButton,
    SiteList,
},
  data: () => ({
    settingSiteId: '',
    isOpen: false,
  }),
  methods: {
    segmentChanged(event) {
      console.log(event.detail.value)
      this.segmentValue = event.detail.value
    },
    onSettingSite(item) {
      this.settingSiteId = item.id
      this.isOpen = true
    },
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
