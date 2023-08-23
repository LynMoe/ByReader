import { store } from './store'

export function getImageLink(url) {
  
  return '/api/comic/image?url=' + encodeURIComponent(url) + '&token=' + store.user.token
}
