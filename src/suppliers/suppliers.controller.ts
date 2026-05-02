import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  CreateSupplierResponseDto,
  DeleteSupplierResponseDto,
  PaginatedSuppliersResponseDto,
} from '../swagger/supplier-api-responses.dto';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { QuerySuppliersDto } from './dto/query-suppliers.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { SuppliersService } from './suppliers.service';

@ApiTags('Suppliers')
@ApiExtraModels(
  CreateSupplierDto,
  UpdateSupplierDto,
  QuerySuppliersDto,
  CreateSupplierResponseDto,
  PaginatedSuppliersResponseDto,
  DeleteSupplierResponseDto,
)
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @ApiOperation({ summary: 'Create supplier' })
  @ApiBody({ type: CreateSupplierDto })
  @ApiResponse({
    status: 201,
    description: 'Supplier created',
    type: CreateSupplierResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  create(@Body() dto: CreateSupplierDto) {
    return this.suppliersService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'List suppliers',
    description:
      'Search, filters (status, capability, country, category_id, owner_email), sort, pagination',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Matches name and description (case-insensitive)',
  })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({
    name: 'capability',
    required: false,
    type: String,
    description: 'Single capability value (e.g. cleaning)',
  })
  @ApiQuery({
    name: 'country',
    required: false,
    type: String,
    description: 'hq_address.country',
  })
  @ApiQuery({
    name: 'category_id',
    required: false,
    type: String,
    format: 'uuid',
  })
  @ApiQuery({ name: 'owner_email', required: false, type: String })
  @ApiQuery({
    name: 'sort_by',
    required: false,
    enum: [
      'name',
      'status',
      'created_at',
      'updated_at',
      'relevance_score',
      'type',
      'description',
    ],
  })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({
    status: 200,
    description: 'Paginated list',
    type: PaginatedSuppliersResponseDto,
  })
  findAll(@Query() query: QuerySuppliersDto) {
    return this.suppliersService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get supplier by id' })
  @ApiParam({ name: 'id', format: 'uuid', description: 'Supplier id' })
  @ApiResponse({
    status: 200,
    description: 'Supplier (snake_case keys)',
    schema: {
      type: 'object',
      additionalProperties: true,
      example: {
        id: 'uuid',
        organization_id: 'uuid',
        name: 'Acme',
        capabilities: ['cleaning'],
        hq_address: { country: 'kr' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.suppliersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update supplier',
    description: 'Partial update; JSON fields are replaced when sent',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiBody({ type: UpdateSupplierDto })
  @ApiResponse({
    status: 200,
    description: 'Updated supplier (snake_case keys)',
    schema: { type: 'object', additionalProperties: true },
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 404, description: 'Not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateSupplierDto,
  ) {
    return this.suppliersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft-delete supplier' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Soft-deleted',
    type: DeleteSupplierResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.suppliersService.remove(id);
  }
}
