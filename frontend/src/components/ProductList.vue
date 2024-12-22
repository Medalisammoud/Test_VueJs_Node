<template>
  <div class="product-list grid gap-6">
    <div
      v-for="product in products"
      :key="product.id"
      class="bg-white p-4 rounded-lg shadow-md hover:bg-gray-50"
    >
      <div class="flex justify-between items-center">
        <div>
          <!-- Display either input or text based on isEditing -->
          <h3 v-if="!product.isEditing" class="text-xl font-semibold text-gray-800">
            {{ product.name }}
          </h3>
          
          <!-- Inputs for editing -->
          <div v-else>
            <input
              v-model="product.newName"
              class="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 mb-2"
            />
            <input
              v-model="product.newPrice"
              type="number"
              class="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 mb-2"
            />
            <select v-model="product.newCategoryId" class="mb-2 p-2 border-b-2 border-gray-300">
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <p v-if="!product.isEditing" class="text-gray-500">${{ product.price }}</p>
          <p v-if="!product.isEditing" class="text-sm text-gray-400">Category: {{ product.categoryId }}</p>
        </div>
        <div v-if="isAdmin">
          <button
            @click="toggleEdit(product)"
            class="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
          >
            {{ product.isEditing ? "Save" : "Edit" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProductList",
  props: {
    products: Array,
    isAdmin: Boolean,
    categories: Array, // Added categories prop to pass list of categories
  },
  toggleEdit(product) {
  console.log("🚀 ~ toggleEdit ~ product:", product);
  
  // Create a shallow copy of the product to avoid direct mutation
  const updatedProduct = { ...product, isEditing: !product.isEditing };

  if (updatedProduct.isEditing) {
    updatedProduct.newName = product.name; // Add newName property when editing starts
  } else {
    // Emit the updated product name when saved
    this.$emit("onUpdateProductName", product.id, updatedProduct.newName);
  }

  // Emit the updated product to the parent component
  this.$emit("updateProduct", updatedProduct); // Optionally update the parent component
}

};
</script>

<style scoped>
@import "../assets/app.css";
</style>
