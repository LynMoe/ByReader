<template>
  <ion-modal ref="modal" :is-open="isOpen" :initial-breakpoint="0.55" :breakpoints="[0, 0.5, 1]">
    <ion-content class="ion-padding">
      <!-- <ion-searchbar @click="$refs.modal.$el.setCurrentBreakpoint(0.75)" placeholder="Search"></ion-searchbar> -->
      <ion-list>
        <ion-item v-for="(item, index) in chapterList" :key="index" @click="setChapterIndex(index)" :disabled="index === chapterIndex" button>
          <ion-label>
            <h2>{{ item.name }}</h2>
            <p>{{ item.id }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import { IonLabel, IonItem, IonModal, IonContent, IonList } from '@ionic/vue'
import { defineComponent } from 'vue'

export default defineComponent({
  props: [
    'isOpen',
    'chapterList',
    'chapterIndex',
  ],
  emits: [
    'update:isOpen',
    'update:chapterIndex',
  ],
  components: {
    IonModal,
    IonContent,
    IonLabel,
    IonItem,
    IonList,
    // IonIcon,
  },
  methods: {
    setOpen(isOpen: boolean) {
      this.$emit('update:isOpen', isOpen)
    },
    setChapterIndex(chapterIndex: number) {
      console.log('setChapterIndex', chapterIndex)
      this.$emit('update:chapterIndex', chapterIndex)
      this.setOpen(false)
    },
  },
})
</script>

<style scoped></style>
