-- Use this script to clean up data if needed (BE CAREFUL!)

-- Remove all partner entries
-- DELETE FROM tbl_partners;

-- Remove all players
-- DELETE FROM tbl_players;

-- Reset auto-increment counters
-- ALTER SEQUENCE tbl_players_id_seq RESTART WITH 1;
-- ALTER SEQUENCE tbl_partners_id_seq RESTART WITH 1;

-- Drop all tables (DANGER - this will delete everything!)
-- DROP TABLE IF EXISTS tbl_partners;
-- DROP TABLE IF EXISTS tbl_players;
-- DROP TABLE IF EXISTS tbl_eventname;

-- Show current table sizes
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    most_common_vals
FROM pg_stats 
WHERE schemaname = 'public' 
AND tablename IN ('tbl_players', 'tbl_partners', 'tbl_eventname');
