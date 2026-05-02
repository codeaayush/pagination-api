import { plainToInstance, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  IsUUID,
  ValidateIf,
  ValidateNested,
  validateOrReject,
} from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  BusinessUnitValue,
  CategoryValue,
  DefaultContactValue,
  HqAddressValue,
  OwnerValue,
} from './supplier-json-values';

@Entity({ name: 'suppliers' })
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  @IsOptional()
  @IsUUID()
  id: string;

  @Column({ name: 'organization_id', type: 'varchar', length: 36 })
  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @Column({ type: 'text' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Column({ type: 'text', nullable: true })
  @ValidateIf((_, v) => v != null && String(v).trim() !== '')
  @IsUrl({ require_protocol: true, require_tld: false })
  url: string | null;

  @Column({ type: 'text', nullable: true })
  @ValidateIf((_, v) => v != null)
  @IsString()
  type: string | null;

  @Column({ type: 'text', nullable: true })
  @ValidateIf((_, v) => v != null)
  @IsString()
  description: string | null;

  @Column({ type: 'text', nullable: true })
  @ValidateIf((_, v) => v != null)
  @IsString()
  status: string | null;

  @Column({ type: 'boolean', default: false })
  @IsBoolean()
  nda: boolean;

  @Column({ name: 'relevance_score', type: 'real', default: 0 })
  @IsNumber()
  relevanceScore: number;

  @Column({ type: 'simple-json', nullable: true })
  @ValidateIf((_, v) => v != null)
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  capabilities: string[] | null;

  @Column({ name: 'hq_address', type: 'simple-json', nullable: true })
  @ValidateIf((_, v) => v != null)
  @ValidateNested()
  @Type(() => HqAddressValue)
  hqAddress: HqAddressValue | null;

  @Column({ name: 'default_contact', type: 'simple-json', nullable: true })
  @ValidateIf((_, v) => v != null)
  @ValidateNested()
  @Type(() => DefaultContactValue)
  defaultContact: DefaultContactValue | null;

  @Column({ name: 'default_location', type: 'simple-json', nullable: true })
  @ValidateIf((_, v) => v != null)
  @IsObject()
  defaultLocation: Record<string, unknown> | null;

  @Column({ name: 'business_units', type: 'simple-json', nullable: true })
  @ValidateIf((_, v) => v != null)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessUnitValue)
  businessUnits: BusinessUnitValue[] | null;

  @Column({ type: 'simple-json', nullable: true })
  @ValidateIf((_, v) => v != null)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryValue)
  categories: CategoryValue[] | null;

  @Column({ type: 'simple-json', nullable: true })
  @ValidateIf((_, v) => v != null)
  @ValidateNested()
  @Type(() => OwnerValue)
  owner: OwnerValue | null;

  @Column({ type: 'simple-json', nullable: true })
  @ValidateIf((_, v) => v != null)
  @IsObject()
  metadata: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt: Date | null;

  @BeforeInsert()
  @BeforeUpdate()
  async validateEntity(): Promise<void> {
    Supplier.hydrateJsonColumns(this);
    await validateOrReject(this, { forbidUnknownValues: false });
  }

  private static hydrateJsonColumns(entity: Supplier): void {
    if (entity.hqAddress != null && !(entity.hqAddress instanceof HqAddressValue)) {
      entity.hqAddress = plainToInstance(HqAddressValue, entity.hqAddress as object);
    }
    if (
      entity.defaultContact != null &&
      !(entity.defaultContact instanceof DefaultContactValue)
    ) {
      entity.defaultContact = plainToInstance(
        DefaultContactValue,
        entity.defaultContact as object,
      );
    }
    if (entity.businessUnits != null && Array.isArray(entity.businessUnits)) {
      entity.businessUnits = (
        entity.businessUnits as unknown[]
      ).map((row: unknown) =>
        row instanceof BusinessUnitValue
          ? row
          : plainToInstance(BusinessUnitValue, row as object),
      ) as BusinessUnitValue[];
    }
    if (entity.categories != null && Array.isArray(entity.categories)) {
      entity.categories = (entity.categories as unknown[]).map(
        (row: unknown) =>
          row instanceof CategoryValue
            ? row
            : plainToInstance(CategoryValue, row as object),
      ) as CategoryValue[];
    }
    if (entity.owner != null && !(entity.owner instanceof OwnerValue)) {
      entity.owner = plainToInstance(OwnerValue, entity.owner as object);
    }
  }
}
