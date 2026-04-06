<script setup>
import ChildProp from './Child-Prop.vue';

const data = "Umar"

</script>

<template>
    <p>This is parent Prop</p>
    <ChildProp :value="data"/>
</template>