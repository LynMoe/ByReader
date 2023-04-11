import { reactive, watch } from 'vue'

export const store = reactive({
  apiBase: 'http://127.0.0.1:3000',
  libraryItems: [],
  historyIds: [],
  historyItems: [],
  site: [],
  bookshelfList: {},
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
          [0.7, 0, 1, 1],
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
    combinedId: '',
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
  isLogin: null,
})

const localStore = localStorage && localStorage.getItem('store')
if (localStore) {
  Object.assign(store, JSON.parse(localStore))
} else {
  localStorage.setItem('store', JSON.stringify(store))
}
