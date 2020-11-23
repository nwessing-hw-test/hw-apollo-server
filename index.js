const { ApolloServer, gql } = require("apollo-server");
const { Sequelize } = require("sequelize");
const connectionConfig = require("./config/config.json").development;

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
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (root, args, context) => "Hello world!"
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
