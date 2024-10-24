```mermaid
classDiagram
Purchase o-- User
Purchase o-- Item
    class User{
        
        +login(login: string, password: string)
        +changePassword(password: string, newPassword: string)
        +consumeBalance()
        +getAccountBalance()

        -id: number
        -createdAt: Date
        -updatedAt: Date
        -balance: number

       
    }
    class Item{
        -id: number
        -name: string
        -createdAt: Date
        -updatedAt: Date
        -currency: string
        -suggestedPrice: number
        -itemPage: string
        -marketPage: string
        -minPrice: number
        -maxPrice: number
        -meanPrice: number
        -quantity: number

        +create()
        +get(page,pageSize)
    }
    class Purchase{
        -user: User
        -item: item
        -priceOfPurchase: numbr
        -id: number
        -createdAt: Date
        -updatedAt: Date

        +createPurchase()
        +refund()
    }
    ```;
