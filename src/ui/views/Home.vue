<template>
  <div class="main-container">
    <HelloWorld/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '../components/HelloWorld.vue'

export default {
  name: 'main-container',
  components: {
    HelloWorld
  }
}
</script>
