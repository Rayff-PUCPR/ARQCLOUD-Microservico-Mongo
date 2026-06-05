import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeliveryRoute } from '../domain/route.entity';
import { ROUTE_REPOSITORY, RouteRepository } from '../domain/route.repository';

@Injectable()
export class UpdateLocationUseCase {
  constructor(
    @Inject(ROUTE_REPOSITORY) private readonly routeRepository: RouteRepository
  ) {}

  async execute(routeId: string, latitude: number, longitude: number) {
    const routeProps = await this.routeRepository.findById(routeId);
    if (!routeProps) {
      throw new NotFoundException('Route not found');
    }

    const route = DeliveryRoute.restore(routeProps);
    try {
      route.updateLocation({ latitude, longitude });
    } catch (error) {
      throw new BadRequestException((error as Error).message);
    }

    return this.routeRepository.save(route);
  }
}
