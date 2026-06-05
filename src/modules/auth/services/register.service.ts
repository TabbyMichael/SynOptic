import { userRepository } from '../../../repositories/user.repository';
import { PasswordUtils } from '../utils/password';
import { RegisterDTO } from '../dtos/auth.dto';
import { logger } from '../../../infrastructure/logger/logger.service';
import { auditLogger } from '../../audit/services/audit-logger.service';

export class RegisterService {
  constructor(private repo = userRepository) {}

  async register(dto: RegisterDTO) {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) {
      throw new Error('User already exists');
    }

    const passwordHash = await PasswordUtils.hash(dto.password);

    const user = await this.repo.create({
      email: dto.email,
      name: dto.name,
      passwordHash,
      role: 'FARMER',
    });

    await auditLogger.log({
      userId: user.id,
      action: 'USER_REGISTERED',
      entityType: 'user',
      entityId: user.id,
      metadata: { email: user.email },
    });

    logger.info({ userId: user.id }, 'user_registered');

    return user;
  }
}

export const registerService = new RegisterService();
