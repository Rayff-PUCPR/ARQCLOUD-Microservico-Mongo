import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryRoute } from '../domain/route.entity';
import { ROUTE_REPOSITORY, RouteRepository } from '../domain/route.repository';

@Injectable()
export class AcceptRouteUseCase {
  constructor(
    @Inject(ROUTE_REPOSITORY) private readonly routeRepository: RouteRepository
  ) {}

  async execute(routeId: string, driverId: string) {
    const routeProps = await this.routeRepository.findById(routeId);
    if (!routeProps) {
      throw new NotFoundException('Route not found');
    }

    const route = DeliveryRoute.restore(routeProps);
    try {
      route.accept(driverId);
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    return this.routeRepository.save(route);
  }
}
