"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "Links",
      [
        {
          target: "https://google.com",
          slug: "search"
        },
        {
          target: "https://twitter.com",
          slug: "discuss"
        }
      ].map((link) => ({
        ...link,
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
