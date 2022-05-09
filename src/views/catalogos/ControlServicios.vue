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
              :items="services"
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
          <span class="text-h5">Formulario de servicios</span>
        </v-card-title>

        <v-card-text class="pt-5">
          <v-row>
            <v-col cols="12" lg="12" md="12" sm="12" class="pb-0">
              <v-text-field
                v-model="model.nombre"
                label="Nombre del servicio"
                :rules="[rules.required]"
                v-bind="APP_INPUT_ATTRS"
              />

              <v-text-field
                v-model="model.costo"
                label="Costo del servicio"
                maxlength="10"
                type="number"
                :rules="[rules.required]"
                v-bind="APP_INPUT_ATTRS"
              />

              <v-select
                v-model="periodicidadSelected"
                :items="periodicidad_items"
                item-text="option"
                item-value="value"
                label="Periodo"
                v-bind="APP_INPUT_ATTRS"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col
              cols="12"
              lg="12"
              md="12"
              offset-md="12"
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
  APP_INPUT_MODE,
  APP_INPUT_ATTRS,
} from "@/helpers/theme";

const { state } = auth();
const { send } = requests();

export default {
  name: "ControlServicios",
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
        { text: "Nombre", value: "nombre" },
        { text: "Costo", value: "costo" },
        { text: "Descripción", value: "descripcion" },
        { text: "Periodicidad", value: "periodicidad" },
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
    isDialogOpen: false,
    isBtnCreateShown: false,
    isBtnUpdateShown: false,
    periodicidadSelected: 0,
    periodicidad_items: [
      { value: 0, option: "Seleccione una opción" },
      { value: 1, option: "Anual" },
      { value: 2, option: "Mensual" },
      { value: 3, option: "Quincenal" },
      { value: 4, option: "Semestral" },
    ],
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
      costo: 0,
      descripcion: "",
      periodicidad: "",
      periodicidad_indice: 0,
      estatus: null,
      estatus_indice: 0,
      fecha_registro: null,
    },
    services: [],
    no_data: "",
  }),
  computed: {
    valid() {
      return (
        this.model.nombre.length > 0 &&
        Number(this.model.costo) > 0 &&
        this.periodicidadSelected != 0 &&
        this.model.descripcion.length > 0
      );
    },
  },
  created() {
    this.getServices();
  },
  methods: {
    async create() {
      this.model.periodicidad_indice = this.periodicidadSelected;
      
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
        preConfirm: async () => await send("servicio/create", this.model),
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
                this.getServices();
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
      this.model.periodicidad_indice = this.periodicidadSelected;

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
        preConfirm: async () => await send("servicio/update", this.model),
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
                this.getServices();
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
          await send("servicio/deactivate-reactivate", this.model),
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

                this.getServices();
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
    async getServices() {
      let { data } = await send("servicio/getServices");

      if (data === null) {
        this.showErrorServerMessage();
      } else {
        switch (data.status) {
          case "success":
            this.services = data.data;
            break;
          default:
            this.services = data.data;
            this.no_data = data.message.content;
            break;
        }
      }
    },
    loadInformationInFields(item) {
      this.isBtnCreateShown = false;
      this.isBtnUpdateShown = true;
      this.model = Object.assign({}, item);
      this.periodicidadSelected = this.model.periodicidad_indice;
      this.isDialogOpen = true;
    },
    closeDialog() {
      this.isDialogOpen = false;
    },
    openDialog() {
      this.cleanFields();
      this.isBtnCreateShown = true;
      this.isBtnUpdateShown = false;
      this.isDialogOpen = true;
    },
    cleanFields() {
      this.model._id = 0;
      this.model.nombre = "";
      this.model.costo = 0;
      this.model.descripcion = "";
      this.model.estatus = null;
      this.model.estatus_indice = 0;
      this.model.periodicidad_indice = 0;
      this.periodicidadSelected = 0;
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