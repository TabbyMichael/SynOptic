export interface CreateSessionDTO {
  userId: string;
  deviceName?: string;
  browser?: string;
  operatingSystem?: string;
  userAgent?: string;
  ipAddress?: string;
  location?: Record<string, any> | null;
  trusted?: boolean;
  expiresAt?: Date | null;
}

export interface SessionViewDTO {
  id: string;
  deviceName?: string;
  browser?: string;
  operatingSystem?: string;
  ipAddress?: string;
  location?: Record<string, any> | null;
  current: boolean;
  trusted: boolean;
  createdAt: string;
  lastUsedAt: string;
  expiresAt?: string | null;
  revoked: boolean;
}

export default CreateSessionDTO;
