<script setup>
import ChildProp from '@/components/Child-Prop.vue';
import EmitChild from '@/components/Emit-Child.vue';
import EmitParent from '@/components/Emit-Parent.vue';
import ParentProp from '@/components/Parent-Prop.vue';




</script>
<template>

<ParentProp/>
<ChildProp/>

<EmitParent/>
<EmitChild/>

</template>