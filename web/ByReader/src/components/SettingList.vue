<template>
  <ion-list v-for="group in settingList" :key="group.name" :value="group.name">
    <ion-list-header>
      <ion-label>{{ group.name }}</ion-label>
    </ion-list-header>
    <ion-item v-for="item in group.child" :key="item.name" :detail="false">
      <ion-input v-if="item.type === 'input'" :label="item.name" :value="getSettingValue(item.key)"
        @ion-input="event => onValueChange(event, item.key)" />
      <ion-select v-else-if="item.type === 'select'" :label="item.name" @ion-change="event => onValueChange(event, item.key)" :value="getSettingValue(item.key)">
        <ion-select-option v-for="option in item.options" :key="option.value" :value="option.value">
          {{ option.name }}
        </ion-select-option>
      </ion-select>
    </ion-item>
  </ion-list>
</template>

<script lang="ts">
import { IonLabel, IonItem, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonListHeader, IonInput, IonList, IonSelect, IonSelectOption } from '@ionic/vue'
import { defineComponent } from 'vue'

import { bookmarkOutline, bookOutline } from 'ionicons/icons';

import { store } from '@/util/store'

export default defineComponent({
  components: {
    IonItem,
    IonLabel,
    // IonIcon,
    IonListHeader,
    // IonCardSubtitle,
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
        name: 'Comic',
        icon: bookmarkOutline,
        child: [
          {
            name: 'Sort',
            type: 'select',
            key: 'setting.comic.sort',
            options: [
              {
                name: 'Ascending',
                value: 'asc',
              },
              {
                name: 'Descending',
                value: 'desc',
              },
            ],
          },
        ],
      },
      {
        name: 'Reader',
        icon: bookOutline,
        child: [
          {
            name: 'Direction',
            type: 'select',
            key: 'setting.reader.direction',
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
          },
          {
            name: 'Zoom level',
            type: 'input',
            key: 'setting.reader.zoomLevel',
          },
          {
            name: 'Spacing',
            type: 'input',
            key: 'setting.reader.spacing',
          }
        ],
      }
    ],
  }),
  methods: {
    deepAccess(obj, path) {
      path = path.split('.');
      for (let i = 0; i < path.length; i++) {
        if (!Object.prototype.hasOwnProperty.call(obj, path[i])) {
          return undefined;
        }
        obj = obj[path[i]];
      }
      return obj
    },

    deepSet(obj, path, value) {
      path = path.split('.');
      for (let i = 0; i < path.length - 1; i++) {
        if (!Object.prototype.hasOwnProperty.call(obj, path[i])) {
          console.error('Invalid path: ' + path.join('.'))
          return
        }
        obj = obj[path[i]]
      }
      obj[path[path.length - 1]] = value
    },

    getSettingValue(key) {
      console.log(key, this.deepAccess(store, key))
      return this.deepAccess(store, key)
    },

    onValueChange(event, key) {
      const value = event.detail.value
      console.log(key, value)
      this.deepSet(store, key, value)
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