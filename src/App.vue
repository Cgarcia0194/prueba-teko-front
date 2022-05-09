<template>
  <v-app
    :style="APP_DARK_MODE ? 'background: #363636' : 'background: #f5f5f5'"
  >
    <Header v-if="usuario != null" />
    <v-main>
      <v-container fluid v-if="usuario != null" class="pb-0">
        <v-list
          subheader
          two-line
          :dark="APP_DARK_MODE"
          :style="
            APP_DARK_MODE ? 'background: #363636' : 'background: #f5f5f5'
          "
        >
          <template>
            <v-list-item>
              <v-list-item-avatar :color="APP_COLOR">
                <v-img
                  v-if="usuario.f_perfil.id_archivo != false"
                  :src="usuario.f_perfil.url"
                />
                <span v-else class="white--text text-h5">
                  {{
                    String(usuario.name.slice(0, 1)).toUpperCase() +
                    String(usuario.lastname.slice(0, 1)).toUpperCase()
                  }}
                </span>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>
                  {{ usuario.name }} {{ usuario.lastname }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ usuario.email }}
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-container>

      <router-view />
    </v-main>
    <Footer v-if="usuario != null" />
  </v-app>
</template>

<script>
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import auth from "@/helpers/auth";
import {
  APP_NAME,
  APP_COLOR,
  APP_COLOR_TEXT,
  APP_DARK_MODE,
} from "@/helpers/theme";

const { state } = auth();

export default {
  name: "Project",
  components: { Footer, Header },
  data: () => ({
    APP_NAME: APP_NAME,
    APP_COLOR: APP_COLOR,
    APP_COLOR_TEXT: APP_COLOR_TEXT,
    APP_DARK_MODE: APP_DARK_MODE,
    usuario: state.user,
  }),
  created() {},
};
</script>