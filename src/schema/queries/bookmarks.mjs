import { GraphQLInt, GraphQLNonNull } from "graphql";
import GalleryType from "../types/gallery.mjs";
import { ConnectionType } from "../types/connection.mjs";
import { buildConnection } from "../types/connection.mjs";

const bookmarks = {
  type: GraphQLNonNull(ConnectionType("bookmarks", GalleryType)),
  args: {
    offset: {
      defaultValue: 0,
      type: GraphQLNonNull(GraphQLInt),
    },
    count: {
      defaultValue: 10,
      type: GraphQLNonNull(GraphQLInt),
    },
  },
  resolve: async (
    _,
    { offset, count },
    { isAuthenticated, userId, repository }
  ) => {
    if (!isAuthenticated) throw Error("Authentication failed");
    if (10 < count) return null;

    const { Bookmark, Gallery } = repository;

    const bookmarks = await Bookmark.find({ userId })
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(count);
    const galleryIds = bookmarks.map(({ galleryId }) => galleryId);
    const order = galleryIds.reduce((dict, elem, idx) => {
      dict[elem] = idx;
      return dict;
    }, {});

    const galleries = await Gallery.find({ _id: { $in: galleryIds } });
    galleries.sort((u, v) => {
      return order[u._id] - order[v._id];
    });

    const totalCount = await Bookmark.countDocuments({ userId });

    return buildConnection(totalCount, galleries);
  },
};

export default bookmarks;
