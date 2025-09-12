module.exports = {
  apps: [
    {
      name: "report-frontend",
      script: "npm",
      args: "run start",
      watch: false,
    },
    {
      name: "bigquery-api",
      script: "node",
      args: "api/bigquery.js",
      watch: true,
    },
    {
      name: "clickhouse-api",
      script: "node", 
      args: "api/clickhouse.js",
      watch: true,
      env: {
        CLICKHOUSE_HOST: "http://localhost:8123",
        CLICKHOUSE_USERNAME: "default",
        CLICKHOUSE_PASSWORD: "",
        CLICKHOUSE_DATABASE: "default",
        CLICKHOUSE_PORT: "4001"
      }
    }
  ]
}
