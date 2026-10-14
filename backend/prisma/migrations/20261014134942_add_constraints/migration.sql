ALTER TABLE reviews
    ADD CONSTRAINT rating_range CHECK (rating BETWEEN 1 AND 5);

CREATE INDEX idx_products_search ON products
    USING GIN (to_tsvector('english', title || ' ' || COALESCE(description, '')));