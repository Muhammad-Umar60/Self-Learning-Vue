<script>
export default{
  data(){
    return{
      name: "Umar",
      status: true ,
    }
  }
}
</script>

<template>
  <h1>{{ name }}</h1>
  <p v-if="status">User is Active</p>
</template>

<style scoped>
  h1{
    color: red;
  }
</style>