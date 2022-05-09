<template>
  <AppView>
    <v-card elevation="2" outlined :dark="APP_DARK_MODE">
      <v-card-title> {{ this.$route.name }} </v-card-title>
      <v-card-subtitle>{{
        this.$route.meta.description.replace("_NOMBRE_PERSONA_", usuario.name)
      }}</v-card-subtitle>

      <v-card-text>
        <v-row>
          <v-col cols="5" lg="5" md="5" sm="12" class="pb-0">
            <v-select
              v-model="clientSelected"
              :items="clients"
              item-text="nombre_completo_cliente"
              item-value="_id"
              label="Clientes"
              return-object
              @change="getPaymentHistory"
              v-bind="APP_INPUT_ATTRS"
            />
          </v-col>
        </v-row>

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
              :items="paymentHistory"
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
                  :color="item.estatus == 'Pagado' ? 'green' : 'red'"
                  text-color="white"
                >
                  {{ item.estatus }}
                </v-chip>
              </template>
              <template v-slot:[`item.es_registrado`]="{ item }">
                <v-btn
                  v-if="item.estatus == 'Pagado'"
                  color="error"
                  dark
                  fab
                  small
                  @click="cancelPayment(item)"
                  ><v-icon small>mdi-cash-remove</v-icon></v-btn
                >
                <v-btn
                  v-if="item.estatus == 'Cancelado'"
                  color="warning"
                  dark
                  fab
                  small
                  @click="cancelPayment(item)"
                  ><v-icon small>mdi-cash-check</v-icon></v-btn
                >
                <v-btn
                  v-if="item.estatus == 'Por pagar'"
                  color="success"
                  dark
                  fab
                  small
                  @click="openDialog(item)"
                  ><v-icon small>mdi-cash-register</v-icon></v-btn
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

    <v-dialog
      v-model="isDialogOpen"
      max-width="600px"
      persistent
      scrollable
      :dark="APP_DARK_MODE"
    >
      <v-card outlined>
        <v-card-title>
          <span class="text-h5">Formulario de pagos</span>
        </v-card-title>

        <v-card-text class="pt-5">
          <v-col cols="7" lg="7" md="4" sm="12">
            <h4>
              Estás haciendo el pago de:
              <font color="indigo">{{ model.servicioNombre }}</font>
            </h4>
          </v-col>
          <v-col cols="9" lg="9" md="9" sm="12">
            <h3>Detalle:</h3>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="8" lg="8" md="8" sm="12">
            <v-text-field
              v-model="model.servicioCosto"
              label="Costo del servicio"
              maxlength="5"
              type="number"
              :rules="[rules.required]"
              v-bind="APP_INPUT_ATTRS"
              disabled
            />
            <v-text-field
              v-model="model.recargo"
              label="Cargos por retraso"
              maxlength="5"
              type="number"
              :rules="[rules.required]"
              v-bind="APP_INPUT_ATTRS"
            />
            <v-divider></v-divider>
          </v-col>
          <v-col cols="8" lg="8" md="8" sm="12">
            <h3>Total: {{ model.total }}</h3>
          </v-col>
        </v-card-text>

        <v-card-actions class="text-right">
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog()"> Cancelar </v-btn>
          <v-btn :color="APP_COLOR" @click="create()" class="white--text">
            Agregar
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
  name: "ControlPagos",
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
        { text: "Servicio", value: "servicioNombre" },
        { text: "Periodicidad", value: "servicioPeriodicidad" },
        { text: "Costo servicio", value: "servicioCosto" },
        { text: "Recargo", value: "recargo" },
        { text: "Total pagar/pagado", value: "total" },
        { text: "Fecha pago", value: "fecha_pago" },
        { text: "Estatus pago", align: "center", value: "estatus" },
        {
          text: "Pagar / Cancelar",
          value: "es_registrado",
          sortable: false,
          align: "center",
        },
      ],
    },
    isDialogOpen: false,
    rules: {
      required: (value) => !!value || "Este campo es necesario.",
    },
    clientSelected: 0,
    model: {
      _id: 0,
      total: 0,
      recargo: 0,
      fecha_pago: "",
      cliente: 0,
      estatus: "",
      fecha_registro: "",
      es_registrado: "",
      servicioNombre: "",
      servicioPeriodicidad: "",
      servicioCosto: 0,
    },
    paymentHistory: [],
    clients: [],
    services: [],
    no_data: "",
  }),
  computed: {
    valid() {
      return Number(this.model.recargo) > 0;
    },
  },
  watch: {
    model: {
      handler(newValue) {
        this.model.total =
          Number(this.model.servicioCosto) + Number(newValue.recargo);
      },
      deep: true,
    },
  },
  created() {
    this.getClients();
  },
  methods: {
    async create() {
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
        preConfirm: async () => await send("pago/create", this.model),
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

                this.closeDialog();
                this.getPaymentHistory();
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
    async cancelPayment(item) {
      this.model = item;
      this.model.canceladoPagado =
        this.model.estatus === "Pagado" ? "Cancelado" : "Pagado";

      Swal.fire({
        title: "¿Deseas continuar?",
        text: "Confirma que deseas actualizar el pago.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, confirmar",
        showLoaderOnConfirm: true,
        preConfirm: async () => await send("pago/cancel-payment", this.model),
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

                this.getPaymentHistory();
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
      let { data } = await send("pago/getClients");

      if (data === null) {
        this.showErrorServerMessage();
      } else {
        switch (data.status) {
          case "success":
            this.clients = data.data;
            break;
          default:
            this.clients = data.data;
            break;
        }
      }
    },
    async getPaymentHistory() {
      let { data } = await send("pago/getPaymentHistory", this.clientSelected);

      if (data === null) {
        this.showErrorServerMessage();
      } else {
        switch (data.status) {
          case "success":
            this.paymentHistory = data.data;
            break;
          default:
            this.paymentHistory = data.data;
            break;
        }
      }
    },
    openDialog(item) {
      this.model = item;
      this.isDialogOpen = true;
    },
    closeDialog() {
      this.model.recargo = 0;
      this.isDialogOpen = false;
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