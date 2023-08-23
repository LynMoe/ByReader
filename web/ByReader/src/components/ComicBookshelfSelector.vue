<template>
  <ion-modal ref="modal" :is-open="isOpen" :initial-breakpoint="0.5" :breakpoints="[0, 0.5, 1]">
    <ion-content class="ion-padding">
      <!-- <ion-searchbar @click="$refs.modal.$el.setCurrentBreakpoint(0.75)" placeholder="Search"></ion-searchbar> -->
      <ion-list>
        <ion-item v-for="(item, index) in bookshelfList" :key="index">
          <ion-label>{{ index }}</ion-label>
          <ion-toggle :checked="inBookshelfList.includes(index)" @ionChange="toggleInBookshelf(index)" slot="end"></ion-toggle>
        </ion-item>
        <ion-item>
          <ion-input placeholder="New bookshelf" @ionChange="i => this.newBookshelfValue = i.target.value"></ion-input>
          <ion-button slot="end" @click="onNewBookshelf">
            <ion-icon :icon="addCircleOutline" slot="end"></ion-icon>
            Add
          </ion-button>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script lang="ts">
import { IonLabel, IonItem, IonModal, IonContent, IonList, IonToggle, IonInput, IonButton, IonIcon } from '@ionic/vue'
import { addCircleOutline } from 'ionicons/icons'
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
    'toggleBookshelf',
  ],
  setup() {
    return {
      addCircleOutline,
    }
  },
  components: {
    IonModal,
    IonContent,
    IonLabel,
    IonItem,
    IonList,
    IonToggle,
    IonInput,
    IonButton,
    IonIcon,
  },
  data: () => ({
    newBookshelfValue: '',
  }),
  methods: {
    setOpen(isOpen: boolean) {
      // this.$emit('update:isOpen', !isOpen)
      this.$nextTick(() => {
        this.$emit('update:isOpen', isOpen)
      })
    },
    toggleInBookshelf(bsName) {
      this.$emit('toggleBookshelf', [bsName, !this.inBookshelfList.includes(bsName)])
    },
    onNewBookshelf(e) {
      console.log(e)
      this.toggleInBookshelf(this.newBookshelfValue)
      this.setOpen(false)
    },
  },
})
</script>

<style scoped></style>
