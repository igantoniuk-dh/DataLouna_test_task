```mermaid

sequenceDiagram
    actor frontend
    participant backend
    participant postgresql
    participant skinport_api 
   
    frontend ->>+ backend: запрос скинов для покупки


    frontend ->>+ backend: запрос скинов для покупки
    opt скинов в кеше нет, есть в базе
        backend->>+postgresql: запрос скинов
        postgresql-->>-backend: запрос скинов
        backend -->>- frontend: скины для покупки
    end

        frontend ->>+ backend: запрос скинов для покупки
    opt скинов в кеше нет, есть в базе
        backend->>+postgresql: запрос скинов
        postgresql-->>-backend: запрос скинов
        backend -->>- frontend: скины для покупки
    end

    frontend ->>+ backend: запрос скинов для покупки
    opt скинов в кеше нет, нет в базе, забираем из апи
        backend->>+postgresql: запрос скинов
        postgresql-->>-backend: скинов нет
        backend->>+skinport_api: запрос скинов
        skinport_api-->>-backend: скины есть
        backend->>+postgresql: сохранить скины
        postgresql-->>-backend: скины сохранены
        backend -->>- frontend: скины для покупки
    end


