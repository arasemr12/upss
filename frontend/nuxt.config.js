require('dotenv').config();

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'upss',
    htmlAttrs: {
      lang: 'en',
      prefix:"og: https://ogp.me/ns#",
    },
    meta: [
      { "http-equiv":"X-UA-Compatible", content:"IE=edge"},
      { charset: 'UTF-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { property: 'og:title', content: 'UPSS' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://upss.ga/' },
      { property: 'og:description', content: 'The best anonymous social media.' },
      { hid: 'description', name: 'description', content: 'The best anonymous social media.' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel:"stylesheet", href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.2/css/all.min.css", integrity:"sha512-1sCRPdkRXhBV2PBLUdRb4tMg1w2YPf37qatUFeS7zlBy7jJI8Lf4VHwWfZZfpXtYSLy85pkm9GaYVYMfw5BC1A==", crossorigin:"anonymous", referrerpolicy:"no-referrer" }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    "@assets/css/main.css"
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    '@nuxt/postcss8',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next'
  ],

  axios: {
    baseURL: process.env.API_URL
  },

  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
          required:true,
          name:'Authorization',
          type:'Bearer',
          maxAge:2592000
          // required: true,
          // type: 'Bearer'
        },
        user: {
          property: 'user',
          autoFetch: true
        },
        endpoints: {
          login: { url: '/api/auth/login', method: 'post' },
          logout: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/auth/user', method: 'get' }
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },

  loading: {
    color: 'rgb(50, 200, 50)',
    height: '2px',
    throttle: 0
  }
}
