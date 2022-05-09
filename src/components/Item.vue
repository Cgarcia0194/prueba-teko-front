<template>
  <v-list-group
    v-if="node.es_menu == 'Si'"
    :value="false"
    :prepend-icon="node.icono"
    :color="APP_DARK_MODE ? '' : APP_COLOR"
    no-action
    :sub-group="isSub"
  >
    <template v-slot:activator>
      <v-list-item-title> {{ node.name }} </v-list-item-title>
    </template>

    <Item v-for="child in node.children" :key="child._id" :node="child" :isSub="true"/>
  </v-list-group>

  <router-link v-else :to="node.path">
    <v-list-item link :color="APP_DARK_MODE ? '' : APP_COLOR">
      <v-list-item-icon>
        <v-icon v-text="node.icono"></v-icon>
      </v-list-item-icon>
      <v-list-item-title v-text="node.name"></v-list-item-title>
    </v-list-item>
  </router-link>
</template>

<script>
import {
  APP_NAME,
  APP_COLOR,
  APP_COLOR_TEXT,
  APP_DARK_MODE,
  APP_FULL_NAVIGATION,
} from "@/helpers/theme";

export default {
  name: "Item",
  components: {},
  props: {
    node: {
      type: Object,
    },
    isSub: {
      type: Boolean,
    },
  },
  data: () => ({
    APP_NAME: APP_NAME,
    APP_COLOR: APP_COLOR,
    APP_COLOR_TEXT: APP_COLOR_TEXT,
    APP_DARK_MODE: APP_DARK_MODE,
    APP_FULL_NAVIGATION: APP_FULL_NAVIGATION,
  }),
};
</script>
