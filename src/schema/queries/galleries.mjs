import {
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
  GraphQLString,
  GraphQLInputObjectType,
} from "graphql";
import galleryType from "../types/gallery.mjs";
import { ConnectionType, buildConnection } from "../types/connection.mjs";

const inputTagType = new GraphQLInputObjectType({
  name: "InputTag",
  fields: () => ({
    tag: {
      type: GraphQLNonNull(GraphQLString),
    },
    male: {
      type: GraphQLInt,
    },
    female: {
      type: GraphQLInt,
    },
  }),
});

const galleryIdsByArtist = async (Artist, artist) => {
  const result = await Artist.findOne({ artist });
  if (result) return result.galleries;
  else return null;
};

const galleryIdsByGroup = async (Group, group) => {
  const result = await Group.findOne({ group });
  if (result) return result.galleries;
  else return null;
};

const galleryIdsByType = async (Type, type) => {
  const result = await Type.findOne({ type });
  if (result) return result.galleries;
  else return null;
};

const galleryIdsBySeries = async (Series, series) => {
  const result = await Series.findOne({ series });
  if (result) return result.galleries;
  else return null;
};

const galleryIdsByCharacter = async (Character, character) => {
  // const result = await Artist.findOne({ character });
  // if (result) return result.galleries;
  // else return null;
  return null;
};

const galleryIdsByTag = async (Tag, { tag, male, female }) => {
  const filter = { tagName: tag };
  if (male) filter.tagType = "male";
  else if (female) filter.tagType = "female";
  else filter.tagType = null;
  const result = await Tag.findOne(filter);
  if (result) return result.galleries;
  else return null;
};

const mergeGalleryIds = (...galleryIdsList) => {
  const ret = [];
  const validatedGalleryIdsList = galleryIdsList.filter(
    (galleryIds) => galleryIds
  );

  const sets = [];
  for (let i = 1; i < validatedGalleryIdsList.length; i++) {
    sets.push(new Set(validatedGalleryIdsList[i].map((id) => id.toString())));
  }

  for (const galleryId of validatedGalleryIdsList[0]) {
    let isValid = true;
    const sid = galleryId.toString();
    for (let i = 0; i < sets.length; i++) {
      isValid = sets[i].has(sid);
      if (!isValid) break;
    }
    if (isValid) ret.push(galleryId);
  }

  return ret;
};

const galleries = {
  type: GraphQLNonNull(ConnectionType("galleries", galleryType)),
  args: {
    offset: {
      defaultValue: 0,
      type: GraphQLNonNull(GraphQLInt),
    },
    count: {
      defaultValue: 10,
      type: GraphQLNonNull(GraphQLInt),
    },
    artists: {
      defaultValue: [],
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))),
    },
    groups: {
      defaultValue: [],
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))),
    },
    types: {
      defaultValue: [],
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))),
    },
    series: {
      defaultValue: [],
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))),
    },
    characters: {
      defaultValue: [],
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString))),
    },
    tags: {
      defaultValue: [],
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(inputTagType))),
    },
  },
  resolve: async (
    _,
    { offset, count, artists, groups, types, series, characters, tags },
    { isAuthenticated, repository }
  ) => {
    if (!isAuthenticated) throw Error("Authentication failed");
    if (10 < count) return null;

    const { Artist, Group, Type, Series, Tag, Gallery, Count } = repository;

    if (
      0 < artists.length ||
      0 < groups.length ||
      0 < types.length ||
      0 < series.length ||
      0 < characters.length ||
      0 < tags.length
    ) {
      const [
        idsByArtists,
        idsByGroups,
        idsByTypes,
        idsBySeries,
        idsByCharacters,
        idsByTags,
      ] = await Promise.all([
        Promise.all(
          artists.map((artist) => galleryIdsByArtist(Artist, artist))
        ),
        Promise.all(groups.map((group) => galleryIdsByGroup(Group, group))),
        Promise.all(types.map((type) => galleryIdsByType(Type, type))),
        Promise.all(series.map((s) => galleryIdsBySeries(Series, s))),
        Promise.all(
          characters.map((character) =>
            galleryIdsByCharacter(Character, character)
          )
        ),
        Promise.all(tags.map((tag) => galleryIdsByTag(Tag, tag))),
      ]);
      const ids = mergeGalleryIds(
        ...idsByTypes,
        ...idsByArtists,
        ...idsByGroups,
        ...idsByTypes,
        ...idsBySeries,
        ...idsByCharacters,
        ...idsByTags
      );
      const galleries = await Gallery.find({ _id: { $in: ids } })
        .sort({ origin_at: -1 })
        .skip(offset)
        .limit(count);
      const totalCount = ids.length;
      return buildConnection(totalCount, galleries);
    } else {
      const galleries = await Gallery.find({ status: "fetched" })
        .sort({ origin_at: -1 })
        .skip(offset)
        .limit(count);
      const { count: totalCount } = await Count.findOne({
        name: "status=fetched",
      });
      return buildConnection(totalCount, galleries);
    }
  },
};

export default galleries;
