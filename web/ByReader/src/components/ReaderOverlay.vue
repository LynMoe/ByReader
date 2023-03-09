<template>
  <div class="readerOverlay">
    <div class="status">
      <span>{{ chapterItem.name }} | {{ chapterIndex + 1 }}/{{ chapterNum }} | {{ imageIndex + 1 }}/{{ imageNum }}</span>
    </div>
  </div>
</template>

<script lang="ts">

import { defineComponent } from 'vue'

import { store, state } from '@/util/store'

export default defineComponent({
  name: 'ReaderOverlay',
  props: [
    'chapterIndex',
    'chapterList',
    'imageIndex',
    'chapterListImageList',
  ],
  computed: {
    chapterItem () {
      return this.chapterList[this.chapterIndex] || {}
    },
    chapterNum () {
      return this.chapterList.length
    },
    imageNum () {
      if (!this.chapterListImageList[this.chapterItem.id]) return 0
      return this.chapterListImageList[this.chapterItem.id].length
    },
  },
  data: () => {
    return {

    }
  },
  methods: {

  },
})

</script>

<style scoped>
.readerOverlay {
  position: fixed;
  height: 100vh;
  width: 100vw;
  z-index: 999;
  
  /* background: rgba(0, 0, 0, 0.3); */
  pointer-events: none;
}

.status {
  position: absolute;
  top: 0;
  left: 0;
  width: 160px;
  height: 30px;
  display: flex;
  flex-direction: column;
  align-items: left;
  color: white;
  background-color: black;
  font-size: small;
  line-height: 30px;
}
</style>
