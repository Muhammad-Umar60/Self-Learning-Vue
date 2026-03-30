<script setup>
import Hero from '../components/Hero.vue';
import HomeCard from '../components/HomeCard.vue';
import JobListings from '../components/JobListings.vue';

</script>

<template>
    <Hero title="Test Title" subtitle="it is a subtitle"/>
    <HomeCard/>
    <JobListings :limit="3" :show-button="true"/>

</template>