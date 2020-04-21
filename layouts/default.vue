<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" fixed app>
      <v-list>
        <template v-for="(item, i) in items">
          <v-list-item
            v-if="isShowMenuItem(item)"
            :key="i"
            :to="item.to"
            router
            exact
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title" />
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>mdi-{{ `chevron-${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-toolbar-title v-text="title" />
    </v-app-bar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: false,
      items: [
        {
          icon: 'mdi-login',
          title: 'Login',
          to: '/login',
          requrieNoLogin: true
        },
        {
          icon: 'mdi-file-document-edit',
          title: 'Write',
          to: '/write',
          requireLogin: true
        },
        {
          icon: 'mdi-format-list-bulleted-type',
          title: 'Record',
          to: '/record',
          requireLogin: true
        },
        {
          icon: 'mdi-logout',
          title: 'Logout',
          to: '/logout',
          requireLogin: true
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Day has a Name'
    }
  },
  methods: {
    isShowMenuItem(item) {
      if (item.requireLogin === true) {
        return !!this.$store.state.token
      } else if (item.requrieNoLogin === true) {
        return !this.$store.state.token
      }
      return true
    }
  }
}
</script>
