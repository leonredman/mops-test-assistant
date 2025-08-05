const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // Expose a task that reads your custom JSON
      on("task", {
        loadFixtureFromServer() {
          const fixturePath = path.resolve(
            __dirname,
            "server/fixtures/auto-fixture.json"
          );
          const file = fs.readFileSync(fixturePath, "utf-8");
          return JSON.parse(file);
        },
      });
    },
  },
});
