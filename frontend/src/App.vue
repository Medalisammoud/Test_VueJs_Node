<template>
  <div class="min-h-screen bg-gray-50">
    <h1 class="text-3xl font-bold text-center mt-6 mb-4 text-gray-800">
      Products
    </h1>

    <div v-if="loading" class="text-center text-gray-500">Loading...</div>
    <div v-if="error" class="text-center text-red-500">
      Error fetching products
    </div>

    <div v-if="!loading && !error" class="px-4 sm:px-8 md:px-16 space-y-8">
      <div class="flex justify-between items-center">
        <SearchBar @onSearch="handleSearch" class="w-full md:w-1/2" />
        <Filter
          :categories="categories"
          @onFilter="handleFilter"
          class="w-full md:w-1/2"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductList
          :products="filteredProducts"
          :isAdmin="isAdmin"
          :categories="categories"
          @updateProduct="updateProduct"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { gql } from "graphql-tag";
import { useQuery } from "@vue/apollo-composable";
import SearchBar from "./components/SearchBar.vue";
import Filter from "./components/Filter.vue";
import ProductList from "./components/ProductList.vue";

// GraphQL Query
const GET_PRODUCTS = gql`
  query {
    products {
      id
      name
      price
      categoryId
    }
  }
`;

export default {
  name: "App",
  components: { SearchBar, Filter, ProductList },
  setup() {
    const { result, loading, error } = useQuery(GET_PRODUCTS);

    // Reactive state
    const searchQuery = ref("");
    const filters = ref({ category: "", minPrice: null, maxPrice: null });
    const filteredProducts = ref([]);
    const isAdmin = ref(true); // Change this value based on the user's role

    // Watch for changes in the query result
    watch(
      result,
      (newResult) => {
        if (newResult && newResult.products) {
          filteredProducts.value = newResult.products;
        }
      },
      { immediate: true }
    );

    // Compute categories dynamically
    const categories = computed(() => {
      return result.value?.products
        ? [...new Set(result.value.products.map((p) => p.categoryId))]
        : [];
    });

    // Filtering logic
    const applyFilters = () => {
      if (!result.value?.products) return;

      filteredProducts.value = result.value.products.filter((product) => {
        const matchesSearch =
          !searchQuery.value ||
          product.name.toLowerCase().includes(searchQuery.value.toLowerCase());
        const matchesCategory =
          !filters.value.category ||
          product.categoryId === filters.value.category;
        const matchesPrice =
          (!filters.value.minPrice ||
            product.price >= filters.value.minPrice) &&
          (!filters.value.maxPrice || product.price <= filters.value.maxPrice);

        return matchesSearch && matchesCategory && matchesPrice;
      });
    };

    // Event handlers
    const handleSearch = (query) => {
      searchQuery.value = query;
      applyFilters();
    };

    const handleFilter = (newFilters) => {
      filters.value = newFilters;
      applyFilters();
    };
    const updateProduct = (updatedProduct) => {
      const productIndex = result.value.products.findIndex(
        (p) => p.id === updatedProduct.id
      );
      if (productIndex !== -1) {
        result.value.products[productIndex] = updatedProduct;
      }
    };

    const updateProductName = (productId, newName) => {
      const product = result.value.products.find((p) => p.id === productId);
      if (product) {
        // Update the product name
        const updatedProduct = { ...product, name: newName, isEditing: false };
        // Optionally make an API call to update the product on the server
        // After updating locally, reapply filters
        const index = result.value.products.findIndex(
          (p) => p.id === productId
        );
        result.value.products[index] = updatedProduct;
      }
      applyFilters();
    };

    return {
      loading,
      error,
      filteredProducts,
      categories,
      isAdmin,
      handleSearch,
      handleFilter,
      updateProductName,
    };
  },
};
</script>

<style scoped>
@import "./assets/app.css";
</style>
