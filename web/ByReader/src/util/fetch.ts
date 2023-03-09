import axios from 'axios'
// import { useIonRouter } from '@ionic/vue'
import { store } from '@/util/store'

// const router = useIonRouter()

export const fetch = async (url: string, options?: object) => {
  url = store.apiBase + url
  options = {
    headers: {
      'x-combined-id': '1724a0158844d096390f0d30cc49811494de6d65e2922e140cd2e05f01e4dc22',
    },
    ...options,
  }
  const response = await axios(url, options)

  const data = response.data
  // if (data.code === 401) {
  //   router.push('/login')
  // }

  return data
}
