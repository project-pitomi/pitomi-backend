import {
  GraphQLNonNull,
  GraphQLString,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
} from "graphql";
import mongoose from "mongoose";
import GalleryType from "../types/gallery.mjs";

const SetBookmarkResult = new GraphQLObjectType({
  name: "SetBookmarkResult",
  fields: () => ({
    isSuccess: {
      type: GraphQLNonNull(GraphQLBoolean),
      description: "Is mutation work properly?",
    },
    setBookmark: { type: GalleryType },
  }),
});

const setBookmark = {
  type: SetBookmarkResult,
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
      const result = await Bookmark.create({
        userId: mongoose.Types.ObjectId(userId),
        galleryId: gallery._id,
      });
      return { isSuccess: true, setBookmark: gallery };
    } catch (error) {
      return { isSuccess: false, setBookmark: null };
    }
  },
};

export default setBookmark;
