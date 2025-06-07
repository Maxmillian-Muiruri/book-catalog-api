-- Get all users
CREATE OR REPLACE FUNCTION sp_get_all_users()
RETURNS SETOF users AS $$
BEGIN
    RETURN QUERY SELECT * FROM users ORDER BY id;
END;
$$ LANGUAGE plpgsql;

-- Get all active users
CREATE OR REPLACE FUNCTION sp_get_active_users()
RETURNS SETOF users AS $$
BEGIN
    RETURN QUERY SELECT * FROM users WHERE is_active = true ORDER BY id;
END;
$$ LANGUAGE plpgsql;

-- Get user by ID, raise exception if not found
CREATE OR REPLACE FUNCTION sp_get_user_by_id(p_id INTEGER)
RETURNS SETOF users AS $$
BEGIN
    RETURN QUERY SELECT * FROM users WHERE id = p_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Guest with id % not found', p_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Count books by publication year
CREATE OR REPLACE FUNCTION sp_count_books_by_year(p_year INT)
RETURNS INT AS $$
DECLARE
    book_count INT;
BEGIN
    SELECT COUNT(*) INTO book_count FROM books WHERE published_year = p_year;
    RETURN book_count;
END;
$$ LANGUAGE plpgsql;

-- Create an index on the book title column for faster searches
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);