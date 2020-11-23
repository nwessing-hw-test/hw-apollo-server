const { ApolloServer, gql } = require("apollo-server");
const {
  noSubselectionAllowedMessage
} = require("graphql/validation/rules/ScalarLeafs");
const { Sequelize } = require("sequelize");
const connectionConfig = require("./config/config.json").development;
const { Link } = require("./models");

const sequelize = new Sequelize(connectionConfig);

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("database connection established");
  } catch (error) {
    console.error("failed to connect to the database", error);
  }
};
connectToDatabase();

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
    createLink(target: String!): Link
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
      return null;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
