import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

class HqAddressDto {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;
}

class DefaultContactDto {
  @IsOptional()
  @IsEmail()
  email?: string;
}

class BusinessUnitItemDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

class CategoryItemDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

class OwnerDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}

export class CreateSupplierDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID()
  organization_id: string;

  @IsOptional()
  @ValidateIf(
    (_, v: unknown) =>
      v !== undefined && v !== null && String(v).trim() !== '',
  )
  @IsUrl({ require_protocol: true, require_tld: false })
  url?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  nda?: boolean;

  @IsOptional()
  @IsNumber()
  relevance_score?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  capabilities?: string[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => HqAddressDto)
  hq_address?: HqAddressDto;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => DefaultContactDto)
  default_contact?: DefaultContactDto;

  @IsOptional()
  @IsObject()
  default_location?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessUnitItemDto)
  business_units?: BusinessUnitItemDto[];

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  @ValidateNested({ each: true })
  @Type(() => CategoryItemDto)
  categories?: CategoryItemDto[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OwnerDto)
  owner?: OwnerDto;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
