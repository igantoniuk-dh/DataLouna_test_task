```mermaid
erDiagram

    USER {
        UUID id PK
        TEXT login UK
        TEXT password
        INTEGER balance
        TIMESTAMP created_at
        TIMESTAMP updated_at 
        TIMESTAMP last_login_at
    }

    ITEM {
         UUID id PK
         TEXT market_hash_name
         VARCHAR(5) currency
         NUMERIC suggested_price
         TEXT item_page
         TEXT market_page
         NUMERIC min_price
         NUMERIC max_price
         NUMERIC  mean_price
         INTEGER quantity
         TIMESTAMP created_at
         TIMESTAMP updated_at
    }

    PURCHASE {
         UUID id PK
         NUMERIC price
         UUID user FK
         UUID item FK
         TIMESTAMP created_at
         TIMESTAMP updated_at
    }

    USER ||--o{ PURCHASE : creates
    ITEM ||--o{ PURCHASE : includes
    
