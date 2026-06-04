import { farmRepository } from '../../../../modules/farms/repositories/farm.repository';
import { weatherService } from '../../../../modules/weather/services/weather.service';
import { alertService } from '../../../../modules/alerts/services/alert.service';
import { logger } from '../../../../infrastructure/logger/logger.service';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // Check Vercel Cron Secret
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  logger.info('Starting Weather Monitor Job');

  try {
    const farms = await farmRepository.listAll();
    
    for (const farm of farms) {
      try {
        const snapshot = await weatherService.storeWeatherSnapshot(farm.id, farm.latitude, farm.longitude);
        await alertService.evaluateRules(farm.id, snapshot);
      } catch (error) {
        logger.error({ msg: 'Failed to process farm weather', farmId: farm.id, error });
      }
    }

    logger.info('Weather Monitor Job completed');
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error({ msg: 'Weather Monitor Job failed', error });
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
