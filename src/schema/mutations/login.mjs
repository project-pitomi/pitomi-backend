import { GraphQLNonNull, GraphQLString } from "graphql";
import authorizationType from "../types/authorization.mjs";

const gallery = {
  type: authorizationType,
  args: {
    username: {
      type: GraphQLNonNull(GraphQLString),
    },
    password: {
      type: GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (
    _,
    { username, password },
    { repository: { User, Authorization } }
  ) => {
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) return null;
    const { _id } = user;
    const authorization = await Authorization.create({ user_id: _id });
    return authorization;
  },
};

export default gallery;
