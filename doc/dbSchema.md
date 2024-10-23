```mermaid
erDiagram

    USERS {
        UUID id PK
        TEXT login UK
        TEXT password
        INTEGER balance
        TIMESTAMP created_at
        TIMESTAMP updated_at 
        TIMESTAMP last_login_at
    }

    ITEMS {
         UUID id PK
         TEXT market_hash_name
         VARCHAR(5) currency
         NUMERIC suggested_price
         TEXT item_page
         TEXT market_page
         NUMERIC min_price
         NUMERIC max_price
         NUMERIC  mean_price
         NUMERIC  median_price
         INTEGER quantity
         TIMESTAMP created_at
         TIMESTAMP updated_at
    }
    PURCHASES {
         UUID id PK
         NUMERIC price
         UUID user_id FK
         UUID item_id FK
         TIMESTAMP created_at
         TIMESTAMP updated_at
    }

    USERS ||--o{ PURCHASES : creates
    ITEMS ||--o{ PURCHASES : includes
    
