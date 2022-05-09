<template>
  <v-card>
    <v-app-bar
      :color="APP_COLOR"
      :dark="APP_DARK_MODE"
      app
      style="position: fixed !important"
    >
      <v-app-bar-nav-icon
        v-if="APP_FULL_NAVIGATION"
        @click.stop="drawer = !drawer"
        class="white--text"
      ></v-app-bar-nav-icon>

      <v-app-bar-title
        ><router-link to="/inicio" class="white--text">{{
          APP_NAME
        }}</router-link></v-app-bar-title
      >

      <v-spacer></v-spacer>
      <v-spacer></v-spacer>

      <v-autocomplete
        v-model="txtBuscador"
        :items="items"
        filled
        class="mx-4 float-right d-none d-md-block"
        flat
        hide-details
        hide-no-data
        cache-items
        label="Buscar"
        prepend-inner-icon="mdi-magnify"
        append-icon="mic"
        solo-inverted
        style="max-width: 600px"
        item-text="name"
        item-value="name"
        dark
      >
        <template v-slot:selection="data">
          <v-chip
            :light="!APP_DARK_MODE"
            :dark="APP_DARK_MODE"
            :input-value="data.selected"
          >
            <v-avatar left :color="APP_COLOR">
              <v-icon small dark>
                {{ data.item.icono }}
              </v-icon>
            </v-avatar>
            {{ data.item.name }}
          </v-chip>
        </template>
        <template v-slot:item="data">
          <template v-if="typeof data.item !== 'object'">
            <v-list-item-content v-text="data.item"></v-list-item-content>
          </template>
          <template v-else>
            <v-list-item-avatar
              :color="APP_COLOR"
              v-on:click="seleccionar(data.item)"
            >
              <v-icon dark class="white--text">
                {{ data.item.icono }}
              </v-icon>
            </v-list-item-avatar>
            <v-list-item-content v-on:click="seleccionar(data.item)">
              <v-list-item-title v-html="data.item.name"></v-list-item-title>
              <v-list-item-subtitle
                v-html="data.item.tipo_plantilla"
              ></v-list-item-subtitle>
            </v-list-item-content>
          </template>
        </template>
      </v-autocomplete>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      :mini-variant="mini"
      :expand-on-hover="!APP_FULL_NAVIGATION"
      :dark="APP_DARK_MODE"
      :permanent="!APP_FULL_NAVIGATION"
      :absolute="APP_FULL_NAVIGATION"
      bottom
      :temporary="APP_FULL_NAVIGATION"
    >
      <v-list>
        <v-list-item class="px-2">
          <v-list-item-avatar :color="APP_COLOR">
            <v-img
              v-if="usuario.f_perfil.id_archivo != false"
              :src="usuario.f_perfil.url"
            ></v-img>
            <span v-else class="white--text text-h5">
              {{
                String(usuario.name.slice(0, 1)).toUpperCase() +
                String(usuario.lastname.slice(0, 1)).toUpperCase()
              }}
            </span>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title
              >{{ usuario.name }} {{ usuario.lastname }}</v-list-item-title
            ><br />
            <v-list-item-subtitle> {{ usuario.email }} </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-list nav dense rounded>
        <Item
          v-for="nivel0 in even(data)"
          :key="nivel0._id"
          :node="nivel0"
          :isSub="false"
        />
      </v-list>

      <template v-slot:append>
        <v-list nav dense rounded>
          <v-list-item-group :active-class="APP_COLOR_TEXT">
            <v-list-item link @click="salir">
              <v-list-item-icon>
                <v-icon>mdi-export</v-icon>
              </v-list-item-icon>
              <v-list-item-title> Cerrar sesión </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </template>
    </v-navigation-drawer>
  </v-card>
</template>

<script>
import auth from "@/helpers/auth";
import { requests } from "@/helpers/requests";
import Item from "@/components/Item.vue";
import {
  APP_NAME,
  APP_COLOR,
  APP_COLOR_TEXT,
  APP_DARK_MODE,
  APP_FULL_NAVIGATION,
} from "@/helpers/theme";
import Swal from "sweetalert2";

const { state, logout } = auth();
const { send } = requests();

export default {
  name: "Header",
  components: { Item },
  data: () => ({
    APP_NAME: APP_NAME,
    APP_COLOR: APP_COLOR,
    APP_COLOR_TEXT: APP_COLOR_TEXT,
    APP_DARK_MODE: APP_DARK_MODE,
    APP_FULL_NAVIGATION: APP_FULL_NAVIGATION,
    drawer: false,
    mini: true,
    group: null,
    usuario: state.user,
    data: [],
    txtBuscador: null,
    items: [],
  }),
  created() {
    this.consultar();

    document.title = this.APP_NAME;

    if (this.isMobile()) {
      this.APP_FULL_NAVIGATION = !this.isMobile();
    }

    this.mini = !this.APP_FULL_NAVIGATION;
  },
  methods: {
    even: function (arr) {
      // Set slice() to avoid to generate an infinite loop!
      return arr.slice().sort(function (a, b) {
        return a.orden - b.orden;
      });
    },
    salir() {
      logout();

      this.$router.go();
    },
    async consultar() {
      let { data } = await send("general/consultar-plantillas");

      switch (data.status) {
        case "success":
          this.data = data.data;
          this.items = data.items;
          break;
        case "session":
          Swal.fire({
            title: data.message.title,
            text: data.message.content,
            icon: data.message.type,
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Acceder nuevamente",
            preConfirm: () => {
              return true;
            },
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              this.salir();
            }
          });
          break;
        default:
          break;
      }
    },
    seleccionar(item) {
      this.$router.push(item.path);
    },
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },
  },
};
</script>