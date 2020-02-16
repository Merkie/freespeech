<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <h2>Freespeech</h2>
      </div>

      <v-spacer />
      
      <v-btn
        icon
        to="/"
      >
        <v-icon>
          home
        </v-icon>
      </v-btn>      
      <v-btn
        icon
        to="/about"
      >
        <v-icon>
          info
        </v-icon>
      </v-btn>      

      <v-btn
        icon
        @click="toggleSettingsDialogVisibility"
      >
        <v-icon>
          settings
        </v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view />
      <Settings />
    </v-content>
  </v-app>
</template>

<script>
import Settings from "@/views/Settings"
import {mapActions} from 'vuex'

export default {
    name: 'App',
    components:{
      Settings
    },
    data: () => ({
    //
    }),
    methods: {
      ...mapActions(['toggleSettingsDialogVisibility'])
    },
};
</script>
