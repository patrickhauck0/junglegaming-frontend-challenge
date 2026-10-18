import { authHandlers } from './auth.handlers';
import { nftHandlers } from './nft.handlers';
import { favoritesHandlers } from './favorites.handlers';
import { cartHandlers } from './cart.handlers';
import { quoteHandlers } from './quote.handlers';
import { orderHandlers } from './order.handlers';
import { profileHandlers } from './profile.handlers';
import { walletHandlers } from './wallet.handlers';
import { testHandlers } from './test.handlers';
import { wsHandler } from '../ws';

export const handlers = [
  ...authHandlers,
  ...nftHandlers,
  ...favoritesHandlers,
  ...cartHandlers,
  ...quoteHandlers,
  ...orderHandlers,
  ...profileHandlers,
  ...walletHandlers,
  ...testHandlers,
  wsHandler,
];
