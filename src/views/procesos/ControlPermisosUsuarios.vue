<template>
  <AppView>
    <v-card elevation="2" outlined :dark="APP_DARK_MODE">
      <v-card-title> {{ this.$route.name }} </v-card-title>
      <v-card-subtitle>{{
        this.$route.meta.description.replace("_NOMBRE_PERSONA_", usuario.name)
      }}</v-card-subtitle>

      <v-card-text>
        <v-row>
          <v-col lg="4" md="4" sm="12">
            <v-select
              v-model="cmbGrupoSeguridadSelected"
              :items="data"
              item-value="_id"
              item-text="nombre"
              label="Grupo de seguridad"
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
              :items="data_usuarios_con_permisos"
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
              <template v-slot:[`item.eliminar`]="{ item }">
                <v-btn
                  color="error"
                  dark
                  fab
                  small
                  @click="eliminar(item.grupo_seguridad_user_id)"
                >
                  <v-icon small>mdi-delete</v-icon>
                </v-btn>
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
      @click="abrirUsuariosModal()"
    >
      <v-icon dark class="white--text"> mdi-plus </v-icon>
    </v-btn>

    <v-dialog
      v-model="dlgFormulario"
      max-width="900px"
      persistent
      scrollable
      :dark="APP_DARK_MODE"
    >
      <v-card outlined>
        <v-card-title>
          <span class="text-h5">Formulario de usuarios</span>
        </v-card-title>

        <v-card-text class="pt-5">
          <v-row>
            <v-col lg="4" offset-lg="8" md="4" offset-md="8" sm="12">
              <v-text-field
                v-model="datatableDialog.search"
                append-icon="mdi-magnify"
                label="Buscar"
                v-bind="APP_INPUT_ATTRS"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col lg="12">
              <v-data-table
                :headers="datatableDialog.headers"
                :items="data_usuarios_sin_permisos"
                multi-sort
                :search="datatableDialog.search"
                :footer-props="{
                  showFirstLastPage: true,
                  firstIcon: 'mdi-arrow-collapse-left',
                  lastIcon: 'mdi-arrow-collapse-right',
                  prevIcon: 'mdi-minus',
                  nextIcon: 'mdi-plus',
                }"
                class="elevation-2"
              >
                <template v-slot:[`item.agregar`]="{ item }">
                  <v-btn
                    color="success"
                    dark
                    fab
                    small
                    @click="agregar(item.id)"
                  >
                    <v-icon small>mdi-check</v-icon>
                  </v-btn>
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

        <v-card-actions class="text-right">
          <v-spacer></v-spacer>
          <v-btn text @click="cerrarUsuariosModal()"> Cancelar </v-btn>
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
    xhr: {
      controller: "procesos/permisos_usuarios/process",
    },
    cmbGrupoSeguridadSelected: 0,
    data: [],
    datatable: {
      search: "",
      headers: [
        { text: "Nombre", value: "name" },
        { text: "Apellidos", value: "lastname" },
        { text: "Correo electrónico", value: "email" },
        {
          text: "Eliminar",
          value: "eliminar",
          sortable: false,
          align: "center",
        },
      ],
    },
    datatableDialog: {
      search: "",
      headers: [
        { text: "Nombre", value: "name" },
        { text: "Apellidos", value: "lastname" },
        { text: "Correo electrónico", value: "email" },
        {
          text: "Agregar",
          value: "agregar",
          sortable: false,
          align: "center",
        },
      ],
    },
    dlgFormulario: false,
    model: {
      _idUsuario: 0,
      _idGrupoSeguridad: 0,
    },
    data_usuarios_con_permisos: [],
    data_usuarios_sin_permisos: [],
    no_data: "No hay registros para mostrar",
  }),
  computed: {},
  watch: {
    cmbGrupoSeguridadSelected(newVal) {
      switch (newVal) {
        case 0:
          this.data = [];
          break;
        default:
          this.consultarUsuariosConPermiso();
          break;
      }
    },
  },
  created() {
    this.consultarGruposSeguridad();
  },
  methods: {
    agregar(idUsuario) {
      this.model._idGrupoSeguridad = this.cmbGrupoSeguridadSelected;
      this.model._idUsuario = idUsuario;

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
          return await send("permisos_usuario/agregar", this.model);
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

                this.consultarUsuariosConPermiso();
                this.consultarUsuariosSinPermisos();
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
    eliminar(id) {
      Swal.fire({
        title: "¿Deseas continuar?",
        text: "Confirma que deseas eliminar el registro.",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        cancelButtonText: "Cancelar",
        confirmButtonText: "Si, confirmar",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          return await send("permisos_usuario/eliminar", { _id: id });
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

                this.consultarUsuariosConPermiso();
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
    async consultarGruposSeguridad() {
      const { data } = await send(
        "permisos_usuario/consultar-grupos-seguridad"
      );

      if (data === null) {
        this.mostrarMensajeErrorServidor();
      } else {
        switch (data.status) {
          case "success":
            data.data.unshift({
              _id: 0,
              nombre: "Selecciona una opción",
              descripción: "",
              estatus: "",
              fecha_registro: "",
              responsable: "",
            });
            this.data = data.data;
            break;
          default:
            this.data.push({
              _id: 0,
              nombre: data.message.content,
              descripción: "",
              estatus: "",
              fecha_registro: "",
              responsable: "",
            });
            break;
        }
      }
    },
    async consultarUsuariosConPermiso() {
      const { data } = await send(
        "permisos_usuario/consultar-usuarios-con-permiso",
        {
          cmbGrupoSeguridad: this.cmbGrupoSeguridadSelected,
        }
      );

      if (data === null) {
        this.mostrarMensajeErrorServidor();
      } else {
        switch (data.status) {
          case "success":
            this.data_usuarios_con_permisos = data.data;
            break;
          default:
            Swal.fire(
              data.message.title,
              data.message.content,
              data.message.type
            );

            this.data_usuarios_con_permisos = data.data;
            break;
        }
      }
    },
    async consultarUsuariosSinPermisos() {
      const { data } = await send(
        "permisos_usuario/consultar-usuarios-sin-permiso",
        {
          cmbGrupoSeguridad: this.cmbGrupoSeguridadSelected,
        }
      );

      if (data === null) {
        this.mostrarMensajeErrorServidor();
      } else {
        switch (data.status) {
          case "success":
            this.data_usuarios_sin_permisos = data.data;
            break;
          default:
            Swal.fire(
              data.message.title,
              data.message.content,
              data.message.type
            );

            this.data_usuarios_sin_permisos = data.data;
            break;
        }
      }
    },
    abrirUsuariosModal() {
      switch (parseInt(this.cmbGrupoSeguridadSelected)) {
        case 0:
          Swal.fire(
            "Advertencia",
            "Por favor selecciona un grupo de seguridad",
            "warning"
          );
          break;
        default:
          this.dlgFormulario = true;
          this.consultarUsuariosSinPermisos();
          break;
      }
    },
    cerrarUsuariosModal() {
      this.dlgFormulario = false;
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

<style scoped>
.btn-floating {
  position: fixed;
  right: 15px;
  bottom: 15px;
  z-index: 4;
}
</style>s