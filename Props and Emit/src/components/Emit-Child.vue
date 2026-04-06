<script setup>
import { ref } from 'vue';

const nameInput = ref("")

const emit = defineEmits(
    ["update-name"]
)

const handleSubmit=()=>{
    console.log(nameInput)
    emit('update-name',nameInput.value)
}


</script>
<template>
    <p>This is chid Emit</p>
    <input type="text" v-model="nameInput" placeholder="Enter your name ">
    <button @click="handleSubmit" >Submit</button>
</template>