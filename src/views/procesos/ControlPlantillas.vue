<template>
  <AppView>
    <v-card elevation="2" outlined :dark="APP_DARK_MODE">
      <v-card-title> {{ this.$route.name }} </v-card-title>
      <v-card-subtitle>{{
        this.$route.meta.description.replace("_NOMBRE_PERSONA_", usuario.name)
      }}</v-card-subtitle>

      <v-sheet :color="APP_COLOR" class="pa-4">
        <v-text-field
          v-model="search"
          label="Buscar una plantilla..."
          dark
          flat
          solo-inverted
          hide-details
          clearable
          clear-icon="mdi-close-circle-outline"
        />
        <v-checkbox
          v-model="caseSensitive"
          dark
          hide-details
          label="Coincidir con la búsqueda"
        ></v-checkbox>
      </v-sheet>

      <v-card-text>
        <v-treeview
          rounded
          :search="search"
          :filter="filter"
          :items="data"
          item-key="_id"
          hoverable
        >
          <template v-slot:prepend="{ item }">
            <v-icon>
              {{ item.icono }}
            </v-icon>
          </template>

          <template v-slot:append="{ item }">
            <v-btn
              v-if="item.es_menu == 'Si'"
              icon
              @click.prevent="abrirDlgFormulario(item._id)"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>

            <v-btn icon @click="cargarRegistro(item)">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn
              icon
              v-if="item.estatus == 'Activa'"
              @click="desactivar(item._id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>

            <v-btn icon v-else @click="reactivar(item._id)">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>

            <v-btn icon @click="abrirDlgDetalles(item)">
              <v-icon>info</v-icon>
            </v-btn>
          </template>
        </v-treeview>
      </v-card-text>
    </v-card>

    <v-btn
      class="mx-2 btn-floating"
      fab
      :color="APP_COLOR"
      @click="abrirDlgFormulario(0)"
    >
      <v-icon dark class="white--text"> mdi-plus </v-icon>
    </v-btn>

    <v-dialog
      v-model="dlgFormulario"
      max-width="800px"
      persistent
      scrollable
      :dark="APP_DARK_MODE"
    >
      <v-card outlined>
        <v-card-title>
          <span class="text-h5">Formulario de plantillas</span>
        </v-card-title>

        <v-card-text class="pt-5">
          <v-row>
            <v-col cols="12" lg="6" md="6" sm="12" class="pb-0">
              <v-text-field
                v-model="model.name"
                label="Nombre de la plantilla (Name)"
                :rules="[rules.required]"
                v-bind="APP_INPUT_ATTRS"
              />

              <v-text-field
                v-model="model.path"
                label="Nombre de la ruta (Path)"
                :rules="[rules.required]"
                v-bind="APP_INPUT_ATTRS"
              />

              <v-text-field
                v-model="model.component"
                label="Nombre del archivo (Vue - Component: Sin .vue)"
                :rules="[rules.required]"
                v-bind="APP_INPUT_ATTRS"
              />
            </v-col>
            <v-col cols="12" lg="6" md="6" sm="12" class="pb-0">
              <v-text-field
                v-model="model.icono"
                label="Ícono en el menú"
                :rules="[rules.required]"
                :prepend-inner-icon="model.icono"
                append-icon="open_in_new"
                @click:append="
                  abrirEnlace(
                    'https://fonts.google.com/icons?selected=Material+Icons'
                  )
                "
                v-bind="APP_INPUT_ATTRS"
              />

              <v-select
                v-model="selected"
                :items="items"
                item-value="value"
                name="category"
                item-text="option"
                label="Tipo de plantilla"
                v-bind="APP_INPUT_ATTRS"
              />

              <v-text-field
                v-model="model.orden"
                label="Orden de la plantilla"
                :rules="[rules.required]"
                v-bind="APP_INPUT_ATTRS"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              lg="6"
              offset-lg="3"
              md="6"
              offset-md="3"
              sm="12"
              class="pb-0"
            >
              <v-textarea
                v-model="model.descripcion"
                label="Descripción"
                rows="3"
                :rules="[rules.required]"
                v-bind="APP_INPUT_ATTRS"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col lg="4" offset-lg="4" md="5" offset-md="4" sm="12">
              <v-switch
                v-model="model.menu_desplegable"
                label="¿Es menú desplegable?"
                :color="APP_COLOR"
              >
              </v-switch>
              <v-switch
                v-model="model.enlace_externo"
                label="¿Es un enlace externo?"
                :color="APP_COLOR"
              ></v-switch>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="text-right">
          <v-spacer></v-spacer>
          <v-btn text @click="cerrarDlgFormulario()"> Cancelar </v-btn>
          <v-btn
            v-show="btnAgregar"
            :color="APP_COLOR"
            @click="agregar()"
            :disabled="!valid"
            class="white--text"
          >
            Agregar
          </v-btn>
          <v-btn
            v-show="btnModificar"
            :color="APP_COLOR"
            @click="modificar()"
            :disabled="!valid"
            class="white--text"
          >
            Modificar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dlgDetalles" max-width="600px" persistent scrollable>
      <v-card class="mx-auto" outlined :dark="APP_DARK_MODE">
        <v-card-title>
          <v-icon large left>{{ model.icono }}</v-icon>
          <span class="text-h6 font-weight-light">{{ model.name }}</span>
        </v-card-title>

        <v-card-text class="text-h5 font-weight-bold">
          {{ model.descripcion }}
        </v-card-text>

        <v-card-actions>
          <v-list-item class="grow">
            <v-list-item-avatar :color="APP_COLOR">
              <span class="white--text text-h5">
                {{
                  String(model.name_user.slice(0, 1)).toUpperCase() +
                  String(model.lastname.slice(0, 1)).toUpperCase()
                }}
              </span>
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-subtitle>Creado por</v-list-item-subtitle>
              <v-list-item-title>
                {{ model.name_user }} {{ model.lastname }}
              </v-list-item-title>
            </v-list-item-content>

            <v-row align="center" justify="end">
              <v-icon class="mr-1" @click="cerrarDlgDetalles()">
                mdi-close
              </v-icon>
            </v-row>
          </v-list-item>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </AppView>
</template>

<script>
import AppView from "@/components/AppView.vue";
import { requests } from "@/helpers/requests";
import Swal from "sweetalert2";
import auth from "@/helpers/auth";
import {
  APP_COLOR,
  APP_COLOR_TEXT,
  APP_DARK_MODE,
  APP_INPUT_ATTRS,
} from "@/helpers/theme";

const { state } = auth();
const { send } = requests();

export default {
  name: "ControlPlantillas",
  components: { AppView },
  data: () => ({
    APP_COLOR: APP_COLOR,
    APP_COLOR_TEXT: APP_COLOR_TEXT,
    APP_DARK_MODE: APP_DARK_MODE,
    APP_INPUT_ATTRS: APP_INPUT_ATTRS,
    usuario: state.user,
    selected: 0,
    items: [
      { value: 0, option: "Selecciona una opción" },
      { value: 1, option: "Catálogo" },
      { value: 2, option: "Proceso" },
      { value: 3, option: "Reporte" },
      { value: 4, option: "Público" },
      { value: 5, option: "Otro" },
    ],
    xhr: {
      controller: "procesos/plantillas/process",
    },
    dlgDetalles: false,
    dlgFormulario: false,
    btnAgregar: false,
    btnModificar: false,
    rules: {
      required: (value) => !!value || "Este campo es necesario.",
      min: (v) => v.length >= 8 || "Min 8 characters",
    },
    model: {
      _id: 0,
      name: "",
      path: "",
      component: "",
      icono: "remove",
      tipo_plantilla: "",
      orden: "",
      descripcion: "",
      menu_desplegable: false,
      enlace_externo: false,
      name_user: "",
      lastname: "",
    },
    data: [],
    search: null,
    caseSensitive: false,
  }),
  computed: {
    valid() {
      return (
        this.model.name.length > 0 &&
        this.model.component.length > 0 &&
        this.model.icono.length > 0 &&
        this.selected > 0 &&
        this.model.orden.length > 0 &&
        this.model.descripcion.length > 0
      );
    },
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined;
    },
  },
  created() {
    this.consultar();
  },
  methods: {
    agregar() {
      this.model.tipo_plantilla = this.selected;

      Swal.fire({
        title: "¿Deseas continuar?",
        text: "Confirma que deseas agregar el registro.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, confirmar",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          return await send(this.xhr.controller, {
            prtrAccion: "agregar",
            model: this.model,
          });
        },
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          let data = result.value.data;

          if (data === null) {
            this.mostrarMensajeErrorServidor();
          } else {
            switch (data.status) {
              case "success":
                Swal.fire(
                  data.message.title,
                  data.message.content,
                  data.message.type
                );

                this.limpiarFormulario();
                this.consultar();
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
        }
      });
    },
    modificar() {
      this.model.tipo_plantilla = this.selected;

      Swal.fire({
        title: "¿Deseas continuar?",
        text: "Confirma que deseas modificar el registro.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, confirmar",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          return await send(this.xhr.controller, {
            prtrAccion: "modificar",
            model: this.model,
          });
        },
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          let data = result.value.data;

          if (data === null) {
            this.mostrarMensajeErrorServidor();
          } else {
            switch (data.status) {
              case "success":
                Swal.fire(
                  data.message.title,
                  data.message.content,
                  data.message.type
                );

                this.dlgFormulario = false;
                this.consultar();
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
        }
      });
    },
    desactivar(id) {
      this.model._id = id;

      Swal.fire({
        title: "¿Deseas continuar?",
        text: "Confirma que deseas desactivar el registro.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, confirmar",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          return await send(this.xhr.controller, {
            prtrAccion: "desactivar",
            model: this.model,
          });
        },
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          let data = result.value.data;

          if (data === null) {
            this.mostrarMensajeErrorServidor();
          } else {
            switch (data.status) {
              case "success":
                Swal.fire(
                  data.message.title,
                  data.message.content,
                  data.message.type
                );

                this.consultar();
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
        }
      });
    },
    reactivar(id) {
      this.model._id = id;

      Swal.fire({
        title: "¿Deseas continuar?",
        text: "Confirma que deseas reactivar el registro.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, confirmar",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          return await send(this.xhr.controller, {
            prtrAccion: "reactivar",
            model: this.model,
          });
        },
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          let data = result.value.data;

          if (data === null) {
            this.mostrarMensajeErrorServidor();
          } else {
            switch (data.status) {
              case "success":
                Swal.fire(
                  data.message.title,
                  data.message.content,
                  data.message.type
                );

                this.consultar();
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
        }
      });
    },
    async consultar() {
      const { data } = await send("plantilla/consultar");

      if (data === null) {
        this.mostrarMensajeErrorServidor();
      } else {
        switch (data.status) {
          case "success":
            this.data = data.data;
            break;
          default:
            Swal.fire(
              data.message.title,
              data.message.content,
              data.message.type
            );

            this.data = data.data;
            break;
        }
      }
    },
    cargarRegistro(item) {
      this.btnAgregar = false;
      this.btnModificar = true;

      this.model = Object.assign({}, item);

      this.selected = parseInt(item.tipo_plantilla_indice);
      this.model.menu_desplegable = item.es_menu == "Si";
      this.model.enlace_externo = item.es_externo == "Si";

      this.dlgFormulario = true;
    },
    cerrarDlgFormulario() {
      this.dlgFormulario = false;
    },
    abrirDlgFormulario(_id) {
      this.model._id = _id;
      this.limpiarFormulario();
      this.btnAgregar = true;
      this.btnModificar = false;
      this.dlgFormulario = true;
    },
    abrirDlgDetalles(item) {
      this.model = Object.assign({}, item);
      this.dlgDetalles = true;
    },
    cerrarDlgDetalles() {
      this.dlgDetalles = false;
    },
    limpiarFormulario() {
      this.model.name = "";
      this.model.path = "";
      this.model.component = "";
      this.model.icono = "remove";
      this.model.orden = "";
      this.model.tipo_plantilla = "";
      this.selected = 0;
      this.model.descripcion = "";
      this.model.menu_desplegable = false;
      this.model.enlace_externo = false;
    },
    mostrarMensajeErrorServidor() {
      Swal.fire(
        "Error",
        "Ocurrió un error al conectarse con el servidor",
        "error"
      );
    },
    abrirEnlace(enlace) {
      window.open(enlace, "_blank");
    },
  },
};
</script>

<style scoped>
.btn-floating {
  position: fixed;
  right: 15px;
  bottom: 15px;
  z-index: 4;
}
</style>