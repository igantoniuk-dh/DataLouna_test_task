export interface ShopApiResponse<T = unknown> {
    message: string;
    ok: boolean;
    code: number;
    pagination?: {
        page: number;
        pageSize: number;
        totalCount: number;
    };
    data: T[];
}
