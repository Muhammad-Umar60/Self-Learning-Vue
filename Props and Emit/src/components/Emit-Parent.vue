<script setup>
import { ref } from 'vue';
import EmitChild from './Emit-Child.vue';

const name = ref("")

const handleName = (value)=>{
    name.value = value
}

</script>
<template>
    <p>This is Emit Parent</p>
    <EmitChild @update-name="handleName"/>
    <p>The user name is {{name}}</p>
</template>