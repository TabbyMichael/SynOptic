import { UserRole } from '../../auth/types/auth.types';
import { Farm } from '../repositories/farm.repository.interface';

export class FarmPolicy {
  static canCreate(role: UserRole): boolean {
    return role === 'ADMIN' || role === 'FARMER';
  }

  static canUpdate(role: UserRole, userId: string, farm: Farm): boolean {
    if (role === 'ADMIN') return true;
    return farm.ownerId === userId;
  }

  static canDelete(role: UserRole, userId: string, farm: Farm): boolean {
    if (role === 'ADMIN') return true;
    return farm.ownerId === userId;
  }

  static canView(role: UserRole, userId: string, farm: Farm): boolean {
    if (role === 'ADMIN') return true;
    return farm.ownerId === userId;
  }

  static canList(role: UserRole): boolean {
    return true; // Everyone can list their own or all if admin
  }
}
