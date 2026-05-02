import { ApiProperty } from '@nestjs/swagger';

export class CreateSupplierResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'supplier_created' })
  message: string;
}

export class DeleteSupplierResponseDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ example: 'supplier_deleted' })
  message: string;
}

export class PaginatedSuppliersResponseDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'object', additionalProperties: true },
    description: 'Supplier rows (snake_case keys)',
  })
  data: Record<string, unknown>[];

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 100 })
  total: number;
}
