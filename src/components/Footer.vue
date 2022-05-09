<template>
  <v-footer app :dark="APP_DARK_MODE">
    <p class="d-block text-center w-100">
      FOOTER PRUEBA ----
    </p>
  </v-footer>
</template>

<script>
import { APP_DARK_MODE } from "@/helpers/theme";

export default {
  name: "Footer",
  components: {},
  data: () => ({
    APP_DARK_MODE: APP_DARK_MODE,
    year: new Date().getFullYear(),
  }),
};
</script>

<style scoped>
.w-100 {
  width: 100%;
}
</style>