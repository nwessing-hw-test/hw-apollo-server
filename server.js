const { ApolloServer, gql } = require("apollo-server");
const { nanoid } = require("nanoid");

const { Link } = require("./models");

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Link {
    target: String!
    slug: String!
  }

  type Query {
    hello: String
    links: [Link]
    link(slug: String!): Link
  }
  type Mutation {
    createLink(target: String!, slug: String): Link
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (root, args, context) => "Hello world!",
    links: async () => {
      return await Link.findAll();
    },
    link: async (root, args, context) => {
      const { slug } = args;
      return await Link.findOne({ where: { slug } });
    }
  },
  Mutation: {
    createLink: async (root, args, context) => {
      const { target, slug: userSlug } = args;
      // URL constructor will throw exception if its not a valid URL
      const url = new URL(target);

      const link = Link.build({
        target: url.toString(),
        slug: userSlug || nanoid(8)
      });
      await link.save();
      return link;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

module.exports = {
  start: () => {
    return server
      .listen({ port: process.env.NODE_ENV === "test" ? 5000 : 4000 })
      .then(({ url }) => {
        console.log(`🚀 Server ready at ${url}`);
      });
  },
  stop: () => {
    return server.stop();
  },
  instance: server
};
