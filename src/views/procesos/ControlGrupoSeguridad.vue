<template>
  <AppView>
    <v-card elevation="2" outlined :dark="APP_DARK_MODE">
      <v-card-title> {{ this.$route.name }} </v-card-title>
      <v-card-subtitle>{{
        this.$route.meta.description.replace("_NOMBRE_PERSONA_", usuario.name)
      }}</v-card-subtitle>

      <v-sheet :color="APP_COLOR" class="pa-4">
        <v-text-field
          v-model="filters.txtBuscador"
          label="Buscar una grupo de seguridad..."
          dark
          flat
          solo-inverted
          hide-details
          clearable
          clear-icon="mdi-close-circle-outline"
          @change="consultar()"
        />
      </v-sheet>

      <v-card-text>
        <v-row>
          <v-col
            cols="12"
            lg="4"
            md="4"
            sm="12"
            v-for="grupo in data"
            :key="grupo._id"
          >
            <v-card outlined :dark="APP_DARK_MODE">
              <v-img height="200px" src="@/assets/images/vbanner.jpg">
                <v-app-bar flat color="transparent">
                  <v-toolbar-title class="text-h6 white--text pl-0">
                    Grupo de seguridad
                  </v-toolbar-title>

                  <v-spacer></v-spacer>

                  <v-btn dark icon @click="abrirDlgFormularioPlantillas(grupo)">
                    <v-icon>assignment</v-icon>
                  </v-btn>

                  <v-btn dark icon @click="cargarRegistro(grupo)">
                    <v-icon>edit</v-icon>
                  </v-btn>

                  <v-btn
                    v-if="grupo.estatus == 'Activo'"
                    dark
                    icon
                    @click="desactivar(grupo)"
                  >
                    <v-icon>delete</v-icon>
                  </v-btn>

                  <v-btn
                    v-if="grupo.estatus == 'Inactivo'"
                    dark
                    icon
                    @click="reactivar(grupo)"
                  >
                    <v-icon>refresh</v-icon>
                  </v-btn>
                </v-app-bar>

                <v-card-title class="white--text mt-8">
                  <v-avatar size="56">
                    <img alt="user" src="@/assets/images/logo/logo.png" />
                  </v-avatar>
                  <p class="ml-3">{{ grupo.nombre }}</p>
                </v-card-title>
              </v-img>

              <v-card-text>
                <div>
                  {{ grupo.descripcion }}
                </div>
              </v-card-text>

              <v-card-actions>
                <v-list subheader two-line>
                  <v-list-item>
                    <v-list-item-avatar :color="APP_COLOR">
                      <v-icon dark> info </v-icon>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>Información</v-list-item-title>

                      <v-list-item-subtitle></v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-chip
                        class="ma-2"
                        :color="grupo.estatus == 'Activo' ? 'green' : 'red'"
                        text-color="white"
                      >
                        {{ grupo.estatus }}
                      </v-chip>
                    </v-list-item-action>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-avatar :color="APP_COLOR">
                      <span class="white--text text-h5">
                        {{
                          String(grupo.name1.slice(0, 1)).toUpperCase() +
                          String(grupo.lastname1.slice(0, 1)).toUpperCase()
                        }}
                      </span>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>Actualizado por</v-list-item-title>

                      <v-list-item-subtitle>
                        {{ grupo.name1 }} {{ grupo.lastname1 }}
                      </v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-list-item-title>
                        {{
                          parsearFecha(
                            grupo.fecha_actualizacion,
                            "DD [de] MMMM [de] YYYY"
                          )
                        }}
                      </v-list-item-title>

                      <v-list-item-subtitle>
                        {{
                          parsearFecha(
                            grupo.fecha_actualizacion,
                            "[a las] hh:mm:ss a"
                          )
                        }}
                      </v-list-item-subtitle>
                    </v-list-item-action>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-avatar :color="APP_COLOR">
                      <span class="white--text text-h5">
                        {{
                          String(grupo.name2.slice(0, 1)).toUpperCase() +
                          String(grupo.lastname2.slice(0, 1)).toUpperCase()
                        }}
                      </span>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>Creado por</v-list-item-title>

                      <v-list-item-subtitle>
                        {{ grupo.name2 }} {{ grupo.lastname2 }}
                      </v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-list-item-title>
                        {{
                          parsearFecha(
                            grupo.fecha_registro,
                            "DD [de] MMMM [de] YYYY"
                          )
                        }}
                      </v-list-item-title>

                      <v-list-item-subtitle>
                        {{
                          parsearFecha(
                            grupo.fecha_registro,
                            "[a las] hh:mm:ss a"
                          )
                        }}
                      </v-list-item-subtitle>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-btn
      class="mx-2 btn-floating"
      fab
      :color="APP_COLOR"
      @click="abrirDlgFormulario()"
    >
      <v-icon dark class="white--text"> mdi-plus </v-icon>
    </v-btn>

    <v-dialog
      v-model="dlgFormulario"
      max-width="600px"
      persistent
      scrollable
      :dark="APP_DARK_MODE"
    >
      <v-card outlined>
        <v-card-title>
          <span class="text-h5">Formulario de grupos de seguridad</span>
        </v-card-title>

        <v-card-text class="pt-5">
          <v-text-field
            v-model="model.nombre"
            label="Nombre"
            :rules="[rules.required]"
            v-bind="APP_INPUT_ATTRS"
          />

          <v-textarea
            v-model="model.descripcion"
            clear-icon="mdi-close-circle"
            label="Descripcion"
            rows="3"
            :rules="[rules.required]"
            v-bind="APP_INPUT_ATTRS"
          />
        </v-card-text>
        <v-card-actions class="text-right">
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

    <v-dialog
      v-model="dlgPlantillas"
      max-width="800px"
      persistent
      scrollable
      :dark="APP_DARK_MODE"
    >
      <template>
        <v-card outlined>
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
            />
          </v-sheet>

          <v-card-text>
            <v-treeview
              rounded
              :search="search"
              :filter="filter"
              :items="plantillas"
              item-key="_id"
              hoverable
            >
              <template v-slot:prepend="{ item }">
                <v-icon>
                  {{ item.icono }}
                </v-icon>
              </template>

              <template v-slot:append="{ item }">
                <v-switch
                  v-if="item.es_menu == 'No'"
                  :input-value="item.existe_relacion > 0"
                  v-on:click="cambiar(item, !(item.existe_relacion > 0))"
                  :color="APP_COLOR"
                ></v-switch>
              </template>
            </v-treeview>
          </v-card-text>

          <v-card-actions class="text-right">
            <v-spacer></v-spacer>
            <v-btn text @click="cerrarDlgFormularioPlantillas()"
              >Cerrar dialogo</v-btn
            >
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </AppView>
</template>

<script>
import AppView from "@/components/AppView.vue";
import { requests } from "@/helpers/requests";
import Swal from "sweetalert2";
import moment from "moment";
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
  name: "ControlGrupoSeguridad",
  components: { AppView },
  data: () => ({
    APP_COLOR: APP_COLOR,
    APP_COLOR_TEXT: APP_COLOR_TEXT,
    APP_DARK_MODE: APP_DARK_MODE,
    APP_INPUT_ATTRS: APP_INPUT_ATTRS,
    usuario: state.user,
    xhr: {
      controller: "procesos/grupo_seguridad/process",
    },
    datatable: {
      search: "",
      headers: [
        { text: "Icono", align: "start", value: "icono", sortable: false },
        { text: "Nombre", value: "name" },
        { text: "Estatus", value: "estatus" },
        {
          text: "Acceso",
          value: "agregarPermiso",
          sortable: false,
          align: "center",
        },
      ],
    },
    dlgFormulario: false,
    dlgPlantillas: false,
    btnAgregar: false,
    btnModificar: false,
    rules: {
      required: (value) => !!value || "Este campo es necesario.",
      min: (v) => v.length >= 8 || "Min 8 characters",
      emailMatch: () => `The email and password you entered don't match`,
    },
    filters: {
      txtBuscador: "",
    },
    model: {
      _id: 0,
      nombre: "",
      descripcion: "",
    },
    model_plantilla: {},
    data: [],
    plantillas: [],
    search: null,
    caseSensitive: false,
  }),
  computed: {
    valid() {
      return this.model.nombre.length > 0 && this.model.descripcion.length > 0;
    },
    filter() {
      return this.caseSensitive
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined;
    },
  },
  created() {
    moment().format("LT");
    moment.locale("es-mx");

    this.consultar();
  },
  methods: {
    agregar() {
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
          return await send("grupo_seguridad/agregar", this.model);
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
          return await send("grupo_seguridad/modificar", this.model);
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
    desactivar(item) {
      this.model = Object.assign({}, item);

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
          return await send("grupo_seguridad/desactivar", this.model);
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
    reactivar(item) {
      this.model = Object.assign({}, item);

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
          return await send("grupo_seguridad/reactivar", this.model);
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
      let { data } = await send("grupo_seguridad/consultar", this.filters);

      if (data === null) {
        this.mostrarMensajeErrorServidor();
      } else {
        switch (data.status) {
          case "success":
            this.data = data.data;
            break;
          default:
            this.data = data.data;
            break;
        }
      }
    },
    async consultarPlantillas() {
      let { data } = await send(
        "grupo_seguridad/consultar-plantillas",
        this.model
      );

      if (data === null) {
        this.mostrarMensajeErrorServidor();
      } else {
        switch (data.status) {
          case "success":
            this.plantillas = data.data;
            break;
          default:
            Swal.fire(
              data.message.title,
              data.message.content,
              data.message.type
            );

            this.plantillas = data.data;
            break;
        }
      }
    },
    cargarRegistro(item) {
      this.btnAgregar = false;
      this.btnModificar = true;
      this.model = Object.assign({}, item);
      this.dlgFormulario = true;
    },
    cerrarDlgFormulario() {
      this.dlgFormulario = false;
    },
    abrirDlgFormulario() {
      this.limpiarFormulario();
      this.btnAgregar = true;
      this.btnModificar = false;
      this.dlgFormulario = true;
    },
    cerrarDlgFormularioPlantillas() {
      this.dlgPlantillas = false;
    },
    abrirDlgFormularioPlantillas(item) {
      this.model = Object.assign({}, item);
      this.dlgPlantillas = true;
      this.consultarPlantillas();
    },
    limpiarFormulario() {
      this.model._id = 0;
      this.model.nombre = "";
      this.model.descripcion = "";
    },
    cambiar(item, value) {
      this.model_plantilla = Object.assign({}, item);

      if (value) {
        this.agregarPlantillaAGrupo();
      } else {
        this.quitarPlantillaAGrupo();
      }
    },
    async agregarPlantillaAGrupo() {
      let { data } = await send("grupo_seguridad/agregar-plantilla-a-grupo", {
        model: this.model,
        model_plantilla: this.model_plantilla,
      });

      if (data === null) {
        this.mostrarMensajeErrorServidor();
      } else {
        switch (data.status) {
          case "success":
            this.consultarPlantillas();
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
    async quitarPlantillaAGrupo() {
      let { data } = await send("grupo_seguridad/quitar-plantilla-a-grupo", {
        model: this.model,
        model_plantilla: this.model_plantilla,
      });

      if (data === null) {
        this.mostrarMensajeErrorServidor();
      } else {
        switch (data.status) {
          case "success":
            this.consultarPlantillas();
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
    parsearFecha(fecha, formato) {
      return moment(fecha).format(formato);
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