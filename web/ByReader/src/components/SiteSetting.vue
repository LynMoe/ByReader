<template>
  <ion-modal :is-open="isOpen">
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings for {{ siteId }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="onClose">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p>Nothing is here by the time</p>
      <!-- <ion-list>
        <ion-item>
          <ion-label>Default Input</ion-label>
          <ion-input placeholder="Enter text"></ion-input>
        </ion-item>
      </ion-list> -->
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import {
  IonButtons,
  IonButton,
  IonModal,
  IonHeader,
  IonContent,
  IonToolbar,
  IonTitle,
} from '@ionic/vue'
import { defineComponent } from 'vue'

export default defineComponent({
  props: [
    'isOpen',
    'siteId',
    'presentingElement'
  ],
  emits: [
    'update:isOpen',
  ],
  components: {
    IonButtons,
    IonButton,
    IonModal,
    IonHeader,
    IonContent,
    IonToolbar,
    IonTitle,
  },
  data() {
    return {

    }
  },
  methods: {
    onClose() {
      this.$emit('update:isOpen', false)
    },
  },
})
</script>