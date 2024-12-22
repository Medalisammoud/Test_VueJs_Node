<template>
  <div class="flex justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-md">
    <div class="flex flex-col items-start">
      <label for="category" class="text-sm font-medium text-gray-700 mb-1">Category</label>
      <select
        id="category"
        v-model="selectedCategory"
        @change="onFilter"
        class="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Category</option>
        <option
          v-for="category in categories"
          :key="category"
          :value="category"
        >
          {{ category }}
        </option>
      </select>
    </div>

    <div class="flex flex-col items-start">
      <label for="min-price" class="text-sm font-medium text-gray-700 mb-1">Min Price</label>
      <input
        id="min-price"
        v-model="minPrice"
        @input="onFilter"
        type="number"
        placeholder="Min Price"
        class="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div class="flex flex-col items-start">
      <label for="max-price" class="text-sm font-medium text-gray-700 mb-1">Max Price</label>
      <input
        id="max-price"
        v-model="maxPrice"
        @input="onFilter"
        type="number"
        placeholder="Max Price"
        class="py-2 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
</template>




<script>
export default {
  name: "Filter",
  props: {
    categories: Array,
  },
  data() {
    return {
      selectedCategory: "",
      minPrice: null,
      maxPrice: null,
    };
  },
  methods: {
    onFilter() {
      this.$emit("onFilter", {
        category: this.selectedCategory,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
      });
    },
  },
};
</script>

<style scoped>
@import '../assets/app.css';
</style>
