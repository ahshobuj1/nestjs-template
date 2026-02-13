export interface PaginationOptions {
    page: number;
    limit: number;
    total: number;
}

export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export function createPaginationMeta({
    page,
    limit,
    total,
}: PaginationOptions): PaginationMeta {
    const totalPages = Math.ceil(total / limit);
    return {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
    };
}
