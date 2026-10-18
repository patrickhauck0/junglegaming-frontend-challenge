import { ws } from 'msw';
import { toSocketIo } from '@mswjs/socket.io-binding';
import type { NftUpdatedEvent, OrderUpdatedEvent } from '@/contracts/socket';
import { getDb, saveDb } from './db';

type EventListener = (event: string, data: any) => void;
const activeListeners = new Set<EventListener>();

export function registerSocketListener(fn: EventListener): () => void {
  activeListeners.add(fn);
  return () => activeListeners.delete(fn);
}

export function emitMockEvent(event: string, data: any): void {
  activeListeners.forEach((listener) => {
    try {
      listener(event, data);
    } catch {
      // Falha isolada de listener ignorada
    }
  });
}

export function broadcastNftUpdated(
  nftId: string,
  newPriceEth?: string,
  newAvailableEditions?: number
): NftUpdatedEvent | null {
  const db = getDb();
  const nft = db.nfts.find((n) => n.id === nftId);
  if (!nft) return null;

  if (newPriceEth !== undefined) nft.priceEth = newPriceEth;
  if (newAvailableEditions !== undefined) nft.availableEditions = newAvailableEditions;
  nft.version += 1;
  saveDb(db);

  const event: NftUpdatedEvent = {
    eventId: `evt_nft_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    event: 'nft.updated',
    resourceId: nft.id,
    version: nft.version,
    timestamp: new Date().toISOString(),
    payload: { ...nft },
  };

  emitMockEvent('nft.updated', event);
  return event;
}

export function broadcastOrderUpdated(
  orderId: string,
  status: 'confirmed' | 'declined',
  userId?: string
): OrderUpdatedEvent | null {
  const db = getDb();
  const order = db.orders.find((o) => o.id === orderId);
  if (!order) return null;

  order.status = status;
  if (status === 'confirmed') {
    order.confirmedAt = new Date().toISOString();
  }
  saveDb(db);

  const event: OrderUpdatedEvent = {
    eventId: `evt_ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    event: 'order.updated',
    resourceId: order.id,
    version: 2,
    timestamp: new Date().toISOString(),
    userId: userId || order.userId,
    payload: { ...order },
  };

  emitMockEvent('order.updated', event);
  return event;
}

// Interceptor MSW WebSocket compatível com o protocolo Socket.IO
const wsBaseUrl = typeof window !== 'undefined' ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}` : 'ws://localhost:5173';
export const socketIoBridge = ws.link(wsBaseUrl);

export const wsHandler = socketIoBridge.addEventListener('connection', (connection) => {
  const io = toSocketIo(connection);

  const unsubscribe = registerSocketListener((eventName, data) => {
    io.client.emit(eventName, data);
  });

  io.client.on('disconnect', () => {
    unsubscribe();
  });
});
