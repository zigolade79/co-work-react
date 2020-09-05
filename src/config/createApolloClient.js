import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://48p1r2roz4.sse.codesandbox.io",
  cache: new InMemoryCache(),
});
/*
import ApolloClient from "apollo-boost";
import { ApolloProvider, useQuery, useApolloClient } from '@apollo/client'

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
});
*/
export default client;
