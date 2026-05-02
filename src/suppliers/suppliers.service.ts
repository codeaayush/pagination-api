import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { QuerySuppliersDto } from './dto/query-suppliers.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { Supplier } from './entities/supplier.entity';
import { supplierToSnake } from './supplier.mapper';

const SORT_COLUMN: Record<string, string> = {
  name: 's.name',
  status: 's.status',
  created_at: 's.created_at',
  updated_at: 's.updated_at',
  relevance_score: 's.relevance_score',
  type: 's.type',
  description: 's.description',
};

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(Supplier)
    private readonly repo: Repository<Supplier>,
  ) {}

  async create(dto: CreateSupplierDto) {
    const row = this.repo.create({
      organizationId: dto.organization_id,
      name: dto.name,
      url: dto.url ?? null,
      type: dto.type ?? null,
      description: dto.description ?? null,
      status: dto.status ?? null,
      nda: dto.nda ?? false,
      relevanceScore: dto.relevance_score ?? 0,
      capabilities: dto.capabilities ?? null,
      hqAddress: dto.hq_address ?? null,
      defaultContact: dto.default_contact ?? null,
      defaultLocation: dto.default_location ?? null,
      businessUnits: dto.business_units ?? null,
      categories: dto.categories ?? null,
      owner: dto.owner ?? null,
      metadata: dto.metadata ?? null,
    });
    const saved = await this.repo.save(row);
    return { id: saved.id, message: 'supplier_created' as const };
  }

  async findAll(query: QuerySuppliersDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const sortBy = query.sort_by ?? 'created_at';
    const order = (query.order ?? 'desc').toUpperCase() as 'ASC' | 'DESC';

    const qb = this.repo
      .createQueryBuilder('s')
      .where('s.deleted_at IS NULL');

    if (query.search?.trim()) {
      const term = `%${query.search.trim()}%`;
      qb.andWhere(
        new Brackets((w) => {
          w.where('LOWER(s.name) LIKE LOWER(:term)', { term }).orWhere(
            'LOWER(s.description) LIKE LOWER(:term)',
            { term },
          );
        }),
      );
    }

    if (query.status) {
      qb.andWhere('s.status = :status', { status: query.status });
    }

    if (query.capability) {
      qb.andWhere(
        `(s.capabilities IS NOT NULL AND EXISTS (
          SELECT 1 FROM json_each(s.capabilities) j WHERE j.value = :capability
        ))`,
        { capability: query.capability },
      );
    }

    if (query.country) {
      qb.andWhere(
        `(s.hq_address IS NOT NULL AND json_extract(s.hq_address, '$.country') = :country)`,
        { country: query.country },
      );
    }

    if (query.category_id) {
      qb.andWhere(
        `(s.categories IS NOT NULL AND EXISTS (
          SELECT 1 FROM json_each(s.categories) j
          WHERE json_extract(j.value, '$.id') = :categoryId
        ))`,
        { categoryId: query.category_id },
      );
    }

    if (query.owner_email) {
      qb.andWhere(
        `(s.owner IS NOT NULL AND json_extract(s.owner, '$.email') = :ownerEmail)`,
        { ownerEmail: query.owner_email },
      );
    }

    const sortCol = SORT_COLUMN[sortBy] ?? 's.created_at';
    qb.orderBy(sortCol, order);

    const total = await qb.clone().getCount();
    qb.skip((page - 1) * limit).take(limit);
    const rows = await qb.getMany();

    return {
      data: rows.map(supplierToSnake),
      page,
      limit,
      total,
    };
  }

  async findOne(id: string) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException('Supplier not found');
    }
    return supplierToSnake(row);
  }

  async update(id: string, dto: UpdateSupplierDto) {
    const row = await this.repo.findOne({ where: { id } });
    if (!row) {
      throw new NotFoundException('Supplier not found');
    }

    if (dto.organization_id !== undefined) {
      row.organizationId = dto.organization_id;
    }
    if (dto.name !== undefined) {
      row.name = dto.name;
    }
    if (dto.url !== undefined) {
      row.url = dto.url ?? null;
    }
    if (dto.type !== undefined) {
      row.type = dto.type ?? null;
    }
    if (dto.description !== undefined) {
      row.description = dto.description ?? null;
    }
    if (dto.status !== undefined) {
      row.status = dto.status ?? null;
    }
    if (dto.nda !== undefined) {
      row.nda = dto.nda;
    }
    if (dto.relevance_score !== undefined) {
      row.relevanceScore = dto.relevance_score;
    }
    if (dto.capabilities !== undefined) {
      row.capabilities = dto.capabilities ?? null;
    }
    if (dto.hq_address !== undefined) {
      row.hqAddress = dto.hq_address ?? null;
    }
    if (dto.default_contact !== undefined) {
      row.defaultContact = dto.default_contact ?? null;
    }
    if (dto.default_location !== undefined) {
      row.defaultLocation = dto.default_location ?? null;
    }
    if (dto.business_units !== undefined) {
      row.businessUnits = dto.business_units ?? null;
    }
    if (dto.categories !== undefined) {
      row.categories = dto.categories ?? null;
    }
    if (dto.owner !== undefined) {
      row.owner = dto.owner ?? null;
    }
    if (dto.metadata !== undefined) {
      row.metadata = dto.metadata ?? null;
    }

    const saved = await this.repo.save(row);
    return supplierToSnake(saved);
  }

  async remove(id: string) {
    const res = await this.repo.softDelete({ id });
    if (!res.affected) {
      throw new NotFoundException('Supplier not found');
    }
    return { id, message: 'supplier_deleted' as const };
  }
}
