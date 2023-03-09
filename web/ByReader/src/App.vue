<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue'
</script>

<script lang="ts">
import { store, state } from '@/util/store'
import { watch } from 'vue'

export default {
  mounted() {
    console.log('App mounted')
    watch(() => store, (value) => {
      localStorage.setItem('store', JSON.stringify(value))
    }, { deep: true })
  },
}
</script>

