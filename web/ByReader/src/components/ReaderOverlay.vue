<template>
  <div class="status">
    <span>{{ chapterItem.name }} | {{ chapterIndex + 1 }}/{{ chapterNum }} | {{ imageIndex + 1 }}/{{ imageNum }}</span>
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
    chapterItem() {
      return this.chapterList[this.chapterIndex] || {}
    },
    chapterNum() {
      return this.chapterList.length
    },
    imageNum() {
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
@supports(padding: max(0px)) {
  .status {
    top: max(0, env(safe-area-inset-top));
  }
}
.status {
  position: relative;
  display: inline-block;
  top: env(safe-area-inset-top);
  /* top: 16px;
  left: 16px; */
  /* margin-left: 0px; */
  padding: 0 8px;
  /* width: 160px; */
  /* height: 30px; */
  /* display: flex;
  flex-direction: column;
  align-items: flex-start; */
  color: white;
  background-color: black;
  font-size: small;
  line-height: 30px;
  z-index: 2001;
}
</style>
