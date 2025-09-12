# ClickHouse Integration Guide

## Overview
Sistem sekarang mendukung dua database: BigQuery dan ClickHouse. Anda dapat menggunakan keduanya dalam report yang sama.

## Setup ClickHouse

### 1. Environment Variables
Set environment variables berikut di `.env` atau system environment:

```bash
CLICKHOUSE_HOST=http://localhost:8123
CLICKHOUSE_USERNAME=default
CLICKHOUSE_PASSWORD=your-password
CLICKHOUSE_DATABASE=your-database
CLICKHOUSE_PORT=4001
```

### 2. Start ClickHouse API Server
ClickHouse API server berjalan di port 4001 secara default:

```bash
npm run start  # Atau menggunakan PM2: pm2 start ecosystem.config.cjs
```

## Penggunaan dalam Query Templates

### BigQuery (Default)
```typescript
customer_performance: [
  {
    id: "top_customers",
    query: `SELECT NamaPelanggan AS customer_name, SUM(Penjualan) AS total_sales 
             FROM \`biqquery-468807.staging.sales\` 
             GROUP BY NamaPelanggan ORDER BY total_sales DESC LIMIT 10`,
  },
],
```

### ClickHouse
```typescript
clickhouse_customer_performance: [
  {
    id: "top_customers_ch",
    database: "clickhouse",  // Specify database type
    query: `SELECT NamaPelanggan AS customer_name, SUM(Penjualan) AS total_sales 
             FROM sales 
             GROUP BY NamaPelanggan ORDER BY total_sales DESC LIMIT 10`,
  },
],
```

## Query Syntax Differences

### Date Functions
- **BigQuery**: `DATE_SUB(CURRENT_DATE(), INTERVAL 12 MONTH)`
- **ClickHouse**: `subtractMonths(now(), 12)`

### String Formatting
- **BigQuery**: `CONCAT('Rp ', ROUND(SUM(Penjualan) / 1000000, 1), 'M')`
- **ClickHouse**: `concat('Rp ', toString(round(SUM(Penjualan) / 1000000, 1)), 'M')`

### Date Formatting
- **BigQuery**: `FORMAT_DATE('%Y-%m', DATE(Tanggal))`
- **ClickHouse**: `formatDateTime(Tanggal, '%Y-%m')`

## Processor Implementation

Setiap section type membutuhkan processor yang sesuai:

```typescript
// For ClickHouse sections
export default function processClickhouseCustomerPerformance(
  results: Record<string, unknown>, 
  _meta: unknown
) {
  const inputData = Array.isArray(results?.top_customers_ch) 
    ? results.top_customers_ch 
    : [];

  const chartData = inputData.map((row: Record<string, unknown>) => ({
    Customer: row.customer_name || "Unknown",
    "Total Sales": `Rp ${((row.total_sales as number) / 1000000).toFixed(1)}M`,
  }));

  return { chartData };
}
```

## Testing

1. **BigQuery Test**: Gunakan section type `customer_performance`
2. **ClickHouse Test**: Gunakan section type `clickhouse_customer_performance`

## Migration Strategy

1. Mulai dengan menambahkan ClickHouse queries sebagai section types baru
2. Test secara paralel dengan BigQuery
3. Gradually migrate sections yang sudah stable
4. Maintain backward compatibility dengan BigQuery

## Available ClickHouse Section Types

- `clickhouse_customer_performance`: Top customers analysis
- `clickhouse_product_insights`: Product performance data
- `clickhouse_geographic_intelligence`: Geographic sales analysis
- `clickhouse_sales_overview`: Monthly sales overview

Tambahkan section types baru sesuai kebutuhan dengan mengikuti pattern yang sama.
