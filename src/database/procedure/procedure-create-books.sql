/*CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author_name VARCHAR(255) NOT NULL,
    isbn VARCHAR(20) UNIQUE NOT NULL,
    published_year INT NOT NULL,
    available_copies INT DEFAULT 0,
    is_available BOOLEAN GENERATED ALWAYS AS (available_copies > 0) STORED,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);*/


CREATE OR REPLACE FUNCTION create_book(
    p_title VARCHAR,
    p_author_name VARCHAR,
    p_isbn VARCHAR,
    p_published_year INT,
    p_available_copies INT DEFAULT 0
) RETURNS TABLE (
    id INT,
    title VARCHAR,
    author_name VARCHAR,
    isbn VARCHAR,
    published_year INT,
    available_copies INT,
    is_available BOOLEAN,
    updated_at TIMESTAMP
) AS $$
BEGIN
    -- Check if a book with the same title already exists
    IF EXISTS (SELECT 1 FROM books WHERE title = p_title) THEN
        RAISE EXCEPTION 'Book with title "%" already exists', p_title;
    END IF;

    RETURN QUERY
    INSERT INTO books (title, author_name, isbn, published_year, available_copies)
    VALUES (p_title, p_author_name, p_isbn, p_published_year, p_available_copies)
    RETURNING id, title, author_name, isbn, published_year, available_copies, is_available, updated_at;
END;
$$ LANGUAGE plpgsql;




