export interface ApiResponse<T> {
  success: boolean;
  message: string;
  meta?: {
    requestId?: string;
    timestamp: string;
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    };
    [key: string]: any;
  };
  data: T;
}
