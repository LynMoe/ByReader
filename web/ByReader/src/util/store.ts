import { reactive, watch } from 'vue'

export const store = reactive({
  apiBase: 'http://127.0.0.1:3000',
  libraryItems: [],
  historyIds: [],
  historyItems: [],
  site: [],
  setting: {
    comic: {
      sort: 'asc',
    },
    reader: {
      mode: 'vertical',
      touchZone: {
        left: [
          [0, 0, 0.2, 1],
          [0, 0, 0.8, 0.2],
        ],
        right: [
          [0.8, 0, 1, 1],
          [0.2, 0.8, 1, 1],
        ],
        middle: [
          [0.2, 0.2, 0.8, 0.8],
        ],
      },
    },
  },
  user: {
    email: '',
    combindedId: '',
  },
  breakpoint: {
    320: {
      rowPerView: 1,
    },
    480: {
      rowPerView: 2,
    },
    640: {
      rowPerView: 3,
    },
    800: {
      rowPerView: 4,
    },
  },

})

export const state = reactive({
  reader: {
    comic: {},
    chapterList: [],
    chapterIndex: 0,
  },
  comicList: {},
})
