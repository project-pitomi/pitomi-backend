import { GraphQLSchema } from "graphql";
import query from "./query.mjs";
import mutation from "./mutation.mjs";

export default new GraphQLSchema({
  query,
  mutation,
});
