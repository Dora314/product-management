// backend/src/common/dtos/base-response.dto.ts
export class BaseResponseDto<T> {
    statusCode: number;
    message: string;
    data: T | null;
    error: string | null;
  
    constructor(statusCode: number, message: string, data: T | null = null, error: string | null = null) {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
      this.error = error;
    }
  }