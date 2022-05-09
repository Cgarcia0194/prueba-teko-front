<template>
  <AppView>
    <v-card elevation="2" outlined :dark="APP_DARK_MODE">
      <v-card-title> {{ this.$route.name }} </v-card-title>
      <v-card-subtitle>{{
        this.$route.meta.description.replace("_NOMBRE_PERSONA_", usuario.name)
      }}</v-card-subtitle>

      <v-card-text>
        <v-row>
          <v-col lg="4" offset-lg="8" md="4" offset-md="8" sm="12">
            <v-text-field
              v-model="datatable.search"
              append-icon="mdi-magnify"
              label="Buscar"
              v-bind="APP_INPUT_ATTRS"
            />
          </v-col>
        </v-row>

        <v-row>
          <v-col lg="12">
            <v-data-table
              :headers="datatable.headers"
              :items="clients"
              multi-sort
              :search="datatable.search"
              :footer-props="{
                showFirstLastPage: true,
                firstIcon: 'mdi-arrow-collapse-left',
                lastIcon: 'mdi-arrow-collapse-right',
                prevIcon: 'mdi-minus',
                nextIcon: 'mdi-plus',
              }"
              class="elevation-2"
            >
              <template v-slot:[`item.estatus`]="{ item }">
                <v-chip
                  :color="item.estatus == 'Activo' ? 'green' : 'red'"
                  text-color="white"
                >
                  {{ item.estatus }}
                </v-chip>
              </template>
              <template v-slot:[`item.modificar`]="{ item }">
                <v-btn
                  color="warning"
                  dark
                  fab
                  small
                  @click="loadInformationInFields(item)"
                  ><v-icon small>mdi-pencil</v-icon></v-btn
                >
              </template>
              <template v-slot:[`item.desactivar_reactivar`]="{ item }">
                <v-btn
                  v-if="item.estatus == 'Activo'"
                  color="error"
                  dark
                  fab
                  small
                  @click="deactivateReactivate(item)"
                  ><v-icon small>mdi-delete</v-icon></v-btn
                >
                <v-btn
                  v-if="item.estatus == 'Inactivo'"
                  color="success"
                  dark
                  fab
                  small
                  @click="deactivateReactivate(item)"
                  ><v-icon small>mdi-refresh</v-icon></v-btn
                >
              </template>
              <template v-slot:no-data>
                <v-alert
                  type="info"
                  border="left"
                  elevation="3"
                  colored-border
                  prominent
                  icon="info"
                  class="ma-0"
                >
                  {{ no_data }}
                </v-alert>
              </template>
            </v-data-table>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-btn
      class="mx-2 btn-floating"
      fab
      :color="APP_COLOR"
      @click="openDialog()"
    >
      <v-icon dark class="white--text"> mdi-plus </v-icon>
    </v-btn>

    <v-dialog
      v-model="isDialogOpen"
      max-width="800px"
      persistent
      scrollable
      :dark="APP_DARK_MODE"
    >
      <v-card outlined>
        <v-card-title>
          <span class="text-h5">Formulario de clientes</span>
        </v-card-title>

        <v-card-text class="pt-5">
          <v-row>
            <v-col cols="12" lg="12" md="12" sm="12" class="pb-0">
              <v-text-field
                v-model="model.nombre"
                label="Nombre del cliente"
                :rules="[rules.required]"
                v-bind="APP_INPUT_ATTRS"
              />

              <v-text-field
                v-model="model.apellido_paterno"
                label="Apellido paterno del cliente"
                :rules="[rules.required]"
                v-bind="APP_INPUT_ATTRS"
              />

              <v-text-field
                v-model="model.apellido_materno"
                label="Apellido materno del cliente"
                :rules="[rules.required]"
                v-bind="APP_INPUT_ATTRS"
              />

              <v-select
                v-model="genreSelected"
                :items="genre_items"
                item-text="option"
                item-value="value"
                label="Género"
                v-bind="APP_INPUT_ATTRS"
              />

              <v-select
                v-model="serviceSelected"
                :items="service_items"
                item-text="nombre"
                item-value="_id"
                label="Servicio"
                v-bind="APP_INPUT_ATTRS"
              />
            </v-col>

            <v-col cols="4" lg="4" md="4" sm="12">
              <v-menu
                v-model="model.menu_fecha_ingreso"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="model.fecha_ingreso"
                    label="Fecha de ingreso"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :outlined="APP_INPUT_MODE == 'outlined'"
                    :filled="APP_INPUT_MODE == 'filled'"
                    :solo="APP_INPUT_MODE == 'solo'"
                    :color="APP_COLOR"
                  />
                </template>
                <v-date-picker
                  v-model="model.fecha_ingreso"
                  no-title
                  scrollable
                  min="1950-01-01"
                  locale="es"
                  @input="model.menu_fecha_ingreso = false"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-checkbox v-model="isVisible" label="Fecha egreso"></v-checkbox>
            <v-col cols="4" lg="4" md="4" sm="12">
              <div v-show="isVisible">
                <v-menu
                  v-model="model.menu_fecha_egreso"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="model.fecha_egreso"
                      label="Fecha de egreso"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :outlined="APP_INPUT_MODE == 'outlined'"
                      :filled="APP_INPUT_MODE == 'filled'"
                      :solo="APP_INPUT_MODE == 'solo'"
                      :color="APP_COLOR"
                    />
                  </template>
                  <v-date-picker
                    v-model="model.fecha_egreso"
                    no-title
                    scrollable
                    min="1950-01-01"
                    locale="es"
                    @input="model.menu_fecha_egreso = false"
                  ></v-date-picker>
                </v-menu>
              </div>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="text-right">
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog()"> Cancelar </v-btn>
          <v-btn
            v-show="isBtnCreateShown"
            :color="APP_COLOR"
            @click="create()"
            :disabled="!valid"
            class="white--text"
          >
            Agregar
          </v-btn>
          <v-btn
            v-show="isBtnUpdateShown"
            :color="APP_COLOR"
            @click="update()"
            :disabled="!valid"
            class="white--text"
          >
            Modificar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar left v-model="snackbar" :timeout="3000">
      {{ textSnackBar }}
    </v-snackbar>
  </AppView>
</template>

<script>
import AppView from "@/components/AppView.vue";
import { requests } from "@/helpers/requests";
import Swal from "sweetalert2";
import auth from "@/helpers/auth";
import moment from "moment";

import {
  APP_COLOR,
  APP_COLOR_TEXT,
  APP_DARK_MODE,
  APP_INPUT_MODE,
  APP_INPUT_ATTRS,
} from "@/helpers/theme";

const { state } = auth();
const { send } = requests();

export default {
  name: "ControlClientes",
  components: { AppView },
  data: () => ({
    APP_COLOR: APP_COLOR,
    APP_COLOR_TEXT: APP_COLOR_TEXT,
    APP_DARK_MODE: APP_DARK_MODE,
    APP_INPUT_ATTRS: APP_INPUT_ATTRS,
    APP_INPUT_MODE: APP_INPUT_MODE,
    usuario: state.user,
    datatable: {
      search: "",
      headers: [
        { text: "ID", align: "start", value: "_id" },
        { text: "Nombre", value: "nombre_completo_cliente" },
        { text: "Género", value: "genero" },
        { text: "Servicio", value: "servicios_nombre" },
        { text: "Periodicidad", value: "servicios_periodicidad" },
        { text: "Fecha ingreso", value: "fecha_ingreso" },
        { text: "Fecha egreso", value: "fecha_egreso_validada" },
        { text: "Estatus", value: "estatus" },
        {
          text: "Modificar",
          value: "modificar",
          sortable: false,
          align: "center",
        },
        {
          text: "Desactivar / reactivar",
          value: "desactivar_reactivar",
          sortable: false,
          align: "center",
        },
      ],
    },
    isVisible: false,
    isDialogOpen: false,
    isBtnCreateShown: false,
    isBtnUpdateShown: false,
    snackbar: false,
    textSnackBar: "",
    serviceSelected: 0,
    service_items: [],
    genreSelected: 0,
    genre_items: [
      { value: 0, option: "Seleccione una opción" },
      { value: 1, option: "Hombre" },
      { value: 2, option: "Mujer" },
      { value: 3, option: "Sin especificar" },
    ],
    option_default_selected: { _id: 0, nombre: "Seleccione una opción" },
    rules: {
      required: (value) => !!value || "Este campo es necesario.",
      email: (value) => {
        const pattern =
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(value) || "Correo electrónico inválido.";
      },
    },
    model: {
      _id: 0,
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      genero: "",
      genero_indice: 0,
      fecha_ingreso: "",
      fecha_egreso: "",
      servicio: 0,
      estatus: null,
      estatus_indice: 0,
      fecha_registro: null,
      menu_fecha_ingreso: false,
      menu_fecha_egreso: false,
    },
    clients: [],
    no_data: "",
  }),
  watch: {
    isVisible(newVal) {
      if (newVal === false) {
        this.model.fecha_egreso = "";
      }
    },
  },
  computed: {
    valid() {
      return (
        this.model.nombre.length > 0 &&
        this.model.apellido_paterno.length > 0 &&
        this.model.apellido_materno.length > 0 &&
        this.genreSelected != 0 &&
        this.serviceSelected != 0 &&
        this.model.fecha_ingreso != ""
      );
    },
  },
  created() {
    this.getClients();
  },
  methods: {
    async create() {
      this.model.genero = this.genreSelected;
      this.model.servicio = this.serviceSelected;

      if (this.validateDates() === false) {
        this.textSnackBar = "La fecha EGRESO es menor a la fecha INGRESO.";
        this.snackbar = true;
        return false;
      }

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
        preConfirm: async () => await send("cliente/create", this.model),
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          let data = result.value.data;

          if (data === null) {
            this.showErrorServerMessage();
          } else {
            switch (data.status) {
              case "success":
                this.messages(
                  data.message.title,
                  data.message.content,
                  data.message.type
                );

                this.cleanFields();
                this.getClients();
                break;
              default:
                this.messages(
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
    async update() {
      this.model.genero = this.genreSelected;
      this.model.servicio = this.serviceSelected;

      if (this.validateDates() === false) {
        this.textSnackBar = "La fecha EGRESO es menor a la fecha INGRESO.";
        this.snackbar = true;
        return false;
      }

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
        preConfirm: async () => await send("cliente/update", this.model),
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          let data = result.value.data;

          if (data === null) {
            this.showErrorServerMessage();
          } else {
            switch (data.status) {
              case "success":
                this.messages(
                  data.message.title,
                  data.message.content,
                  data.message.type
                );

                this.isDialogOpen = false;
                this.getClients();
                break;
              default:
                this.messages(
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
    async deactivateReactivate(item) {
      this.model = item;
      this.model.desactivarReactivar = this.model.estatus_indice === 1 ? 2 : 1;

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
        preConfirm: async () =>
          await send("cliente/deactivate-reactivate", this.model),
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          let data = result.value.data;

          if (data === null) {
            this.showErrorServerMessage();
          } else {
            switch (data.status) {
              case "success":
                this.messages(
                  data.message.title,
                  data.message.content,
                  data.message.type
                );

                this.getClients();
                break;
              default:
                this.messages(
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
    async getClients() {
      let { data } = await send("cliente/getClients");

      if (data === null) {
        this.showErrorServerMessage();
      } else {
        switch (data.status) {
          case "success":
            this.clients = data.data;
            break;
          default:
            this.clients = data.data;
            this.no_data = data.message.content;
            break;
        }
      }
    },
    async getServices() {
      let { data } = await send("cliente/getServices");

      if (data === null) {
        this.showErrorServerMessage();
      } else {
        switch (data.status) {
          case "success":
            this.service_items = data.data;
            this.service_items.unshift(this.option_default_selected);
            break;
          default:
            this.service_items = data.data;
            this.no_data = data.message.content;
            break;
        }
      }
    },
    loadInformationInFields(item) {
      this.isBtnCreateShown = false;
      this.isBtnUpdateShown = true;

      this.model = Object.assign({}, item);
      this.serviceSelected = this.model.servicio;
      this.genreSelected = this.model.genero_indice;

      if (this.model.fecha_egreso === null) {
        this.isVisible = false;
      } else {
        this.isVisible = true;
      }

      this.isDialogOpen = true;
    },
    closeDialog() {
      this.isDialogOpen = false;
    },
    openDialog() {
      this.getServices();
      this.cleanFields();
      this.isBtnCreateShown = true;
      this.isBtnUpdateShown = false;
      this.isDialogOpen = true;
    },
    cleanFields() {
      this.model._id = 0;
      this.model.nombre = "";
      this.model.apellido_paterno = "";
      this.model.apellido_materno = "";
      this.model.genero = "";
      this.model.genero_indice = 0;
      this.model.fecha_ingreso = "";
      this.model.fecha_egreso = "";
      this.model.servicio = 0;
      this.model.estatus = null;
      this.model.estatus_indice = 0;
      this.model.fecha_registro = null;
      this.model.estatus_indice = 0;
      this.model.periodicidad_indice = 0;
      this.genreSelected = 0;
      this.serviceSelected = 0;
      this.isVisible = false;
    },
    validateDates() {
      const fechaIngreso = this.model.fecha_ingreso;
      const fechaEgreso = this.model.fecha_egreso;

      return moment(fechaEgreso) <
        moment(fechaIngreso)
        ? false
        : true;
    },
    showErrorServerMessage() {
      this.messages(
        "Error",
        "Ocurrió un error al conectarse con el servidor",
        "error"
      );
    },
    messages(title, content, type) {
      Swal.fire(title, content, type);
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