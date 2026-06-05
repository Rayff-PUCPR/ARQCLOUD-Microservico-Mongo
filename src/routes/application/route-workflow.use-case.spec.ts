import { BadRequestException, NotFoundException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { DeliveryRoute, RouteProps } from '../domain/route.entity';
import { RouteRepository } from '../domain/route.repository';
import { RouteStatus } from '../domain/route-status';
import { AcceptRouteUseCase } from './accept-route.use-case';
import { CompleteStopUseCase } from './complete-stop.use-case';
import { RegisterOccurrenceUseCase } from './register-occurrence.use-case';
import { UpdateLocationUseCase } from './update-location.use-case';

class FakeRouteRepository implements RouteRepository {
  routes = new Map<string, RouteProps>();

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

describe('Route workflow use cases', () => {
  it('accepts a route, updates location and registers an occurrence', async () => {
    const repository = new FakeRouteRepository();
    const route = await repository.create(makeRoute());

    const accepted = await new AcceptRouteUseCase(repository).execute(route.id, 'driver-1');
    const located = await new UpdateLocationUseCase(repository).execute(route.id, -25.4515, -49.2525);
    const withOccurrence = await new RegisterOccurrenceUseCase(repository).execute(route.id, {
      type: 'DELAY',
      description: 'Transito intenso na regiao'
    });

    expect(accepted.status).toBe('IN_PROGRESS');
    expect(accepted.driverId).toBe('driver-1');
    expect(located.locationHistory).toHaveLength(1);
    expect(withOccurrence.occurrences[0]).toMatchObject({
      type: 'DELAY',
      description: 'Transito intenso na regiao'
    });
  });

  it('finishes a route when all stops are completed', async () => {
    const repository = new FakeRouteRepository();
    const route = makeRoute();
    route.accept('driver-1');
    const saved = await repository.create(route);
    const useCase = new CompleteStopUseCase(repository);

    const firstStop = await useCase.execute(saved.id, 'order-1');
    expect(firstStop.status).toBe('IN_PROGRESS');
    expect(firstStop.stops[0].status).toBe('COMPLETED');

    const finished = await useCase.execute(saved.id, 'order-2');

    expect(finished.status).toBe('FINISHED');
  });

  it('rejects location updates before a route is accepted', async () => {
    const repository = new FakeRouteRepository();
    const route = await repository.create(makeRoute());
    const useCase = new UpdateLocationUseCase(repository);

    await expect(useCase.execute(route.id, -25.4515, -49.2525)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('returns not found when a route does not exist', async () => {
    const repository = new FakeRouteRepository();
    const useCase = new AcceptRouteUseCase(repository);

    await expect(useCase.execute('missing-route', 'driver-1')).rejects.toBeInstanceOf(NotFoundException);
  });
});

function makeRoute() {
  return DeliveryRoute.create({
    region: 'Centro',
    origin: 'Base',
    destination: 'Centro',
    estimatedDistanceKm: 8.4,
    estimatedDurationMinutes: 31,
    score: 91,
    stops: [
      {
        orderId: 'order-1',
        customerName: 'Cliente 1',
        address: 'Rua 1',
        sequence: 1,
        status: 'PENDING'
      },
      {
        orderId: 'order-2',
        customerName: 'Cliente 2',
        address: 'Rua 2',
        sequence: 2,
        status: 'PENDING'
      }
    ]
  });
}
