const { createTestClient } = require("apollo-server-testing");
const models = require("../models");
const server = require("../server");
const gql = require("graphql-tag");

const ALL_LINKS = gql`
  query allLinks {
    links {
      target
      slug
    }
  }
`;
describe("Queries", () => {
  let testClient = null;
  let transaction = null;
  beforeEach(async () => {
    await server.start();
    // transaction = await models.sequelize.transaction();
    testClient = createTestClient(server.instance);
  });

  it("returns all link", async () => {
    await models.sequelize.getQueryInterface().bulkInsert(
      "Links",
      addTimestamps([
        {
          target: "https://google.com",
          slug: "search"
        },
        {
          target: "https://twitter.com",
          slug: "discuss"
        }
      ])
    );
    const links = await testClient.query({ query: ALL_LINKS });
    expect(links.data.links).toEqual([
      {
        slug: "search",
        target: "https://google.com"
      },
      {
        slug: "discuss",
        target: "https://twitter.com"
      }
    ]);
  });

  afterEach(async () => {
    // await transaction.rollback();
    await server.stop();
  });
});

function addTimestamps(list) {
  return list.map((object) => ({
    ...object,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
}
