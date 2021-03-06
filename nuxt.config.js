import nodeExternals from "webpack-node-externals";
import VuetifyLoaderPlugin from "vuetify-loader/lib/plugin";
import path from 'path'
import fs from 'fs'
require("dotenv").config();

let settings = {
  // https://nuxtjs.org/api/configuration-modern
  mode: 'universal',
  modern: true,
  serverMiddleware: ['~/server/index.js'],
  server: {
    port: process.env.PORT, // default: 3000
    host: process.env.HOST // default: localhost
  },

  // https://nuxtjs.org/api/configuration-head
  head: {
    titleTemplate: title =>
      title ? `${title} | Freelo` : "Freelo",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" }
    ]
  },

  // https://nuxtjs.org/api/configuration-modules
  modules: [
    "vue-scrollto/nuxt",

    // https://axios.nuxtjs.org/
    "@nuxtjs/axios",

    // https://nuxtjs.org/faq/cached-components/
    "@nuxtjs/component-cache",

    // https://github.com/nuxt-community/dotenv-module
    "@nuxtjs/dotenv",

    // https://pwa.nuxtjs.org/
    "@nuxtjs/pwa",

    // https://github.com/nuxt-community/sitemap-module
    "@nuxtjs/sitemap",

    // https://github.com/nuxt-community/sentry-module
    // "@nuxtjs/sentry",

    // https://github.com/Developmint/nuxt-webfontloader
    "nuxt-webfontloader",

    // https://www.npmjs.com/package/nuxt-client-init-module
    'nuxt-client-init-module'

    // https://github.com/nuxt-community/analytics-module
    // [
    //   "@nuxtjs/google-analytics",
    //   {
    //     // TODO: Change this id to your Google Analytics ID
    //     id: process.env.GOOGLE_ANALYTICS
    //   }
    // ]
  ],


  manifest: {
		name: "Freelo",
		short_name: "Freelo",
		theme_color: "#0A2342",
		background_color: "#FAFAFA",
		display: "standalone",
		scope: "/",
		start_url: "/"
  },

  webfontloader: {
    google: {
      families: ["Roboto:100,300,400,500,700,900", "Material+Icons"]
    }
  },

  // https://nuxtjs.org/api/configuration-plugins
  plugins: ["~/plugins/vuetify", "~/plugins/vee-validate", "~/plugins/vue-timeago"],

  // https://nuxtjs.org/api/configuration-css
  css: ["~/assets/styles/vuetify.styl"],

  // https://nuxtjs.org/api/configuration-watch
  watch: ["~/vuex/**/*.js"],

  // https://nuxtjs.org/api/configuration-build
  build: {
    extractCSS: true,
    transpile: [/^vuetify/],
    plugins: [new VuetifyLoaderPlugin()],
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /node_modules/,
          options: {
            fix: true
          }
        });
      }
      if (process.server) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ];
      }
    }
  }
}

// Set certificates for CloudFlare SSL
if(process.env.NODE_ENV === 'production') {
  settings.server.https = {
    cert: fs.readFileSync(path.resolve(__dirname, 'certs/freelo.renkee.eu.pem'), 'utf8'),
    key: fs.readFileSync(path.resolve(__dirname, 'certs/freelo.renkee.eu.key'), 'utf8')
  }
}



export default settings;
