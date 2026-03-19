-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Problems table
CREATE TABLE IF NOT EXISTS problems (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    platform TEXT,
    difficulty TEXT,
    concept TEXT,
    leetcode_link TEXT,
    date_solved TIMESTAMP WITH TIME ZONE,
    solve_history JSONB DEFAULT '[]',
    days_taken INTEGER DEFAULT 1,
    next_revision_date TIMESTAMP WITH TIME ZONE,
    revision_count INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_problems_user_id ON problems(user_id);
