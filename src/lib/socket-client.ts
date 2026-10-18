import { io, Socket } from 'socket.io-client';
import type { RealtimeEvent, NftUpdatedEvent, OrderUpdatedEvent } from '@/contracts/socket';
import { queryClient } from './query-client';

class RealtimeSocketClient {
  private socket: Socket | null = null;
  private processedEventIds = new Set<string>();
  private resourceVersions = new Map<string, number>();

  public connect(url?: string): Socket {
    if (this.socket && this.socket.connected) {
      return this.socket;
    }

    let targetUrl = url || import.meta.env.VITE_WS_URL;
    if (typeof window !== 'undefined') {
      const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      // Se estiver em produção (ex: Vercel) ou se VITE_WS_URL apontar para localhost fora de uma máquina local,
      // conecte estritamente na mesma origem da página
      if (!targetUrl || (!isLocalHost && targetUrl.includes('localhost'))) {
        targetUrl = window.location.origin;
      }
    } else {
      targetUrl = targetUrl || 'http://localhost:5173';
    }

    this.socket = io(targetUrl, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    this.socket.on('connect', () => {
      this.reconcileActiveQueries();
    });

    this.socket.on('nft.updated', (event: NftUpdatedEvent) => {
      this.handleNftUpdated(event);
    });

    this.socket.on('order.updated', (event: OrderUpdatedEvent) => {
      this.handleOrderUpdated(event);
    });

    return this.socket;
  }

  public isEventDuplicateOrStale(event: RealtimeEvent<unknown>): boolean {
    if (this.processedEventIds.has(event.eventId)) {
      return true;
    }

    const currentVersion = this.resourceVersions.get(event.resourceId) ?? 0;
    if (event.version <= currentVersion) {
      return true;
    }

    this.processedEventIds.add(event.eventId);
    this.resourceVersions.set(event.resourceId, event.version);
    return false;
  }

  private handleNftUpdated(event: NftUpdatedEvent): void {
    if (this.isEventDuplicateOrStale(event)) {
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['nfts'] });
    queryClient.invalidateQueries({ queryKey: ['nft', event.resourceId] });
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    queryClient.invalidateQueries({ queryKey: ['quote'] });
  }

  private handleOrderUpdated(event: OrderUpdatedEvent): void {
    if (this.isEventDuplicateOrStale(event)) {
      return;
    }

    const currentUserId = localStorage.getItem('__kurio_user_id__');
    if (event.userId && currentUserId && event.userId !== currentUserId) {
      return;
    }

    queryClient.invalidateQueries({ queryKey: ['order', event.resourceId] });
    queryClient.invalidateQueries({ queryKey: ['orders'] });
    queryClient.invalidateQueries({ queryKey: ['cart'] });
  }

  public reconcileActiveQueries(): void {
    queryClient.invalidateQueries({ queryKey: ['nfts'] });
    queryClient.invalidateQueries({ queryKey: ['cart'] });
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  }

  public resetTracking(): void {
    this.processedEventIds.clear();
    this.resourceVersions.clear();
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.resetTracking();
  }

  public getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketClient = new RealtimeSocketClient();
