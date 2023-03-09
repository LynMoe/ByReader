<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
</script>

<script lang="ts">
import { store } from '@/util/store'
import { watch } from 'vue'

export default {
  mounted() {
    console.log('App mounted')
    const localStore = localStorage && localStorage.getItem('store')
      if (localStore) {
        Object.assign(store, JSON.parse(localStore))
      } else {
        localStorage.setItem('store', JSON.stringify(store))
      }

      watch(() => store, (value) => {
        localStorage.setItem('store', JSON.stringify(value))
      }, { deep: true })
  },
}
</script>

