const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { ApolloGateway, IntrospectAndCompose } = require('@apollo/gateway');
const http = require('http');

// Use IntrospectAndCompose to replace serviceList
const supergraph = new IntrospectAndCompose({
  subgraphs: [
    { name: 'products', url: 'http://localhost:4001/graphql' },
    { name: 'category', url: 'http://localhost:4002/graphql' },
  ],
});

const gateway = new ApolloGateway({
  supergraphSdl: supergraph,
  // You can set this to true if you need introspection on the Gateway
  introspection: true,
  subscriptions: false, // Set to false if you don't need subscriptions
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  // Optional: add context and logging as needed
  context: ({ req }) => {
    return {
      headers: req.headers, // You can add custom context if required
    };
  },
});

async function startServer() {
  await server.start();

  const app = express();

  // Apply Apollo Server middleware to Express
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(4000, () => {
    console.log(`Gateway running at http://localhost:4000/graphql`);
  });
}

startServer();
