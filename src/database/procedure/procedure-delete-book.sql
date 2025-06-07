CREATE OR REPLACE FUNCTION sp_soft_delete_book(p_id INTEGER)
RETURNS TABLE(
    success BOOLEAN,
    message TEXT,
    book_title VARCHAR(255)
) AS $$
DECLARE
    current_title VARCHAR(255);
BEGIN
    -- Check if book exists and get current title
    SELECT books.title INTO current_title 
    FROM books 
    WHERE books.id = p_id AND books.is_active = true;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Book with id % not found or already deleted', p_id;
    END IF;

    -- Soft delete the book
    UPDATE books SET 
        is_active = false,
        updated_at = NOW()
    WHERE books.id = p_id;
    
    RETURN QUERY 
    SELECT true, 'Book "' || current_title || '" has been soft deleted', current_title;

     -- Hard Delete the book
    DELETE FROM books WHERE books.id = p_id;
    
    RETURN QUERY 
    SELECT true, 'Book "' || deleted_title || '" has been permanently deleted', deleted_title;
END;
$$ LANGUAGE plpgsql;