import axios from 'axios'
// import { useIonRouter } from '@ionic/vue'
import { store } from '@/util/store'

// const router = useIonRouter()

export const fetch = async (url: string, options?: object) => {
  url = store.apiBase + url
  options = {
    headers: {
      'x-combined-id': store.user.combinedId,
    },
    ...options,
  }
  const response = await axios(url, options)
  const data = response.data

  console.log(url, data)

  return data
}
