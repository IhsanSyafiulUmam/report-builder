module.exports = {
  apps: [
    {
      name: "report-frontend",
      script: "npm",
      args: "run start",
      watch: false,
    },
    {
      name: "report-backend",
      script: "/root/.nvm/versions/node/v20.18.1/bin/node",
      args: "api/bigquery.js",
      watch: true,
    }
  ]
}
