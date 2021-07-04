import { GraphQLObjectType } from "graphql";
import gallery from "./queries/gallery.mjs";
import galleries from "./queries/galleries.mjs";
import bookmarks from "./queries/bookmarks.mjs";
import searchCandidates from "./queries/searchCandidates.mjs";

export default new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    gallery,
    galleries,
    bookmarks,
    searchCandidates,
  }),
});
