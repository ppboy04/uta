-- Test queries for admin dashboard functionality

-- Get all pairs for Category A (what admin dashboard shows)
SELECT 
    p1.id,
    p1.eventname,
    u1.name as player1,
    u2.name as player2,
    p1.ranking
FROM tbl_partners p1
LEFT JOIN tbl_players u1 ON p1.userid = u1.id
LEFT JOIN tbl_players u2 ON p1.partnerid = u2.id
WHERE p1.eventname = 'A'
ORDER BY p1.id;

-- Get all pairs for Category B
SELECT 
    p1.id,
    p1.eventname,
    u1.name as player1,
    u2.name as player2,
    p1.ranking
FROM tbl_partners p1
LEFT JOIN tbl_players u1 ON p1.userid = u1.id
LEFT JOIN tbl_players u2 ON p1.partnerid = u2.id
WHERE p1.eventname = 'B'
ORDER BY p1.id;

-- Test user login (use these credentials to test login)
-- WhatsApp: 9876543210, DOB: 1990-05-15 (Rajesh Kumar)
-- WhatsApp: 9876543211, DOB: 1988-08-22 (Amit Sharma)
SELECT name, whatsappnumber, dateofbirth FROM tbl_players WHERE id IN (1,2);

-- Show tournament statistics
SELECT 
    eventname,
    COUNT(*) as total_registrations,
    COUNT(partnerid) as paired_players,
    COUNT(*) - COUNT(partnerid) as looking_for_partners
FROM tbl_partners
GROUP BY eventname
ORDER BY eventname;
