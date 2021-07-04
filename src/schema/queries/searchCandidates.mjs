import { GraphQLNonNull, GraphQLList } from "graphql";

import SearchCandidateType from "../types/searchCandidate.mjs";

const ARTIST = 0;
const GROUP = 1;
const SERIES = 2;
const TYPE = 3;
const TAG = 4;
const TAG_MALE = 5;
const TAG_FEMALE = 6;

const tagTypeToSearchCandidateType = {
  null: TAG,
  male: TAG_MALE,
  female: TAG_FEMALE,
};

const searchCandidates = {
  type: GraphQLNonNull(GraphQLList(GraphQLNonNull(SearchCandidateType))),
  resolve: async (_parent, _args, { isAuthenticated, repository }) => {
    if (!isAuthenticated) throw Error("Authentication failed");
    const { Artist, Group, Series, Type, Tag } = repository;
    const [artists, groups, series, types, tags] = await Promise.all([
      Artist.find().select({ galleries: 0 }),
      Group.find().select({ galleries: 0 }),
      Series.find().select({ galleries: 0 }),
      Type.find().select({ galleries: 0 }),
      Tag.find().select({ galleries: 0 }),
    ]);

    return []
      .concat(artists.map(({ artist }) => ({ value: artist, type: ARTIST })))
      .concat(groups.map(({ group }) => ({ value: group, type: GROUP })))
      .concat(series.map(({ series }) => ({ value: series, type: SERIES })))
      .concat(types.map(({ type }) => ({ value: type, type: TYPE })))
      .concat(
        tags.map(({ tagName, tagType }) => ({
          value: tagName,
          type: tagTypeToSearchCandidateType[tagType],
        }))
      );
  },
};

export default searchCandidates;
