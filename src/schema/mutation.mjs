import { GraphQLObjectType } from "graphql";
import login from "./mutations/login.mjs";
import setBookmark from "./mutations/setBookmark.mjs";
import unsetBookmark from "./mutations/unsetBookmark.mjs";

export default new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    login,
    setBookmark,
    unsetBookmark,
  }),
});
