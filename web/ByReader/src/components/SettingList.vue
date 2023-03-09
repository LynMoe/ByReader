<template>
  <ion-card v-for="group in settingList" :key="group.name" :value="group.name">
    <ion-card-header>
      <ion-card-title>{{ group.name }}</ion-card-title>
      <ion-card-subtitle>{{ group.description }}</ion-card-subtitle>
    </ion-card-header>
    <ion-card-content>
      <ion-list>
        <ion-item v-for="item in group.child" :key="item.name" :detail="false">
          <ion-label>
            <h2>{{ item.name }}</h2>
            <p v-if="item.description">{{ item.description }}</p>
          </ion-label>
          <ion-input v-if="item.type === 'input'" :value="getSettingValue(item.key)"
            @ion-change="event => onValueChange(event, item.key)" />
          <ion-select v-if="item.type === 'select'" :value="item.value">
            <ion-select-option v-for="option in item.options" :key="option.value" :value="option.value">{{ option.name
            }}</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>
    </ion-card-content>
  </ion-card>
</template>

<script lang="ts">
import { IonLabel, IonItem, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle, IonInput, IonList, IonSelect, IonSelectOption } from '@ionic/vue'
import { defineComponent, reactive } from 'vue'

import { bookOutline, planetOutline } from 'ionicons/icons';

import { store } from '@/util/store'

export default defineComponent({
  components: {
    IonItem,
    IonLabel,
    // IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonInput,
    IonList,
    IonSelect,
    IonSelectOption,
  },
  computed: {
  },
  data: () => ({
    settingList: [
      {
        name: 'General',
        description: 'General settings',
        icon: planetOutline,
        child: [
          {
            name: 'API URL',
            description: '',
            type: 'input',
            key: 'apiBase',
          }
        ],
      },
      {
        name: 'Reader',
        description: 'Reader settings',
        icon: bookOutline,
        child: [
          {
            name: 'Mode',
            description: 'Reader mode',
            type: 'select',
            options: [
              {
                name: 'Vertical',
                value: 'vertical',
              },
              {
                name: 'Horizontal',
                value: 'horizontal',
              },
            ],
          },
          {
            name: 'Direction',
            description: 'Reader direction',
            type: 'select',
            options: [
              {
                name: 'Left to right',
                value: 'ltr',
              },
              {
                name: 'Right to left',
                value: 'rtl',
              },
            ],
          }
        ],
      }
    ],
  }),
  methods: {
    getSettingValue(key) {
      key = key.split('.')
      let value = store
      for (let i = 0; i < key.length; i++) {
        value = value[key[i]]
      }
      return value
    },
    onValueChange(event, key) {
      const value = event.detail.value
      key = key.split('.')
      let obj = store
      for (let i = 0; i < key.length - 1; i++) {
        obj = obj[key[i]]
      }
      console.log(key[key.length - 1], value)
      obj[key[key.length - 1]] = value
    },
  },
  mounted: function () {
    console.log(this.settingList)
  },
})
</script>

<style scoped>
/* iOS places the subtitle above the title */
ion-card-header.ios {
  display: flex;
  flex-flow: column-reverse;
}

ion-thumbnail {
  --border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

ion-thumbnail img {
  width: 50%;
  height: 50%;
}
</style>