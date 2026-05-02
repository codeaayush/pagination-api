import { Type } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

const SORT_FIELDS = [
  'name',
  'status',
  'created_at',
  'updated_at',
  'relevance_score',
  'type',
  'description',
] as const;

export class QuerySuppliersDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  capability?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;

  @IsOptional()
  @IsEmail()
  owner_email?: string;

  @IsOptional()
  @IsIn([...SORT_FIELDS])
  sort_by?: (typeof SORT_FIELDS)[number] = 'created_at';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'desc';
}
