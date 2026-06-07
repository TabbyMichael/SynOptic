import { userRepository } from '../../../repositories/user.repository';
import { createSessionService } from './createSession.service';
import { refreshTokenRepository } from '../repositories/refreshToken.repository';
import { JwtUtils } from '../utils/jwt';
import { PasswordUtils } from '../utils/password';
import { LoginDTO } from '../dtos/auth.dto';
import { CreateSessionDTO } from '../dtos/session.dto';
import { logger } from '../../../infrastructure/logger/logger.service';
import { createHash } from 'crypto';

export class LoginService {
  constructor(
    private userRepo = userRepository,
    private sessionService = createSessionService,
    private tokenRepo = refreshTokenRepository
  ) {}

  async login(dto: LoginDTO, deviceInfo: Omit<CreateSessionDTO, 'userId'>) {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || !user.passwordHash) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await PasswordUtils.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Email Verification Check
    if (!user.isVerified) {
        throw new Error('Email not verified. Please check your inbox.');
    }

    const session = await this.sessionService.create({
      userId: user.id,
      ...deviceInfo,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      sid: session.id,
    };

    const accessToken = JwtUtils.signAccessToken(payload);
    const refreshToken = JwtUtils.signRefreshToken(payload);

    const refreshTokenHash = createHash('sha256').update(refreshToken).digest('hex');

    await this.tokenRepo.create({
      userId: user.id,
      sessionId: session.id,
      tokenHash: refreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    logger.info({ userId: user.id, sessionId: session.id }, 'user_logged_in');

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }
}

export const loginService = new LoginService();
