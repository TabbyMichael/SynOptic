import { farmRepository, FarmRepository } from '../repositories/farm.repository';
import { Farm, NewFarm } from '../repositories/farm.repository.interface';
import { FarmPolicy } from '../policies/farm.policy';
import { auditLogger } from '../../audit/services/audit-logger.service';
import { FarmNotFoundError, UnauthorizedError, ValidationError } from '../../../shared/errors/domain-errors';
import { UserRole } from '../../auth/types/auth.types';
import { logger } from '../../../infrastructure/logger/logger.service';

export class FarmService {
  constructor(private readonly repo: FarmRepository = farmRepository) {}

  async createFarm(userId: string, role: UserRole, data: Omit<NewFarm, 'ownerId'>): Promise<Farm> {
    if (!FarmPolicy.canCreate(role)) {
      throw new UnauthorizedError('User not allowed to create farms');
    }

    const farm = await this.repo.create({ ...data, ownerId: userId });

    await auditLogger.log({
      userId,
      action: 'FARM_CREATED',
      entityType: 'farm',
      entityId: farm.id,
      metadata: { name: farm.name },
    });

    return farm;
  }

  async getFarm(userId: string, role: UserRole, farmId: string): Promise<Farm> {
    const farm = await this.repo.findById(farmId);
    if (!farm) throw new FarmNotFoundError(farmId);

    if (!FarmPolicy.canView(role, userId, farm)) {
      throw new UnauthorizedError('Access denied to this farm');
    }

    return farm;
  }

  async listFarms(userId: string, role: UserRole): Promise<Farm[]> {
    if (role === 'ADMIN') {
      return this.repo.listAll();
    }
    return this.repo.findByOwnerId(userId);
  }

  async updateFarm(userId: string, role: UserRole, farmId: string, data: Partial<NewFarm>): Promise<Farm> {
    const farm = await this.repo.findById(farmId);
    if (!farm) throw new FarmNotFoundError(farmId);

    if (!FarmPolicy.canUpdate(role, userId, farm)) {
      throw new UnauthorizedError('Not allowed to update this farm');
    }

    const updatedFarm = await this.repo.update(farmId, data);

    await auditLogger.log({
      userId,
      action: 'FARM_UPDATED',
      entityType: 'farm',
      entityId: farm.id,
      metadata: { updated_fields: Object.keys(data) },
    });

    return updatedFarm;
  }

  async deleteFarm(userId: string, role: UserRole, farmId: string): Promise<void> {
    const farm = await this.repo.findById(farmId);
    if (!farm) throw new FarmNotFoundError(farmId);

    if (!FarmPolicy.canDelete(role, userId, farm)) {
      throw new UnauthorizedError('Not allowed to delete this farm');
    }

    await this.repo.delete(farmId);
    
    logger.info({ msg: 'Farm deleted', farmId, userId });
  }
}

export const farmService = new FarmService();
