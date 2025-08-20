CREATE OR REPLACE FUNCTION get_clients_with_report_counts()
RETURNS TABLE (
    id UUID,
    name TEXT,
    email TEXT,
    status TEXT,
    last_activity TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    reports_count BIGINT
)
AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.id,
        c.name,
        c.email,
        c.status,
        c.last_activity,
        c.created_at,
        COUNT(r.id) AS reports_count
    FROM
        clients c
    LEFT JOIN
        reports r ON c.id = r.client_id
    GROUP BY
        c.id;
END;
$$ LANGUAGE plpgsql;
