import { Supplier } from './entities/supplier.entity';

export function supplierToSnake(s: Supplier) {
  return {
    id: s.id,
    organization_id: s.organizationId,
    name: s.name,
    url: s.url,
    type: s.type,
    description: s.description,
    status: s.status,
    nda: s.nda,
    relevance_score: s.relevanceScore,
    capabilities: s.capabilities,
    hq_address: s.hqAddress,
    default_contact: s.defaultContact,
    default_location: s.defaultLocation,
    business_units: s.businessUnits,
    categories: s.categories,
    owner: s.owner,
    metadata: s.metadata,
    created_at: s.createdAt,
    updated_at: s.updatedAt,
    deleted_at: s.deletedAt,
  };
}
