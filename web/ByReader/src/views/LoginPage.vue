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
            <ion-label position="floating">Username</ion-label>
            <ion-input type="text" v-model="username"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating">Password</ion-label>
            <ion-input type="password" v-model="password"></ion-input>
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

import { store, state } from '@/util/store'

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
    username: '',
    password: '',
  }),
  methods: {
    login() {
      console.log(this.email, this.passcode)
      fetch('/user/login', {
        method: 'POST',
        data: {
          username: this.username,
          password: this.password
        },
      }).then(res => {
        console.log(res)
        if (res && res.result && res.result.length === 32) {
          store.user.token = res.result
          store.user.username = this.username

          toastController.create({
            message: 'Login success!',
            duration: 1500,
            position: 'bottom'
          }).then(toast => {
            toast.present()
          })

          state.isLogin = true
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
