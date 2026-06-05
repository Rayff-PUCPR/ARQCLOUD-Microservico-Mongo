import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  getHealth() {
    return {
      service: 'microservico-mongo',
      status: 'ok',
      timestamp: new Date().toISOString()
    };
  }
}
