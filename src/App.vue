<template>
  <router-view v-if="isRouterActive"></router-view>
</template>
<script lang="ts" setup>
import { ref, provide, nextTick, watch } from 'vue'
import router from './router';
const isRouterActive = ref(true)
const reload= () => {
isRouterActive.value = false

nextTick(() => {
  location.reload()
  isRouterActive.value = true
})
}
provide('reload',reload)

</script>


<style lang="scss">
#app {
font-family: Avenir, Helvetica, Arial, sans-serif;
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
color: #2c3e50;
height:100vh;

}
*{
padding:0;
margin:0;
}
nav {
padding: 30px;

a {
  font-weight: bold;
  color: #2c3e50;

  &.router-link-exact-active {
    color: #42b983;
  }
}
}
</style>
