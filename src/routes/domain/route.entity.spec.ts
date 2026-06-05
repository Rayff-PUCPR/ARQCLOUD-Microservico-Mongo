import { describe, expect, it } from 'vitest';
import { DeliveryRoute } from './route.entity';

function makeRoute() {
  return DeliveryRoute.create({
    region: 'Centro',
    origin: 'Base',
    destination: 'Centro',
    estimatedDistanceKm: 10,
    estimatedDurationMinutes: 30,
    score: 90,
    stops: [
      {
        orderId: 'order-1',
        customerName: 'Cliente',
        address: 'Rua Teste',
        sequence: 1,
        status: 'PENDING'
      }
    ]
  });
}

describe('DeliveryRoute entity', () => {
  it('creates an available route', () => {
    const route = makeRoute().toJSON();

    expect(route.id).toBeTruthy();
    expect(route.status).toBe('AVAILABLE');
    expect(route.stops).toHaveLength(1);
  });

  it('assigns a driver when accepted', () => {
    const route = makeRoute();

    route.accept('driver-1');

    expect(route.toJSON().driverId).toBe('driver-1');
    expect(route.toJSON().status).toBe('IN_PROGRESS');
  });
});
