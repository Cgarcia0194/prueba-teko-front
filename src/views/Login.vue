<template>
  <v-container class="mt-15">
    <v-row>
      <v-col xl="6" md="6" sm="12" offset-md="3" offset-sm="3">
        <v-card class="mx-auto" outlined :dark="APP_DARK_MODE">
          <v-card-text>
            <v-form ref="form">
              <v-row>
                <v-col
                  xl="4"
                  md="4"
                  sm="12"
                  offset-md="4"
                  offset-sm="4"
                  class="text-center"
                >
                  <v-img
                    lazy-src="@/assets/images/logo/logo.png"
                    src="@/assets/images/logo/logo.png"
                  />
                </v-col>
              </v-row>

              <v-text-field
                v-model="model.email"
                label="Nombre de usuario"
                :rules="[rules.required]"
                hint="Este campo es necesario"
                v-bind="APP_INPUT_ATTRS"
              />

              <v-text-field
                v-model="model.password"
                :append-icon="mostrar_contrasenia ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required]"
                :type="mostrar_contrasenia ? 'text' : 'password'"
                label="Contraseña"
                hint="Este campo es necesario"
                @click:append="mostrar_contrasenia = !mostrar_contrasenia"
                v-bind="APP_INPUT_ATTRS"
              />

              <v-row>
                <v-col xl="12" class="text-right">
                  <v-btn
                    :color="APP_COLOR"
                    class="mt-5 white--text"
                    @click="acceder"
                    :disabled="!valid"
                  >
                    Acceder
                  </v-btn>
                </v-col>
              </v-row>

              <p class="mt-15 d-block text-center w-100">
                Blvd. Universidad Tecnológica #225 Col. San Carlos CP. 37670
                León, Gto. Mex. l Tel (477) 7 10 00 20
              </p>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import auth from "@/helpers/auth";
import Swal from "sweetalert2";
import { requests } from "@/helpers/requests";
import {
  APP_COLOR,
  APP_COLOR_TEXT,
  APP_DARK_MODE,
  APP_INPUT_ATTRS,
  APP_NAME,
} from "@/helpers/theme";

const { login } = auth();
const { send } = requests();

export default {
  name: "Login",
  components: {},
  data: () => ({
    APP_NAME: APP_NAME,
    APP_COLOR: APP_COLOR,
    APP_COLOR_TEXT: APP_COLOR_TEXT,
    APP_DARK_MODE: APP_DARK_MODE,
    APP_INPUT_ATTRS: APP_INPUT_ATTRS,
    mostrar_contrasenia: false,
    xhr: {
      controller: "auth/login",
    },
    rules: {
      required: (value) => !!value || "Este campo es necesario.",
    },
    model: {
      email: "",
      password: "",
    },
  }),
  computed: {
    valid() {
      return this.model.email.length > 0 && this.model.password.length > 0;
    },
  },
  created() {
    document.title = this.APP_NAME;
  },
  methods: {
    async acceder() {
      let { data } = await send(this.xhr.controller, this.model);

      if (data === null) {
        this.mostrarMensajeErrorServidor();
      } else {
        switch (data.status) {
          case "success":
            login(data.data.access_token, data.data.user);

            this.$router.go();
            break;
          case "error":
            Swal.fire(
              data.message.title,
              data.message.content,
              data.message.type
            );
            break;
          default:
            Swal.fire(
              data.message.title,
              data.message.content,
              data.message.type
            );
            break;
        }
      }
    },
    mostrarMensajeErrorServidor() {
      Swal.fire(
        "Error",
        "Ocurrió un error al conectarse con el servidor",
        "error"
      );
    },
  },
};
</script>