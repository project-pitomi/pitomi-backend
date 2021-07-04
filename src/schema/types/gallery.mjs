import {
  GraphQLID,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLBoolean,
} from "graphql";

import tagType from "./tag.mjs";

const gallery = new GraphQLObjectType({
  name: "Gallery",
  fields: () => ({
    id: {
      type: GraphQLNonNull(GraphQLInt),
      description: "ID of the gallery",
    },
    title: {
      type: GraphQLNonNull(GraphQLString),
      description: "Title of gallery",
    },
    artists: {
      type: GraphQLList(GraphQLNonNull(GraphQLString)),
      description: "artists of gallery",
    },
    group: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))),
      description: "groups of artists of gallery",
    },
    type: {
      type: GraphQLString,
      description: "Type of gallery",
    },
    series: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))),
      description: "series of gallery",
    },
    characters: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))),
      description: "characters in gallery",
    },
    origin_at: {
      type: GraphQLNonNull(GraphQLString),
      description: "Date in origin of gallery",
    },
    status: {
      type: GraphQLNonNull(GraphQLString),
      description: "Status of gallery",
    },
    inserted_at: {
      type: GraphQLNonNull(GraphQLString),
      description: "Date when gallery inserted",
    },
    tags: {
      type: GraphQLList(GraphQLNonNull(tagType)),
      description: "Tags of gallery",
    },
    thumbnail: {
      type: GraphQLNonNull(GraphQLString),
      description: "Thumbnail(1st image) of gallery",
      resolve: async (gallery, _, context) => {
        const { blobServiceClient, blobUriGenerator } = context;
        const { container_name, blob_names } = gallery;
        return blobUriGenerator(
          blobServiceClient,
          container_name,
          blob_names[0]
        );
      },
    },
    thumbnail_webp: {
      type: GraphQLString,
      description: "Thumbnail(1st image) of gallery",
      resolve: async (gallery, _, context) => {
        const { blobServiceClient, blobUriGenerator } = context;
        const { container_name, blob_names_webp } = gallery;
        if (blob_names_webp && 0 < blob_names_webp.length)
          return blobUriGenerator(
            blobServiceClient,
            container_name,
            blob_names_webp[0]
          );
        return null;
      },
    },
    images: {
      type: GraphQLList(GraphQLNonNull(GraphQLString)),
      description: "Images in gallery",
      resolve: async (gallery, _, context) => {
        const { blobServiceClient, blobUriGenerator } = context;
        const { container_name, blob_names } = gallery;
        const uris = blob_names.map((blobName) =>
          blobUriGenerator(blobServiceClient, container_name, blobName)
        );
        return uris;
      },
    },
    images_webp: {
      type: GraphQLList(GraphQLNonNull(GraphQLString)),
      description: "Images(webp) in gallery",
      resolve: async (gallery, _, context) => {
        const { blobServiceClient, blobUriGenerator } = context;
        const { container_name, blob_names_webp } = gallery;
        const uris = (blob_names_webp || []).map((blobName) =>
          blobUriGenerator(blobServiceClient, container_name, blobName)
        );
        return uris;
      },
    },
    isBookmarked: {
      type: GraphQLNonNull(GraphQLBoolean),
      resolve: async ({ _id }, _, { loader: { Bookmark: bookmarkLoader } }) => {
        const bookmark = await bookmarkLoader.load(_id);
        return !!bookmark;
      },
    },
  }),
});

export default gallery;
