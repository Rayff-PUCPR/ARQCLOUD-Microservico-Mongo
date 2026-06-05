import { Inject, Injectable } from '@nestjs/common';
import { ROUTE_REPOSITORY, RouteRepository } from '../domain/route.repository';
import { RouteStatus } from '../domain/route-status';

@Injectable()
export class ListRoutesUseCase {
  constructor(
    @Inject(ROUTE_REPOSITORY) private readonly routeRepository: RouteRepository
  ) {}

  execute(status?: RouteStatus) {
    return status ? this.routeRepository.findByStatus(status) : this.routeRepository.findAll();
  }
}
