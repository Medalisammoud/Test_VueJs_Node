import { createApp, h } from "vue";
import App from "./App.vue";
import { provideApolloClient } from "@vue/apollo-composable";
import "./assets/main.css"
import client from './apolloClient';


// Create the Vue app and provide Apollo Client
const app = createApp({
  render: () => h(App),
});

// Provide Apollo Client to the app
provideApolloClient(client);

// Mount the app
app.mount("#app");
