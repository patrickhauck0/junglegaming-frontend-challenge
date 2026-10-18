import { z } from 'zod';
import { NftSchema } from './nft';
import { OrderSchema } from './order';

export const RealtimeEventTypeEnum = z.enum(['nft.updated', 'order.updated']);
export type RealtimeEventType = z.infer<typeof RealtimeEventTypeEnum>;

export interface RealtimeEvent<T = unknown> {
  eventId: string;
  event: RealtimeEventType;
  resourceId: string;
  version: number;
  timestamp: string;
  userId?: string;
  payload: T;
}

export type NftUpdatedEvent = RealtimeEvent<z.infer<typeof NftSchema>>;
export type OrderUpdatedEvent = RealtimeEvent<z.infer<typeof OrderSchema>>;
