```mermaid

sequenceDiagram
    actor frontend
    participant backend
    participant redis
    participant postgresql
    participant skinport_api 
   
    frontend ->>+ backend: запрос скинов для покупки
    opt скины в кеше
        backend->>+redis:  запрос скинов
        redis -->>- backend: скины из кеша
        backend -->>- frontend: скины для покупкидля покупки
    end

    frontend ->>+ backend: запрос скинов для покупки
    opt скинов в кеше нет, есть в базе
        backend->>+redis: запрос скинов
        redis -->>- backend: Кеш пустой
        backend->>+postgresql: запрос скинов
        postgresql-->>-backend: запрос скинов
        backend->>+redis: сохранить кеш
        redis -->>- backend: кеш сохранен
        backend -->>- frontend: скины для покупки
    end

        frontend ->>+ backend: запрос скинов для покупки
    opt скинов в кеше нет, есть в базе
        backend->>+redis: запрос скинов
        redis -->>- backend: Кеш пустой
        backend->>+postgresql: запрос скинов
        postgresql-->>-backend: запрос скинов
        backend->>+redis: сохранить кеш
        redis -->>- backend: кеш сохранен
        backend -->>- frontend: скины для покупки
    end

    frontend ->>+ backend: запрос скинов для покупки
    opt скинов в кеше нет, нет в базе, забираем из апи
        backend->>+redis: запрос скинов
        redis -->>- backend: Кеш пустой
        backend->>+postgresql: запрос скинов
        postgresql-->>-backend: скинов нет
        backend->>+skinport_api: запрос скинов
        skinport_api-->>-backend: скины есть
        backend->>+postgresql: сохранить скины
        postgresql-->>-backend: скины сохранены
        backend->>+redis: сохранить кеш
        redis -->>- backend: кеш сохранен
        backend -->>- frontend: скины для покупки
    end


