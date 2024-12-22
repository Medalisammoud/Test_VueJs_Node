// src/apolloClient.js
import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client/core';

const token = 'Bearer admin';

const client = new ApolloClient({
  link: new HttpLink({
    uri: 'http://localhost:4000/graphql',
    headers: {
      Authorization: token,
    },
  }),
  cache: new InMemoryCache(),
});

export default client;
