import auth from "@/helpers/auth";

const { state } = auth();

var nombre_proyecto = "PRUEBA";
var base;
var background;
var color_texto;
var dark = false;
var full = false;
var input;

if (state.user != null) {
  if (state.user.configuracion != null && state.user.aplicacion != null) {
    nombre_proyecto = state.user.aplicacion.nombre;
    base = state.user.configuracion.color;
    background = base + " " + state.user.configuracion.complemento;
    color_texto = base + "--text";
    dark = state.user.configuracion.modo_oscuro == "Si";
    full = state.user.configuracion.modo_pantalla_completa == "Si";
    input = state.user.configuracion.modo_input;
  } else {
    base = "blue";
    background = base + " darken-2";
    color_texto = base + "--text";
    dark = false;
    full = false;
    input = "filled";
  }
} else {
  base = "blue";
  background = base + " darken-2";
  color_texto = base + "--text";
  dark = false;
  full = false;
  input = "filled";
}

const inputs = {
  outlined: input == "outlined",
  filled: input == "filled",
  solo: input == "solo",
  color: dark ? "" : background,
};

export const APP_NAME = nombre_proyecto;
export const APP_COLOR = background;
export const APP_COLOR_TEXT = color_texto;
export const APP_DARK_MODE = dark;
export const APP_FULL_NAVIGATION = full;
export const APP_INPUT_MODE = input;
export const APP_INPUT_ATTRS = inputs;
