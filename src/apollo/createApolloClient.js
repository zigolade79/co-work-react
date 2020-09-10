import { ApolloClient, InMemoryCache } from "@apollo/client";
import { resolvers, typeDefs } from "./resolvers";

const cache = new InMemoryCache();

const client = new ApolloClient({
  cache: cache,
  uri: "http://localhost:3000/graphql",
  typeDefs,
  resolvers,
});
/*
import ApolloClient from "apollo-boost";
import { ApolloProvider, useQuery, useApolloClient } from '@apollo/client'

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
});
*/

export default client;
