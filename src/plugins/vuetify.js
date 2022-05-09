import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
//import VueI18n from 'vue-i18n';

Vue.use(Vuetify);
//Vue.use(VueI18n);

/*const messages = {
    mx: {
        $vuetify: {
            dataTable: {
                itemsPerPageText: 'Filas por página:',
            },
            dataFooter: {
                pageText: '{0}-{1} of {2}',
            },
        },
    }
};

const i18n = new VueI18n({
    locale: 'mx',
    messages,
});*/

export default new Vuetify({
    /*lang: {
        t: (key, ...params) => i18n.t(key, params),
    },*/
})