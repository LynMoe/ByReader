<template>
  <ion-modal :is-open="isOpen">
    <ion-header>
      <ion-toolbar>
        <ion-title>Modal</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="onClose">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <p>{{ siteId }}</p>
      <ion-list>
        <ion-item>
          <ion-label>Default Input</ion-label>
          <ion-input placeholder="Enter text"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Default Input</ion-label>
          <ion-input placeholder="Enter text"></ion-input>
        </ion-item>
        <ion-item>
          <ion-label>Select</ion-label>
          <ion-select placeholder="Make a Selection">
            <ion-select-option value="">No Game Console</ion-select-option>
            <ion-select-option value="nes">NES</ion-select-option>
            <ion-select-option value="n64">Nintendo64</ion-select-option>
            <ion-select-option value="ps">PlayStation</ion-select-option>
            <ion-select-option value="genesis">Sega Genesis</ion-select-option>
            <ion-select-option value="saturn">Sega Saturn</ion-select-option>
            <ion-select-option value="snes">SNES</ion-select-option>
          </ion-select>
        </ion-item>

        <ion-item>
          <ion-label>Toggle</ion-label>
          <ion-toggle slot="end"></ion-toggle>
        </ion-item>

        <ion-item>
          <ion-label>Checkbox</ion-label>
          <ion-checkbox slot="end"></ion-checkbox>
        </ion-item>

        <ion-item>
          <ion-label position="stacked">Range</ion-label>
          <ion-range></ion-range>
        </ion-item>
      </ion-list>
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
  IonLabel,
  IonList,
  IonItem,
  IonRange,
  IonCheckbox,
  IonToggle,
  IonSelect,
  IonSelectOption,
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
    IonList,
    IonLabel,
    IonItem,
    IonRange,
    IonCheckbox,
    IonToggle,
    IonSelect,
    IonSelectOption,
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