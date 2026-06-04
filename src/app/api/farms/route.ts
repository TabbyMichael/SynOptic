import { auth } from '../../../infrastructure/auth/auth.config';
import { farmService } from '../../../modules/farms/services/farm.service';
import { NextResponse } from 'next/server';
import { ValidationError, DomainError } from '../../../shared/errors/domain-errors';
import { z } from 'zod';

const createFarmSchema = z.object({
  name: z.string().min(3),
  county: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  acres: z.number().positive(),
});

export const POST = auth(async (req) => {
  if (!req.auth?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const validatedData = createFarmSchema.parse(body);

    const farm = await farmService.createFarm(
      req.auth.user.id,
      req.auth.user.role as any,
      validatedData
    );

    return NextResponse.json(farm, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 422 });
    }
    if (error instanceof DomainError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
});

export const GET = auth(async (req) => {
  if (!req.auth?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const farms = await farmService.listFarms(req.auth.user.id, req.auth.user.role as any);
  return NextResponse.json(farms);
});
