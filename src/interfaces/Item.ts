export interface Item {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    currency: string;
    suggestedPrice: number;
    itemPage: string;
    marketPage: string;
    minPrice: number;
    maxPrice: number;
    meanPrice: number;
    quantity: number;
}
