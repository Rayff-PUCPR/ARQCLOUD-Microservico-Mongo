import { Module } from '@nestjs/common';
import { getPersistenceDriver } from '../config/app.config';
import { AcceptRouteUseCase } from './application/accept-route.use-case';
import { CompleteStopUseCase } from './application/complete-stop.use-case';
import { CreateRouteUseCase } from './application/create-route.use-case';
import { ListRoutesUseCase } from './application/list-routes.use-case';
import { RegisterOccurrenceUseCase } from './application/register-occurrence.use-case';
import { ResetRoutesUseCase } from './application/reset-routes.use-case';
import { UpdateLocationUseCase } from './application/update-location.use-case';
import { ROUTE_REPOSITORY } from './domain/route.repository';
import { InMemoryRouteRepository } from './infrastructure/in-memory-route.repository';
import { MongoRouteRepository } from './infrastructure/mongo-route.repository';
import { RoutesController } from './api/routes.controller';

@Module({
  controllers: [RoutesController],
  providers: [
    CreateRouteUseCase,
    ListRoutesUseCase,
    AcceptRouteUseCase,
    UpdateLocationUseCase,
    RegisterOccurrenceUseCase,
    ResetRoutesUseCase,
    CompleteStopUseCase,
    InMemoryRouteRepository,
    MongoRouteRepository,
    {
      provide: ROUTE_REPOSITORY,
      useFactory: (
        inMemoryRouteRepository: InMemoryRouteRepository,
        mongoRouteRepository: MongoRouteRepository
      ) => {
        return getPersistenceDriver() === 'mongodb-atlas'
          ? mongoRouteRepository
          : inMemoryRouteRepository;
      },
      inject: [InMemoryRouteRepository, MongoRouteRepository]
    }
  ]
})
export class RoutesModule {}
