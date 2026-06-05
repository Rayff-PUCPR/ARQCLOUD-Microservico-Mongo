import { Inject, Injectable } from '@nestjs/common';
import { ROUTE_REPOSITORY, RouteRepository } from '../domain/route.repository';

@Injectable()
export class ResetRoutesUseCase {
  constructor(
    @Inject(ROUTE_REPOSITORY) private readonly routeRepository: RouteRepository
  ) {}

  async execute() {
    await this.routeRepository.reset();
    return { reset: true };
  }
}
