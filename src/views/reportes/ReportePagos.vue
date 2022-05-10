<template>
  <AppView>
    <v-card elevation="2" outlined :dark="APP_DARK_MODE">
      <v-card-title> {{ this.$route.name }} </v-card-title>
      <v-card-subtitle>{{
        this.$route.meta.description.replace("_NOMBRE_PERSONA_", usuario.name)
      }}</v-card-subtitle>

      <v-card-text>
        <v-row>
          <v-col cols="12" lg="5" md="5" sm="12" class="pb-0">
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
          <v-col cols="12" lg="6" md="6" sm="12" offset-lg="3" offset-md="3">
            <highcharts :options="chartPaymentHistory"></highcharts>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </AppView>
</template>

<script>
import AppView from "@/components/AppView.vue";
import { requests } from "@/helpers/requests";
import Swal from "sweetalert2";
import auth from "@/helpers/auth";
import { Chart } from "highcharts-vue";

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
  components: { AppView, highcharts: Chart },
  data: () => ({
    APP_COLOR: APP_COLOR,
    APP_COLOR_TEXT: APP_COLOR_TEXT,
    APP_DARK_MODE: APP_DARK_MODE,
    APP_INPUT_ATTRS: APP_INPUT_ATTRS,
    APP_INPUT_MODE: APP_INPUT_MODE,
    usuario: state.user,

    chartPaymentHistory: {
      lang: {
        viewFullscreen: "Ver en pantalla completa",
        printChart: "Imprimir gráfica",
        downloadPNG: "Descargar en PNG",
        downloadJPEG: "Descargar en JPEG",
        downloadPDF: "Descargar en PDF",
        downloadSVG: "Descargar en SVG",
      },
      colors: ['#E53935','#43A047','#FFB300'],
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: "pie",
      },
      title: {
        text: "Historial de pagos",
      },
      tooltip: {
        pointFormat: "{series.name}: <b>{point.y}</b>",
      },
      accessibility: {
        point: {
          valueSuffix: "%",
        },
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: "pointer",
          dataLabels: {
            enabled: true,
            format: "<b>{point.name}</b>: {point.percentage:.1f} %",
          },
        },
      },
      series: [
        {
          name: "Pagos",
          colorByPoint: true,
          data: [],
        },
      ],
    },

    clientSelected: 0,
    // paymentHistory: [],
    clients: [],
  }),
  created() {
    this.getClients();
  },
  methods: {
    async getClients() {
      let { data } = await send("reporte_pago/getClients");

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
      let { data } = await send("reporte_pago/getPaymentHistory", this.clientSelected);

      if (data === null) {
        this.showErrorServerMessage();
      } else {
        switch (data.status) {
          case "success":
            this.chartPaymentHistory.series[0].data = [
              {
                name: "Pendientes por pagar",
                y: data.data[0].pendientes,
              },
              {
                name: "Pagados",
                y: data.data[0].pagados,
              },
              {
                name: "Cancelados",
                y: data.data[0].cancelados,
              },
            ];
            break;
          default:
            this.chartPaymentHistory = data.data;
            break;
        }
      }
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