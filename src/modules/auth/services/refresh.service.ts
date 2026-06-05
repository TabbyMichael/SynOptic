import { refreshTokenRepository } from '../repositories/refreshToken.repository';
import { sessionRepository } from '../repositories/session.repository';
import { userRepository } from '../../../repositories/user.repository';
import { JwtUtils, TokenPayload } from '../utils/jwt';
import { createHash } from 'crypto';
import { logger } from '../../../infrastructure/logger/logger.service';

export class RefreshService {
  constructor(
    private tokenRepo = refreshTokenRepository,
    private sessionRepo = sessionRepository,
    private userRepo = userRepository
  ) {}

  async refresh(token: string) {
    let payload: TokenPayload;
    try {
      payload = JwtUtils.verifyRefreshToken(token);
    } catch (e) {
      throw new Error('Invalid refresh token');
    }

    const tokenHash = createHash('sha256').update(token).digest('hex');
    const dbToken = await this.tokenRepo.findByTokenHash(tokenHash);

    if (!dbToken || dbToken.revoked || (dbToken.expiresAt && dbToken.expiresAt < new Date())) {
      // If token is found but revoked, it might be a reuse attack
      if (dbToken && dbToken.revoked) {
        logger.warn({ sessionId: dbToken.sessionId, userId: dbToken.userId }, 'refresh_token_reuse_detected');
        await this.sessionRepo.revoke(dbToken.sessionId);
      }
      throw new Error('Invalid refresh token');
    }

    const user = await this.userRepo.findById(payload.sub);
    if (!user) throw new Error('User not found');

    const newPayload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      sid: payload.sid,
    };

    const newAccessToken = JwtUtils.signAccessToken(newPayload);
    const newRefreshToken = JwtUtils.signRefreshToken(newPayload);
    const newRefreshTokenHash = createHash('sha256').update(newRefreshToken).digest('hex');

    await this.tokenRepo.replace(dbToken.id, {
      userId: user.id,
      sessionId: payload.sid,
      tokenHash: newRefreshTokenHash,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      rotationCount: (dbToken.rotationCount || 0) + 1,
    });

    await this.sessionRepo.update(payload.sid, { lastUsedAt: new Date() });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}

export const refreshService = new RefreshService();
