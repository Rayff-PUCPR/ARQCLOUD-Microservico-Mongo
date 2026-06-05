import { describe, expect, it } from 'vitest';
import { DeliveryRoute, RouteProps } from '../domain/route.entity';
import { RouteRepository } from '../domain/route.repository';
import { CreateRouteUseCase } from './create-route.use-case';

class FakeRouteRepository implements RouteRepository {
  routes: RouteProps[] = [];

  async create(route: DeliveryRoute) {
    const props = route.toJSON();
    this.routes.push(props);
    return props;
  }

  async findAll() {
    return this.routes;
  }

  async findById(id: string) {
    return this.routes.find((route) => route.id === id);
  }

  async findByStatus(status: RouteProps['status']) {
    return this.routes.filter((route) => route.status === status);
  }

  async save(route: DeliveryRoute) {
    const props = route.toJSON();
    this.routes = this.routes.map((item) => (item.id === props.id ? props : item));
    return props;
  }

  async reset() {
    this.routes = [];
  }
}

describe('CreateRouteUseCase', () => {
  it('creates a route through repository port', async () => {
    const repository = new FakeRouteRepository();
    const useCase = new CreateRouteUseCase(repository);

    const route = await useCase.execute({
      region: 'Centro',
      origin: 'Base',
      destination: 'Centro',
      estimatedDistanceKm: 8,
      estimatedDurationMinutes: 20,
      score: 95,
      stops: []
    });

    expect(route.status).toBe('AVAILABLE');
    expect(repository.routes).toHaveLength(1);
  });
});
