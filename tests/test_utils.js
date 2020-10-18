const { exception } = require("console");
const fs = require("fs");
const { execSync } = require("child_process");

let config;
let examplePath;

function init() {
  if (!config) {
    exampleName = process.env.EXAMPLE;
    if (!exampleName) {
      throw "Environment varialbe EXAMPLE must be set.";
    }
    examplePath = `../examples/${exampleName}`;
    config = JSON.parse(
      fs.readFileSync(`${examplePath}/example_test_config.json`)
    );
  }
}

function dataCleanState() {
  execSync(config.dataInitCommand, { cwd: examplePath });
}

function scenario(name, body) {
  init();

  describe(name, () => {
    before(() => {
      dataCleanState();
    });

    body();
  });
}

module.exports = {
  scenario,
};
