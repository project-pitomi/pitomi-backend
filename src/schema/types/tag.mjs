import {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
} from "graphql";

const tagType = new GraphQLObjectType({
  name: "Tag",
  fields: () => ({
    tag: {
      type: GraphQLNonNull(GraphQLString),
      description: "Tag name",
    },
    male: {
      type: GraphQLInt,
      description: "is male tag",
    },
    female: {
      type: GraphQLInt,
      description: "is female tag",
    },
  }),
});

export default tagType;
