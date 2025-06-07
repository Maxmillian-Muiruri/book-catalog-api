CREATE OR REPLACE FUNCTION update_book(
    p_id INT,
    p_title VARCHAR,
    p_author_name VARCHAR,
    p_isbn VARCHAR,
    p_published_year INT,
    p_available_copies INT
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
DECLARE
    current_title VARCHAR;
BEGIN
    -- Check if the book exists
    SELECT title INTO current_title FROM books WHERE id = p_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Book with id % not found', p_id;
    END IF;

    -- If title is not null and different from current, check for duplicate
    IF p_title IS NOT NULL AND p_title <> current_title THEN
        IF EXISTS (SELECT 1 FROM books WHERE title = p_title) THEN
            RAISE EXCEPTION 'Book with title "%" already exists', p_title;
        END IF;
    END IF;

    RETURN QUERY
    UPDATE books
    SET
        title = COALESCE(p_title, title),
        author_name = COALESCE(p_author_name, author_name),
        isbn = COALESCE(p_isbn, isbn),
        published_year = COALESCE(p_published_year, published_year),
        available_copies = COALESCE(p_available_copies, available_copies)
    WHERE id = p_id
    RETURNING id, title, author_name, isbn, published_year, available_copies, is_available, updated_at;
END;
$$ LANGUAGE plpgsql;