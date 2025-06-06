CREATE TABLE IF NOT EXISTS  books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  author_name VARCHAR(255) NOT NULL,
  isbn VARCHAR(20) UNIQUE NOT NULL,
  published_year INT,
  available_copies INT DEFAULT 0,
  is_available BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_author_name ON books(author_name);
CREATE INDEX IF NOT EXISTS idx_books_title_isbn ON books(title, isbn);


-- Add updated_at column if not exists
ALTER TABLE books ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_books_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_books_updated_at
    BEFORE UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION update_books_updated_at_column();

-- Trigger function to ensure available_copies is not negative
CREATE OR REPLACE FUNCTION validate_available_copies()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.available_copies < 0 THEN
        RAISE EXCEPTION 'available_copies cannot be negative';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_books_available_copies
    BEFORE INSERT OR UPDATE ON books
    FOR EACH ROW
    EXECUTE FUNCTION validate_available_copies();