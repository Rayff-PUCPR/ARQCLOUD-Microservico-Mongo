import { Injectable } from '@nestjs/common';
import { DeliveryRoute, RouteProps } from '../domain/route.entity';
import { RouteRepository } from '../domain/route.repository';
import { RouteStatus } from '../domain/route-status';

@Injectable()
export class InMemoryRouteRepository implements RouteRepository {
  private readonly routes = new Map<string, RouteProps>();

  constructor() {
    const route = DeliveryRoute.create({
      region: 'Centro',
      origin: 'PUCPR - Curitiba',
      destination: 'Centro de Curitiba',
      estimatedDistanceKm: 8.4,
      estimatedDurationMinutes: 31,
      score: 91,
      stops: [
        {
          orderId: 'sample-order-1',
          customerName: 'Marina Costa',
          address: 'Rua Imaculada Conceicao, 1155 - Prado Velho',
          sequence: 1,
          status: 'PENDING',
          latitude: -25.4515,
          longitude: -49.2525
        },
        {
          orderId: 'sample-order-2',
          customerName: 'Andre Lima',
          address: 'Avenida Sete de Setembro, 2775 - Centro',
          sequence: 2,
          status: 'PENDING',
          latitude: -25.4386,
          longitude: -49.2707
        }
      ]
    });

    this.routes.set(route.toJSON().id, route.toJSON());
  }

  async create(route: DeliveryRoute) {
    const props = route.toJSON();
    this.routes.set(props.id, props);
    return props;
  }

  async findAll() {
    return Array.from(this.routes.values());
  }

  async findById(id: string) {
    return this.routes.get(id);
  }

  async findByStatus(status: RouteStatus) {
    return Array.from(this.routes.values()).filter((route) => route.status === status);
  }

  async save(route: DeliveryRoute) {
    const props = route.toJSON();
    this.routes.set(props.id, props);
    return props;
  }

  async reset() {
    this.routes.clear();
  }
}
