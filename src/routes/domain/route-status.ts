export type RouteStatus = 'AVAILABLE' | 'IN_PROGRESS' | 'FINISHED' | 'CANCELED';

const allowedTransitions: Record<RouteStatus, RouteStatus[]> = {
  AVAILABLE: ['IN_PROGRESS', 'CANCELED'],
  IN_PROGRESS: ['FINISHED', 'CANCELED'],
  FINISHED: [],
  CANCELED: []
};

export function assertRouteStatusTransition(current: RouteStatus, next: RouteStatus) {
  if (!allowedTransitions[current].includes(next)) {
    throw new Error(`Invalid route status transition from ${current} to ${next}`);
  }
}
