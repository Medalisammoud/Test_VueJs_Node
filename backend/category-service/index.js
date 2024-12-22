const { buildSubgraphSchema } = require('@apollo/subgraph');
const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const gql = require('graphql-tag');
const http = require('http'); // Importing http module

const category= [
  { id: "1", name: "Electronics" },
  { id: "2", name: "Mobile Devices" },
];

const typeDefs = gql`
  type Category {
    id: ID!
    name: String!
  }
  
  type Query {
    category: [Category!]!
  }
`;

const resolvers = {
  Query: {
    category: () => category,
  },
};

/*const server = new ApolloServer({
  typeDefs,
  resolvers,
});*/

const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
    introspection: true, // Enable introspection
  });

// Start the server

async function startServer() {
    await server.start();
  
    const app = express();
  
    // Apply Apollo Server middleware to Express
    server.applyMiddleware({ app, path: '/graphql' });
  
    app.listen(4002, () => {
      console.log(`Category service running at http://localhost:4002/graphql`);
    });
  }
  
  startServer();
  