import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";

const authorization = new GraphQLObjectType({
  name: "Authorization",
  fields: () => ({
    token: {
      type: GraphQLNonNull(GraphQLString),
      description: "Authorization token for user account",
    },
  }),
});

export default authorization;
