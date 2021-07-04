import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLEnumType,
} from "graphql";

const searchCandidate = new GraphQLObjectType({
  name: "SearchCandidate",
  fields: () => ({
    value: {
      type: GraphQLNonNull(GraphQLString),
    },
    type: {
      type: GraphQLNonNull(
        new GraphQLEnumType({
          name: "SearchCandidateType",
          values: {
            ARTIST: { value: 0 },
            GROUP: { value: 1 },
            SERIES: { value: 2 },
            TYPE: { value: 3 },
            TAG: { value: 4 },
            TAG_MALE: { value: 5 },
            TAG_FEMALE: { value: 6 },
          },
        })
      ),
    },
  }),
});

export default searchCandidate;
