import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
} from "graphql";

const ConnectionType = (name, nodeType) => {
  const edgeType = new GraphQLObjectType({
    name: `${name}Edge`,
    fields: () => ({
      node: { type: GraphQLNonNull(nodeType) },
    }),
  });

  return new GraphQLObjectType({
    name: `${name}Connection`,
    fields: () => ({
      totalCount: { type: GraphQLNonNull(GraphQLInt) },
      edges: {
        type: GraphQLNonNull(GraphQLList(edgeType)),
      },
    }),
  });
};

const buildConnection = (totalCount, nodes) => {
  return {
    totalCount,
    edges: nodes.map((node) => ({ node })),
  };
};

export { ConnectionType, buildConnection };
