-- Create admin credentials table for secure password management
CREATE TABLE IF NOT EXISTS tbl_admin_credentials (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_username ON tbl_admin_credentials(username);

-- Note: The default password "uta2024" will be used until admin sets a custom password
-- Once a custom password is set, it will be stored as a SHA-256 hash in this table
