-- Insert sample players for testing
INSERT INTO tbl_players (name, whatsappnumber, dateofbirth, city, shirtsize, shortsize, foodpref, stayyorn, feepaid) VALUES
('Rajesh Kumar', '9876543210', '1990-05-15', 'Delhi', 'L', 'L', 'Vegetarian', true, true),
('Amit Sharma', '9876543211', '1988-08-22', 'Mumbai', 'M', 'M', 'Non-Vegetarian', false, true),
('Priya Singh', '9876543212', '1992-03-10', 'Bangalore', 'S', 'S', 'Vegetarian', true, false),
('Vikram Gupta', '9876543213', '1985-12-05', 'Chennai', 'XL', 'L', 'Non-Vegetarian', false, true),
('Neha Agarwal', '9876543214', '1991-07-18', 'Pune', 'M', 'S', 'Vegetarian', true, true),
('Rohit Verma', '9876543215', '1987-11-30', 'Hyderabad', 'L', 'M', 'Non-Vegetarian', false, false),
('Kavya Reddy', '9876543216', '1993-01-25', 'Kolkata', 'S', 'XS', 'Vegan', true, true),
('Arjun Patel', '9876543217', '1989-09-12', 'Ahmedabad', 'M', 'M', 'Vegetarian', false, true),
('Sneha Joshi', '9876543218', '1994-04-08', 'Jaipur', 'S', 'S', 'Non-Vegetarian', true, false),
('Karan Malhotra', '9876543219', '1986-06-20', 'Lucknow', 'XL', 'L', 'Vegetarian', false, true),
('Pooja Mehta', '9876543220', '1990-10-14', 'Surat', 'M', 'M', 'Non-Vegetarian', true, true),
('Deepak Yadav', '9876543221', '1988-02-28', 'Kanpur', 'L', 'L', 'Vegetarian', false, false),
('Ritu Saxena', '9876543222', '1992-12-03', 'Indore', 'S', 'S', 'Vegan', true, true),
('Manish Tiwari', '9876543223', '1987-05-17', 'Bhopal', 'M', 'M', 'Non-Vegetarian', false, true),
('Anita Kapoor', '9876543224', '1991-08-09', 'Chandigarh', 'S', 'XS', 'Vegetarian', true, false),
('Suresh Pandey', '9876543225', '1985-03-22', 'Dehradun', 'XL', 'L', 'Non-Vegetarian', false, true)
ON CONFLICT DO NOTHING;

-- Insert sample partner entries for different events
-- Category A pairs
INSERT INTO tbl_partners (eventname, userid, partnerid, ranking) VALUES
('A', 1, 2, 1),  -- Rajesh Kumar & Amit Sharma - Winners
('A', 2, 1, 1),  -- Amit Sharma & Rajesh Kumar - Winners (reciprocal)
('A', 3, 4, 2),  -- Priya Singh & Vikram Gupta - Runners-up
('A', 4, 3, 2),  -- Vikram Gupta & Priya Singh - Runners-up (reciprocal)
('A', 5, 6, 3),  -- Neha Agarwal & Rohit Verma - Semi-finalists
('A', 6, 5, 3),  -- Rohit Verma & Neha Agarwal - Semi-finalists (reciprocal)
('A', 7, 8, 3),  -- Kavya Reddy & Arjun Patel - Semi-finalists
('A', 8, 7, 3);  -- Arjun Patel & Kavya Reddy - Semi-finalists (reciprocal)

-- Category B pairs
INSERT INTO tbl_partners (eventname, userid, partnerid, ranking) VALUES
('B', 9, 10, 1),   -- Sneha Joshi & Karan Malhotra - Winners
('B', 10, 9, 1),   -- Karan Malhotra & Sneha Joshi - Winners (reciprocal)
('B', 11, 12, 2),  -- Pooja Mehta & Deepak Yadav - Runners-up
('B', 12, 11, 2),  -- Deepak Yadav & Pooja Mehta - Runners-up (reciprocal)
('B', 13, 14, 3),  -- Ritu Saxena & Manish Tiwari - Semi-finalists
('B', 14, 13, 3),  -- Manish Tiwari & Ritu Saxena - Semi-finalists (reciprocal)
('B', 15, 16, 4),  -- Anita Kapoor & Suresh Pandey - Quarter-finalists
('B', 16, 15, 4);  -- Suresh Pandey & Anita Kapoor - Quarter-finalists (reciprocal)

-- Category C pairs (some without partners yet)
INSERT INTO tbl_partners (eventname, userid, partnerid, ranking) VALUES
('C', 1, 3, NULL),  -- Rajesh Kumar & Priya Singh
('C', 3, 1, NULL),  -- Priya Singh & Rajesh Kumar (reciprocal)
('C', 5, NULL, NULL),  -- Neha Agarwal - looking for partner
('C', 7, NULL, NULL),  -- Kavya Reddy - looking for partner
('C', 9, 11, NULL),  -- Sneha Joshi & Pooja Mehta
('C', 11, 9, NULL); -- Pooja Mehta & Sneha Joshi (reciprocal)

-- Category D pairs
INSERT INTO tbl_partners (eventname, userid, partnerid, ranking) VALUES
('D', 2, 4, NULL),  -- Amit Sharma & Vikram Gupta
('D', 4, 2, NULL),  -- Vikram Gupta & Amit Sharma (reciprocal)
('D', 6, 8, NULL),  -- Rohit Verma & Arjun Patel
('D', 8, 6, NULL),  -- Arjun Patel & Rohit Verma (reciprocal)
('D', 10, NULL, NULL), -- Karan Malhotra - looking for partner
('D', 12, NULL, NULL); -- Deepak Yadav - looking for partner
