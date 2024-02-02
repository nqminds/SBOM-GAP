module.exports = {
  apps : [{
    name: "sbom-cli-api",
    script: "./api.mjs",
    instances: "max",
    exec_mode : "cluster",
    env: {
      NODE_ENV: "production",
    }
  }]
};
