<!-- <script>
export default{
  data(){
    debugger
    return{
      name: "Umar",
      status: "pending" ,
      tasks: ['task 1','task 2','task 3'],
      link: "https://Google.com"
    }
  },
    methods:{
      toggleStatus(){
        if(this.status === "active"){
          this.status = "pending"
        }
        else if(this.status === "pending"){
          this.status = "inactive"
        }
        else{
          this.status = "active"
        }
      }
    }
}
</script>

<template>
  <h1>{{ name }}</h1>
  <p v-if="status === 'active'">User is Active</p>
  <p v-else-if="status === 'pending'">User is Pending</p>
  <p v-else="status">User is Inactive</p>
  <h3>Tasks</h3>
  <ul>
    <li v-for="task in tasks" :key="task">{{ task }}</li>
  </ul>
  <!-- <a v-bind:href="link">Click for Google</a> -->
  <a :href="link">Click for Google</a>
  <br>
  <!-- <button v-on:click="toggleStatus" >change status</button> -->
  <button @click="toggleStatus" >change status</button>

</template>

<style scoped>
  h1{
    color: red;
  }
</style>

<script setup>
import {ref, onMounted} from 'vue'

// export default{
//   setup(){
    const name = ref('john doe')
    const status = ref('active')
    const tasks = ref(['task 1', 'task 2', 'task 3'])
    const newTask = ref('')

      const toggleStatus = () => {
        if(status.value === "active"){
          status.value = "pending"
        }
        else if(status.value === "pending"){
          status.value = "inactive"
        }
        else{
          status.value = "active"
        }
      } 

      const addTask = () => {
        if(newTask.value.trim !== ''){
          tasks.value.push(newTask.value)
          newTask.value = ''
        }
      }

      const deleteTask = (index) => {
        tasks.value.splice(index,1)
       
      }

      onMounted(async () => {
        try {
          const response = await fetch("https://dummyjson.com/quotes")
          const data = await response.json()
          console.log(data)
          tasks.value = [...tasks.value,...data.quotes.map((item) => item.quote
          
           )]

        } catch (error) {
          console.log("error fetching api")
        }
      })

</script>

<template>
  <h1>{{ name }}</h1>
  <p v-if="status === 'active'">User is Active</p>
  <p v-else-if="status === 'pending'">User is Pending</p>
  <p v-else="status">User is Inactive</p>

  <form @submit.prevent="addTask">
    <label for="newTask">Add Task</label>
    <input type="text" id="newTask" name="newTask" v-model="newTask">
    <button type="submit" >Submit</button>
  </form>
  <h3>Tasks</h3>
  <ul>
    <li v-for="(task, index) in tasks" :key="task">
      <span>
        {{ task }}
      </span>
      <button @click="deleteTask(index)">X</button>
    </li>
  </ul>

  <br>
  <!-- <button v-on:click="toggleStatus" >change status</button> -->
  <button @click="toggleStatus()" >change status</button>

</template>

<style scoped>
  h1{
    color: red;
  }
</style> -->