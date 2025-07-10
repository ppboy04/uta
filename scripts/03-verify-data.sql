-- Verify tables were created successfully
SELECT 'Events Table' as table_name, COUNT(*) as record_count FROM tbl_eventname
UNION ALL
SELECT 'Players Table' as table_name, COUNT(*) as record_count FROM tbl_players
UNION ALL
SELECT 'Partners Table' as table_name, COUNT(*) as record_count FROM tbl_partners;

-- Show all events
SELECT * FROM tbl_eventname ORDER BY eventname;

-- Show sample players
SELECT id, name, whatsappnumber, city, feepaid FROM tbl_players ORDER BY id LIMIT 10;

-- Show partner pairs by event
SELECT 
    p.eventname,
    u1.name as player1,
    u2.name as player2,
    p.ranking
FROM tbl_partners p
LEFT JOIN tbl_players u1 ON p.userid = u1.id
LEFT JOIN tbl_players u2 ON p.partnerid = u2.id
WHERE p.userid < p.partnerid OR p.partnerid IS NULL
ORDER BY p.eventname, p.ranking NULLS LAST, p.id;

-- Show players looking for partners
SELECT 
    p.eventname,
    u.name as player_name,
    u.whatsappnumber
FROM tbl_partners p
JOIN tbl_players u ON p.userid = u.id
WHERE p.partnerid IS NULL
ORDER BY p.eventname, u.name;
