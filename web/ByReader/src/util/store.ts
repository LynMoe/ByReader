import { reactive, watch } from 'vue'

export const store = reactive({
  apiBase: '/api/',
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
      direction: 'ltr', // rtl, ltr, vertical
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
      zoomLevel: "1.2",
    },
  },
  user: {
    username: '',
    token: '',
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
    comic: {
      id: null,
      name: null,
      cover: null,
      description: null,
    },
    chapterList: [],
    chapterIndex: 0,
    hasRead: {},
  },
  comicList: {},
  isLogin: null,
})

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item))
}
function deepAssign(target, ...sources) {
  sources.forEach(source => {
      for (const key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
              if (isObject(source[key])) {
                  if (!target[key]) Object.assign(target, { [key]: {} })
                  deepAssign(target[key], source[key])
              } else {
                  Object.assign(target, { [key]: source[key] })
              }
          }
      }
  });

  return target
}

const localStore = localStorage && localStorage.getItem('store')
if (localStore) {
  deepAssign(store, JSON.parse(localStore))
  localStorage.setItem('store', JSON.stringify(store))
} else {
  localStorage.setItem('store', JSON.stringify(store))
}
