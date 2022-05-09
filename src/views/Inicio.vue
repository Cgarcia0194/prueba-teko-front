<template>
  <AppView>
    <v-card outlined :dark="APP_DARK_MODE">
      <v-card-title> ¡Bienvenido al sistema {{ APP_NAME }}!</v-card-title>
    </v-card>
  </AppView>
</template>

<script>
import AppView from "@/components/AppView.vue";
import auth from "@/helpers/auth";
import {
  APP_NAME,
  APP_COLOR,
  APP_COLOR_TEXT,
  APP_DARK_MODE,
} from "@/helpers/theme";

const { state } = auth();

export default {
  name: "Inicio",
  components: { AppView},
  data: () => ({
    APP_NAME: APP_NAME,
    APP_COLOR: APP_COLOR,
    APP_COLOR_TEXT: APP_COLOR_TEXT,
    APP_DARK_MODE: APP_DARK_MODE,
    usuario: state.user,
  }),
  created() {
  },
  methods: {

  },
};
</script>
