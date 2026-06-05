import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { RoutesModule } from './routes/routes.module';

@Module({
  imports: [RoutesModule],
  controllers: [HealthController]
})
export class AppModule {}
