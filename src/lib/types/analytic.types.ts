export interface AnalyticResponseDto {
  categories: string[];
  amounts: number[];
  operationsCount: number[];
}

export interface GetAnalyticQuery {
  budgetId: string;
  startDate?: string;
  endDate?: string;
}
