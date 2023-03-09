<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Login</ion-title>
        </ion-toolbar>
      </ion-header>

      <div class="loginForm">
        <ion-list>
          <ion-item>
            <ion-label position="floating">Email</ion-label>
            <ion-input type="email" v-model="email"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Passcode</ion-label>
            <ion-input type="password" v-model="passcode"></ion-input>
          </ion-item>
        </ion-list>
        <ion-button expand="block" @click="login">Login</ion-button>
      </div>
      
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonLabel, toastController } from '@ionic/vue'

import { defineComponent } from 'vue'

import { store } from '@/util/store'

import { fetch } from '@/util/fetch'

export default defineComponent({
  name: 'LibraryPage',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonInput,
    IonItem,
    IonLabel,
  },
  data: () => ({
    email: '',
    passcode: '',
  }),
  methods: {
    login() {
      console.log(this.email, this.passcode)
      fetch('/user/getCombinedId', {
        method: 'POST',
        data: {
          email: this.email,
          passcode: this.passcode
        },
      }).then(res => {
        console.log(res)
        if (res && res.result && res.result.length === 64) {
          store.user.combindedId = res.result
          store.user.email = this.email

          toastController.create({
            message: 'Login success!',
            duration: 1500,
            position: 'bottom'
          }).then(toast => {
            toast.present()
          })

          this.$router.push('/library')
        } else {
          toastController.create({
            message: `Login failed: ${res.message}`,
            duration: 1500,
            position: 'bottom'
          }).then(toast => {
            toast.present()
          })
        }
      })
    }
  }
})
</script>

<style scoped>
.loginForm {
  margin: 0 16px;
}

.loginForm ion-button {
  margin-top: 24px;
}
</style>
