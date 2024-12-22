<template>
      <input
        type="text"
        v-model="query"
        @input="onSearch(query)"
        placeholder="Search products..."
        class="w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
  </template>
  
  <script>
  export default {
    name: "SearchBar",
    data() {
      return {
        query: "",
      };
    },
    methods: {
      onSearch(query) {
        this.$emit("onSearch", query);
      },
    },
  };
  </script>
  
  <style scoped>
  @import '../assets/app.css';
  </style>
  