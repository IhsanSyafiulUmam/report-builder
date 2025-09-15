module.exports = {
  apps: [
    {
      name: "report-frontend",
      script: "npm",
      args: "run start",
      watch: false,
    },
    {
      name: "clickhouse-api",
      script: "node",
      args: "api/clickhouse.js",
      watch: true
    },
  ],
};
