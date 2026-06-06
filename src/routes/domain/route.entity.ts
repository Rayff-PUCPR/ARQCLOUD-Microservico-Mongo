import { randomUUID } from 'node:crypto';
import { RouteStatus, assertRouteStatusTransition } from './route-status';

export interface GpsCoordinate {
  latitude: number;
  longitude: number;
  recordedAt: string;
}

export interface RouteStop {
  orderId: string;
  customerName: string;
  address: string;
  sequence: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  latitude?: number;
  longitude?: number;
}

export interface RouteOccurrence {
  id: string;
  type: 'WRONG_ADDRESS' | 'CUSTOMER_ABSENT' | 'DELAY' | 'DELIVERY_FAILED' | 'OTHER';
  description: string;
  createdAt: string;
}

export interface RouteProps {
  id: string;
  region: string;
  origin: string;
  destination: string;
  stops: RouteStop[];
  status: RouteStatus;
  driverId?: string;
  estimatedDistanceKm: number;
  estimatedDurationMinutes: number;
  score: number;
  locationHistory: GpsCoordinate[];
  occurrences: RouteOccurrence[];
  createdAt: string;
  updatedAt: string;
}

export class DeliveryRoute {
  private constructor(private readonly props: RouteProps) {}

  static create(input: Omit<RouteProps, 'id' | 'status' | 'driverId' | 'locationHistory' | 'occurrences' | 'createdAt' | 'updatedAt'>) {
    const now = new Date().toISOString();
    return new DeliveryRoute({
      ...input,
      id: randomUUID(),
      status: 'AVAILABLE',
      locationHistory: [],
      occurrences: [],
      createdAt: now,
      updatedAt: now
    });
  }

  static restore(props: RouteProps) {
    return new DeliveryRoute(props);
  }

  accept(driverId: string) {
    if (this.props.driverId) {
      throw new Error('Route already has a driver');
    }
    assertRouteStatusTransition(this.props.status, 'IN_PROGRESS');
    this.props.driverId = driverId;
    this.props.status = 'IN_PROGRESS';
    this.touch();
  }

  updateLocation(coordinate: Omit<GpsCoordinate, 'recordedAt'>) {
    if (this.props.status !== 'IN_PROGRESS') {
      throw new Error('Location can only be updated for routes in progress');
    }
    this.props.locationHistory.push({
      ...coordinate,
      recordedAt: new Date().toISOString()
    });
    this.touch();
  }

  addOccurrence(input: Omit<RouteOccurrence, 'id' | 'createdAt'>) {
    if (this.props.status === 'FINISHED' || this.props.status === 'CANCELED') {
      throw new Error('Occurrences cannot be added to finished or canceled routes');
    }
    this.props.occurrences.push({
      ...input,
      id: randomUUID(),
      createdAt: new Date().toISOString()
    });
    this.touch();
  }

  completeStop(orderId: string) {
    const stop = this.props.stops.find((item) => item.orderId === orderId);
    if (!stop) {
      throw new Error('Route stop not found');
    }
    stop.status = 'COMPLETED';

    if (this.props.stops.every((item) => item.status === 'COMPLETED')) {
      assertRouteStatusTransition(this.props.status, 'FINISHED');
      this.props.status = 'FINISHED';
    }

    this.touch();
  }

  finish() {
    assertRouteStatusTransition(this.props.status, 'FINISHED');
    this.props.stops = this.props.stops.map((stop) => ({
      ...stop,
      status: stop.status === 'FAILED' ? stop.status : 'COMPLETED'
    }));
    this.props.status = 'FINISHED';
    this.touch();
  }

  private touch() {
    this.props.updatedAt = new Date().toISOString();
  }

  toJSON(): RouteProps {
    return {
      ...this.props,
      stops: this.props.stops.map((stop) => ({ ...stop })),
      locationHistory: this.props.locationHistory.map((coordinate) => ({ ...coordinate })),
      occurrences: this.props.occurrences.map((occurrence) => ({ ...occurrence }))
    };
  }
}
