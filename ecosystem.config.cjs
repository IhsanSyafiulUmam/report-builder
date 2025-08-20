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
      script: "node",
      args: "api/bigquery.js",
      watch: true,
    }
  ]
}
