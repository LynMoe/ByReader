import { store } from './store'

export function getImageLink(url) {
  
  return store.apiBase + '/comic/image?url=' + encodeURIComponent(url) + '&combinedId=' + store.user.combinedId
}
