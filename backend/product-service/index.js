const { ApolloServer } = require('apollo-server-express');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const { v4: uuidv4 } = require('uuid');
const gql = require('graphql-tag');
const express = require('express');

// Mock data
const products = [
  { id: uuidv4(), name: "Laptop", price: 1200.5, categoryId: "1" },
  { id: uuidv4(), name: "Phone", price: 800.3, categoryId: "2" },
];

const typeDefs = gql`
  type Product @key(fields: "id") {
    id: ID!
    name: String!
    price: Float!
    categoryId: ID!
  }

  extend type Query {
    products: [Product!]!
  }

  extend type Mutation {
    updateProductName(id: ID!, name: String!): Product!
  }
`;

const resolvers = {
  Query: {
    products: () => products,
  },
  Mutation: {
    updateProductName: (_, { id, name }) => {
      const product = products.find((p) => p.id === id);
      if (!product) throw new Error("Product not found");
      product.name = name;
      return product;
    },
  },
  Product: {
    __resolveReference: (reference) => {
      return products.find((product) => product.id === reference.id);
    },
  },
};

// Create the Apollo Server instance with Express integration
const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
  introspection: true, // Enable introspection
});

// Start the server with Express
async function startServer() {
  await server.start();

  const app = express();

  // Apply Apollo Server middleware to Express
  server.applyMiddleware({ app, path: '/graphql' });

  app.listen(4001, () => {
    console.log(`Products service running at http://localhost:4001/graphql`);
  });
}

startServer();
