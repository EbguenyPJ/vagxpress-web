/** Envoltura estándar de las respuestas del API. */
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}
