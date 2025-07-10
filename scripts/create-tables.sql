-- Create events master table
CREATE TABLE IF NOT EXISTS tbl_eventname (
    id SERIAL PRIMARY KEY,
    eventname VARCHAR(10) NOT NULL UNIQUE,
    description TEXT
);

-- Insert default events
INSERT INTO tbl_eventname (eventname, description) VALUES 
('A', 'Category A (Open)'),
('B', 'Category B (90+ combined)'),
('C', 'Category C (105+ combined)'),
('D', 'Category D (120+ combined)')
ON CONFLICT (eventname) DO NOTHING;

-- Create players table
CREATE TABLE IF NOT EXISTS tbl_players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    whatsappnumber VARCHAR(20) NOT NULL,
    dateofbirth DATE NOT NULL,
    city VARCHAR(100) NOT NULL,
    shirtsize VARCHAR(10) NOT NULL,
    shortsize VARCHAR(10) NOT NULL,
    foodpref VARCHAR(50) NOT NULL,
    stayyorn BOOLEAN DEFAULT FALSE,
    feepaid BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create partners table
CREATE TABLE IF NOT EXISTS tbl_partners (
    id SERIAL PRIMARY KEY,
    eventname VARCHAR(10) NOT NULL,
    userid INTEGER NOT NULL,
    partnerid INTEGER,
    ranking INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eventname) REFERENCES tbl_eventname(eventname),
    FOREIGN KEY (userid) REFERENCES tbl_players(id),
    FOREIGN KEY (partnerid) REFERENCES tbl_players(id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_whatsapp_dob ON tbl_players(whatsappnumber, dateofbirth);
CREATE INDEX IF NOT EXISTS idx_partners_event ON tbl_partners(eventname);
CREATE INDEX IF NOT EXISTS idx_partners_user ON tbl_partners(userid);
