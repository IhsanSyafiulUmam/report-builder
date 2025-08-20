export const queryTemplates = {
  sales_overview: [
    {
      id: "monthly_sales",
      query: `
        SELECT
          FORMAT_DATE('%Y-%m', DATE(ScrapDate)) AS Month,
          Channel,
          Brand,
          L3Title as SubCategory,
          SUM(DailySalesValue) AS totalsales,
        FROM
          markethac.AryaNoble.dm_AryaNoble
        WHERE
          TRUE
          AND DATE(ScrapDate) BETWEEN DATE_TRUNC(DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH), MONTH)
          AND LAST_DAY(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))
        GROUP BY
          1,2,3, 4
        ORDER BY
          1, 2, 3, 4   
      `,
    },
  ],
  platform_sales_value: [
    {
      id: "platform_gmv",
      query: `SELECT
          FORMAT_DATE('%Y-%m', DATE(ScrapDate)) AS Month,
          Channel,
          SUM(DailySalesValue) AS totalsales,
          SUM(DailySalesCount) AS unitsold
        FROM
          markethac.AryaNoble.dm_AryaNoble
        WHERE
          DATE(ScrapDate) BETWEEN DATE_TRUNC(DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH), MONTH)
          AND LAST_DAY(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))
        GROUP BY 1,2
        ORDER BY 1,2`,
    },
  ],
  volume_sales_value: [
    {
      id: "volume_sales_value",
      query: `
      SELECT
        FORMAT_DATE('%Y-%m', DATE(ScrapDate)) AS Month,
        volume_range,
        SUM(DailySalesValue) AS totalsales,
        SUM(DailySalesCount) AS unitsold
      FROM
        markethac.AryaNoble.dm_AryaNoble
      WHERE
        DATE(ScrapDate) BETWEEN DATE_TRUNC(DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH), MONTH)
                            AND LAST_DAY(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))
        AND volume_range IS NOT NULL
        AND volume_range != "Volume Undefined"
      GROUP BY 1, 2
      ORDER BY 1;`,
    },
  ],
  store_sales_value: [
    {
      id: "store_sales_value",
      query: `
      SELECT
        FORMAT_DATE('%Y-%m', DATE(ScrapDate)) AS Month,
        ShopTypeV2,
        SUM(DailySalesValue) AS totalsales,
      FROM
        markethac.AryaNoble.dm_AryaNoble
      WHERE
        TRUE
        AND DATE(ScrapDate) BETWEEN DATE_TRUNC(DATE_SUB(CURRENT_DATE(), INTERVAL 6 MONTH), MONTH)
        AND LAST_DAY(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))
      GROUP BY
        1,2
      ORDER BY
        1
      `,
    },
  ],
  brand_performance_platform: [
    {
      id: "brand_performance_platform",
      query: `
        SELECT
          FORMAT_DATE('%Y-%m', DATE(ScrapDate)) AS Month,
          Channel,
          Brand,
          SUM(DailySalesValue) AS totalsales,
        FROM
          markethac.AryaNoble.dm_AryaNoble
        WHERE
          TRUE
          AND DATE(ScrapDate) BETWEEN DATE_TRUNC(DATE_SUB(CURRENT_DATE(), INTERVAL 2 MONTH), MONTH)
          AND LAST_DAY(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))
        GROUP BY
          1,
          2,
          3
        ORDER BY
          1, 2, 3`,
    },
  ],
  brand_performance_sub_category: [
    {
      id: "brand_performance_sub_category",
      query: `
      SELECT
        FORMAT_DATE('%Y-%m', DATE(ScrapDate)) AS Month,
        Channel,
        Brand,
        L3Title as SubCategory,
        SUM(DailySalesValue) AS totalsales,
      FROM
        markethac.AryaNoble.dm_AryaNoble
      WHERE
        TRUE
        AND DATE(ScrapDate) BETWEEN DATE_TRUNC(DATE_SUB(CURRENT_DATE(), INTERVAL 2 MONTH), MONTH)
        AND LAST_DAY(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))
      GROUP BY
        1,2,3, 4
      ORDER BY
        1
        `,
    },
  ],
  top_listing_performance: [
    {
      id: "top_listing_performance",
      query: `
      WITH current_month AS (
        SELECT
          channel,
          ListingName,
          brand,
          SUM(DailySalesValue) AS GMV
        FROM markethac.AryaNoble.dm_AryaNoble
        where date_trunc(ScrapDate,month) = date_sub(date_trunc(current_date(), month), interval 1 month)
        GROUP BY channel, ListingName, brand
      ),
      previous_month AS (
        SELECT
          channel,
          ListingName,
          brand,
          SUM(DailySalesValue) AS GMV
        FROM markethac.AryaNoble.dm_AryaNoble
        where date_trunc(ScrapDate,month) = date_sub(date_trunc(current_date(), month), interval 1 month)
        GROUP BY channel, ListingName, brand
      ),
      brand_total AS (
        SELECT
          brand,
          SUM(DailySalesValue) AS total_gmv
        FROM markethac.AryaNoble.dm_AryaNoble
        WHERE DATE(scrapdate) BETWEEN '2025-05-01' AND '2025-05-31'
        GROUP BY brand
      ),
      joined AS (
        SELECT
          c.channel,
          c.ListingName,
          c.brand,
          c.GMV,
          ROUND(c.GMV / IFNULL(b.total_gmv, 1) * 100, 2) AS pct_of_brand_gmv,
          ROUND(SAFE_DIVIDE(c.GMV - IFNULL(p.GMV, 0), NULLIF(p.GMV, 0)) * 100, 2) AS qoq_growth_pct
        FROM current_month c
        LEFT JOIN previous_month p
          ON c.channel = p.channel AND c.ListingName = p.ListingName AND c.brand = p.brand
        LEFT JOIN brand_total b
          ON c.brand = b.brand
      ),
      ranked AS (
        SELECT *,
          ROW_NUMBER() OVER (PARTITION BY channel ORDER BY GMV DESC) AS rank_channel
        FROM joined
      )
      SELECT
        channel,
        ListingName,
        brand,
        GMV,
        pct_of_brand_gmv,
        IFNULL(qoq_growth_pct, 0) AS qoq_growth_pct
      FROM ranked
      WHERE rank_channel <= 3
      ORDER BY channel, GMV DESC;
`,
    },
  ],
  top_categories: [
    {
      id: "top_categories",
      query: `
      SELECT
        FORMAT_DATE('%Y-%m', DATE(ScrapDate)) AS Month,
        l3title as SubCategory,
        Channel,
        SUM(DailySalesValue) AS totalsales,
        SUM(DailySalesCount) AS unitsold
      FROM
        markethac.AryaNoble.dm_AryaNoble
      WHERE
        DATE(ScrapDate) BETWEEN DATE_TRUNC(DATE_SUB(CURRENT_DATE(), INTERVAL 2 MONTH), MONTH)
                            AND LAST_DAY(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))
      GROUP BY 1,2,3
      ORDER BY 1`,
    },
  ],
  top_reseller: [
    {
      id: "top_reseller",
      query: `
      SELECT
        IFNULL(ShopName, '-') AS ShopName,
        IFNULL(Province, '-') AS Province,
        IFNULL(Channel, '-') AS Channel,
        IFNULL(ShopUrl, '-') AS ShopUrl,
        IFNULL(SUM(DailySalesValue), 0) AS Gmv,
        IFNULL(SUM(DailySalesCount), 0) AS UnitSold,
        ROUND(IFNULL(AVG(SAFE_CAST(SalePrice AS FLOAT64)), 0)) AS avgSalePrice
      FROM markethac.AryaNoble.dm_AryaNoble
      WHERE TRUE
        AND ShopTypeV2 = "other store"
        and date_trunc(ScrapDate,month) = date_sub(date_trunc(current_date(), month), interval 1 month)
      GROUP BY ShopName, Province, Channel, ShopUrl
      ORDER BY Gmv DESC
      LIMIT 15`,
    },
  ],
  flashsale: [
    {
      id: "flashsale",
      query: `SELECT
            'banner' as data_type,
            date_trunc(scrapdate, month) as transaction_month,
            case when EXTRACT(DAYOFWEEK FROM scrapdate) in (1,7) then 'Weekend' else 'Weekdays' end as days_flag,
            Channel,
            Brand,
            if(
              replace(replace(BannerName, "_"," "),"-"," ") = replace(replace(Type, "_",""),"-"," "),
              initcap(replace(replace(BannerName, "_"," "),"-"," ")),
              initcap(replace(replace(BannerName, "_"," "),"-"," "))
            ) as banner_name,
            'N/A' as fsstart,
            concat(bannerid, channel,itemid) as unique_value,
            case when row_num = '1' then 1 else 0 end as row_num,
            ifnull(safe_divide((SUM(cast(discount as int64)) * sum(DailySalesCount)), sum(DailySalesCount)),0) as avg_discount,
            ifnull(safe_divide((SUM(cast(SalePrice as int64)) * sum(DailySalesCount)), sum(DailySalesCount)),0) as avg_saleprice,
            sum(dailysalesvalue) daily_sales_value,
            sum(dailysalescount) daily_sales_count,
          from markethac.Electrolux.dm_Electrolux_banner
          WHERE true
          and date_trunc(ScrapDate,month) = date_sub(date_trunc(current_date(), month), interval 1 month)
          and ShopTypeV2 = 'official store'
          AND isbanner = '1'
          GROUP BY 1,2,3,4,5,6,7,8,9
          
          union all
          
          SELECT
            'flashsale' as data_type,
            date_trunc(scrapdate, month) as transaction_month,
            case when EXTRACT(DAYOFWEEK FROM scrapdate) in (1,7) then 'Weekend' else 'Weekdays' end as days_flag,
            Channel,
            Brand,
            'N/A' as bannername,
            cast(fsstart as string) fsstart,
            concat(fsid, channel,itemid) as unique_value,
            0 as row_num,
            ifnull(safe_divide((SUM(cast(discount as int64)) * sum(DailySalesCount)), sum(DailySalesCount)),0) as avg_discount,
            ifnull(safe_divide((SUM(cast(SalePrice as int64)) * sum(DailySalesCount)), sum(DailySalesCount)),0) as avg_saleprice,
            sum(dailysalesvalue) daily_sales_value,
            sum(dailysalescount) daily_sales_count
          from markethac.AryaNoble.dm_AryaNoble
          WHERE true
          and date_trunc(ScrapDate,month) = date_sub(date_trunc(current_date(), month), interval 1 month)
          and ShopTypeV2 = 'official store'
          and fsid is not null
          and fsid != ''
          GROUP BY 1,2,3,4,5,6,7,8`,
    },
  ],
  banner: [
    {
      id: "banner",
      query: `SELECT
          'summary' as data_type,
          channel,
          sum(dailysalescount) as total_UnitSold,
          count(unique_value) as total_Slot,
          sum(dailysalescount) / count(unique_value) as avg_UnitSoldPerSlot,
          sum(dailysalesvalue) as total_SalesValue,
          round(avg(cast(SalePrice as int))) as avg_SalePrice,
          round(avg(cast(discount as float64))) as avg_discount
        FROM markethac.da_testground.dm_AryaNoble_banner
        WHERE isbanner = '1' AND row_num = '1'
        GROUP BY 2`,
    },
    {
      id: "banner_detail",
      query: `SELECT
          'top_banners' as data_type,
          BannerName,
          channel as Channel,
          round(sum(dailysalescount) / count(unique_value)) as UnitPerSlot
        FROM markethac.da_testground.dm_AryaNoble_banner
        WHERE isbanner = '1' AND row_num = '1'
        GROUP BY 2, 3
        ORDER BY 3 DESC
        LIMIT 10`,
    },
  ],
  top_brand_channel: [
    {
      id: "top_brand_by_channel",
      query: `
        SELECT
          Channel,
          Brand,
          SUM(DailySalesValue) AS Value,
          ROUND(SUM(DailySalesValue) / SUM(SUM(DailySalesValue)) OVER (PARTITION BY Channel) * 100, 2) AS Percentage
        FROM
          markethac.AryaNoble.dm_AryaNoble
        WHERE
          DATE(ScrapDate) BETWEEN DATE_TRUNC(DATE_SUB(CURRENT_DATE(), INTERVAL 3 MONTH), MONTH)
          AND LAST_DAY(DATE_SUB(CURRENT_DATE(), INTERVAL 1 MONTH))
        GROUP BY
          Channel, Brand
        QUALIFY ROW_NUMBER() OVER (PARTITION BY Channel ORDER BY SUM(DailySalesValue) DESC) <= 10
        ORDER BY
          Channel, SUM(DailySalesValue) DESC
      `,
    },
  ],
};
