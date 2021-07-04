import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
} from "graphql";
import mongoose from "mongoose";
import GalleryType from "../types/gallery.mjs";

const UnsetBookmarkResult = new GraphQLObjectType({
  name: "UnsetBookmarkResult",
  fields: () => ({
    isSuccess: {
      type: GraphQLNonNull(GraphQLBoolean),
      description: "Is mutation work properly?",
    },
    unsetBookmark: { type: GalleryType },
  }),
});

const unsetBookmark = {
  type: UnsetBookmarkResult,
  args: {
    galleryId: {
      type: GraphQLNonNull(GraphQLInt),
    },
  },
  resolve: async (
    _,
    { galleryId },
    { isAuthenticated, userId, repository: { Gallery, Bookmark } }
  ) => {
    if (!isAuthenticated) throw Error("Authentication failed");

    const gallery = await Gallery.findOne({ id: galleryId });
    if (!gallery) return { isSuccess: false, setBookmark: null };

    try {
      const { ok } = await Bookmark.deleteOne({
        userId: mongoose.Types.ObjectId(userId),
        galleryId: gallery._id,
      });
      return { isSuccess: ok, unsetBookmark: gallery };
    } catch (error) {
      return { isSuccess: false, setBookmark: null };
    }
  },
};

export default unsetBookmark;
