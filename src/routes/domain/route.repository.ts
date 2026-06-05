import { DeliveryRoute, RouteProps } from './route.entity';
import { RouteStatus } from './route-status';

export const ROUTE_REPOSITORY = Symbol('ROUTE_REPOSITORY');

export interface RouteRepository {
  create(route: DeliveryRoute): Promise<RouteProps>;
  findAll(): Promise<RouteProps[]>;
  findById(id: string): Promise<RouteProps | undefined>;
  findByStatus(status: RouteStatus): Promise<RouteProps[]>;
  save(route: DeliveryRoute): Promise<RouteProps>;
  reset(): Promise<void>;
}
