import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'suppliers' })
export class Supplier {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'organization_id', type: 'varchar', length: 36 })
  organizationId: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  url: string | null;

  @Column({ type: 'text', nullable: true })
  type: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'text', nullable: true })
  status: string | null;

  @Column({ type: 'boolean', default: false })
  nda: boolean;

  @Column({ name: 'relevance_score', type: 'real', default: 0 })
  relevanceScore: number;

  @Column({ type: 'simple-json', nullable: true })
  capabilities: unknown;

  @Column({ name: 'hq_address', type: 'simple-json', nullable: true })
  hqAddress: unknown;

  @Column({ name: 'default_contact', type: 'simple-json', nullable: true })
  defaultContact: unknown;

  @Column({ name: 'default_location', type: 'simple-json', nullable: true })
  defaultLocation: unknown;

  @Column({ name: 'business_units', type: 'simple-json', nullable: true })
  businessUnits: unknown;

  @Column({ type: 'simple-json', nullable: true })
  categories: unknown;

  @Column({ type: 'simple-json', nullable: true })
  owner: unknown;

  @Column({ type: 'simple-json', nullable: true })
  metadata: unknown;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime', nullable: true })
  deletedAt: Date | null;
}
