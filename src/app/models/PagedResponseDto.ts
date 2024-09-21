export class PagedResponseDto<T> {
    pageNumber!: number;
    pageSize!: number;
    totalPages!: number;
    totalRecords!: number;
    hasNext!: boolean;
    hasPrevious!: boolean;
    data!: T[];
}