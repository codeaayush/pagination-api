import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

/** JSON column: hq_address */
export class HqAddressValue {
  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;
}

/** JSON column: default_contact */
export class DefaultContactValue {
  @IsOptional()
  @IsEmail()
  email?: string;
}

/** JSON column: business_units[] */
export class BusinessUnitValue {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

/** JSON column: categories[] */
export class CategoryValue {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;
}

/** JSON column: owner */
export class OwnerValue {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}
