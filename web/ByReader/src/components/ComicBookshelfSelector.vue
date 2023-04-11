<template>
  <ion-modal ref="modal" :is-open="isOpen" :initial-breakpoint="0.5" :breakpoints="[0, 0.5, 1]">
    <ion-content class="ion-padding">
      <!-- <ion-searchbar @click="$refs.modal.$el.setCurrentBreakpoint(0.75)" placeholder="Search"></ion-searchbar> -->
      <ion-list>
        <ion-item v-for="(item, index) in bookshelfList" :key="index">
          <ion-label>{{ item }}</ion-label>
          <ion-toggle :value="inBookshelfList.includes(item)" @ionChange="toggleInBookshelf(index)" slot="end"></ion-toggle>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import { IonLabel, IonItem, IonModal, IonContent, IonList, IonToggle } from '@ionic/vue'
import { defineComponent } from 'vue'

export default defineComponent({
  props: [
    'isOpen',
    'bookshelfList',
    'inBookshelfList',
  ],
  emits: [
    'update:isOpen',
    'update:inBookshelfList',
  ],
  components: {
    IonModal,
    IonContent,
    IonLabel,
    IonItem,
    IonList,
    IonToggle,
    // IonIcon,
  },
  methods: {
    setOpen(isOpen: boolean) {
      this.$emit('update:isOpen', isOpen)
    },
    toggleInBookshelf(index: number) {
      const bookshelf = this.bookshelfList[index]
      const inBookshelf = this.inBookshelfList.find((item) => item.id === bookshelf.id)
      const list = this.inBookshelfList
      if (inBookshelf) {
        list.splice(this.inBookshelfList.indexOf(inBookshelf), 1)
      } else {
        list.push(bookshelf)
      }
      this.$emit('update:inBookshelfList', list)
    },
  },
})
</script>

<style scoped></style>
