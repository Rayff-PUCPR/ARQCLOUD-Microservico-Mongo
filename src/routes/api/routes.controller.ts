import { Body, Controller, Get, Inject, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AcceptRouteUseCase } from '../application/accept-route.use-case';
import { CompleteStopUseCase } from '../application/complete-stop.use-case';
import { CreateRouteInput, CreateRouteUseCase } from '../application/create-route.use-case';
import { ListRoutesUseCase } from '../application/list-routes.use-case';
import { RegisterOccurrenceUseCase } from '../application/register-occurrence.use-case';
import { ResetRoutesUseCase } from '../application/reset-routes.use-case';
import { UpdateLocationUseCase } from '../application/update-location.use-case';
import { RouteOccurrence } from '../domain/route.entity';
import { RouteStatus } from '../domain/route-status';

@ApiTags('routes')
@Controller('api/v1/routes')
export class RoutesController {
  constructor(
    @Inject(CreateRouteUseCase)
    private readonly createRouteUseCase: CreateRouteUseCase,
    @Inject(ListRoutesUseCase)
    private readonly listRoutesUseCase: ListRoutesUseCase,
    @Inject(AcceptRouteUseCase)
    private readonly acceptRouteUseCase: AcceptRouteUseCase,
    @Inject(UpdateLocationUseCase)
    private readonly updateLocationUseCase: UpdateLocationUseCase,
    @Inject(RegisterOccurrenceUseCase)
    private readonly registerOccurrenceUseCase: RegisterOccurrenceUseCase,
    @Inject(ResetRoutesUseCase)
    private readonly resetRoutesUseCase: ResetRoutesUseCase,
    @Inject(CompleteStopUseCase)
    private readonly completeStopUseCase: CompleteStopUseCase
  ) {}

  @Post()
  create(@Body() body: CreateRouteInput) {
    return this.createRouteUseCase.execute(body);
  }

  @Get()
  list(@Query('status') status?: RouteStatus) {
    return this.listRoutesUseCase.execute(status);
  }

  @Get('available')
  listAvailable() {
    return this.listRoutesUseCase.execute('AVAILABLE');
  }

  @Post('reset')
  reset() {
    return this.resetRoutesUseCase.execute();
  }

  @Post(':id/accept')
  accept(@Param('id') id: string, @Body('driverId') driverId: string) {
    return this.acceptRouteUseCase.execute(id, driverId);
  }

  @Post(':id/location')
  updateLocation(
    @Param('id') id: string,
    @Body('latitude') latitude: number,
    @Body('longitude') longitude: number
  ) {
    return this.updateLocationUseCase.execute(id, Number(latitude), Number(longitude));
  }

  @Post(':id/occurrences')
  registerOccurrence(
    @Param('id') id: string,
    @Body() body: Omit<RouteOccurrence, 'id' | 'createdAt'>
  ) {
    return this.registerOccurrenceUseCase.execute(id, body);
  }

  @Post(':id/stops/:orderId/complete')
  completeStop(@Param('id') id: string, @Param('orderId') orderId: string) {
    return this.completeStopUseCase.execute(id, orderId);
  }
}
