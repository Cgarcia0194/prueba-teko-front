<template>
  <v-container fluid>
    <slot></slot>
  </v-container>
</template>

<script>
import auth from "@/helpers/auth";
import { APP_COLOR, APP_COLOR_TEXT } from "@/helpers/theme";

const { state } = auth();

export default {
  name: "AppView",
  components: {},
  data: () => ({
    APP_COLOR: APP_COLOR,
    APP_COLOR_TEXT: APP_COLOR_TEXT,
    usuario: state.user,
  }),
  created() {},
};
</script>