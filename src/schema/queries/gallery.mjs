import { GraphQLID, GraphQLNonNull } from "graphql";
import galleryType from "../types/gallery.mjs";

const gallery = {
  type: galleryType,
  args: {
    id: {
      type: GraphQLNonNull(GraphQLID),
    },
  },
  resolve: async (_, { id }, { isAuthenticated, repository }) => {
    if (isAuthenticated) throw Error("Authentication failed");
    const { Gallery } = repository;
    return await Gallery.findOne({ id: id });
  },
};

export default gallery;
