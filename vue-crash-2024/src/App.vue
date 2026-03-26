<script>
export default{
  data(){
    return{
      name: "Umar",
      status: "active" ,
    }
  }
}
</script>

<template>
  <h1>{{ name }}</h1>
  <p v-if="status === 'active'">User is Active</p>
  <p v-else-if="status === 'pending'">User is pending</p>
  <p v-else="status">User is inactive</p>
</template>

<style scoped>
  h1{
    color: red;
  }
</style>