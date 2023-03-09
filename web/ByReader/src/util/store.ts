import { reactive, watch } from 'vue'

export const store = reactive({
  apiBase: 'http://10.37.96.23:3000',
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
          [0, 0, 0.3, 1],
          [0, 0, 0.7, 0.3],
        ],
        right: [
          [0.3, 0, 1, 1],
          [0.3, 0.7, 1, 1],
        ],
        middle: [
          [0.3, 0.3, 0.7, 0.7],
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
