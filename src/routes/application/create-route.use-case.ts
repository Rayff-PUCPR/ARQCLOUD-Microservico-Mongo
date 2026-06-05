import { Inject, Injectable } from '@nestjs/common';
import { DeliveryRoute, RouteStop } from '../domain/route.entity';
import { ROUTE_REPOSITORY, RouteRepository } from '../domain/route.repository';

export interface CreateRouteInput {
  region: string;
  origin: string;
  destination: string;
  stops: RouteStop[];
  estimatedDistanceKm: number;
  estimatedDurationMinutes: number;
  score: number;
}

@Injectable()
export class CreateRouteUseCase {
  constructor(
    @Inject(ROUTE_REPOSITORY) private readonly routeRepository: RouteRepository
  ) {}

  execute(input: CreateRouteInput) {
    const route = DeliveryRoute.create(input);
    return this.routeRepository.create(route);
  }
}
