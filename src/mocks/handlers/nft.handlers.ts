import { http, HttpResponse, delay } from 'msw';
import { getDb } from '../db';
import { getScenarioConfig } from '../scenarios';
import { compareEth } from '@/utils/eth-math';

export const nftHandlers = [
  http.get('/api/nfts', async ({ request }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    if (scenario.errorMode === '500') {
      return HttpResponse.json({ error: 'InternalServerError', message: 'Falha temporária ao carregar catálogo' }, { status: 500 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase();
    const collections = url.searchParams.getAll('collections');
    const networks = url.searchParams.getAll('networks');
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const tab = url.searchParams.get('tab') || 'all';
    const sortBy = url.searchParams.get('sortBy') || 'recent';
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(50, parseInt(url.searchParams.get('limit') || '9', 10)));

    const db = getDb();
    let filtered = [...db.nfts];

    // Busca por texto
    if (search) {
      filtered = filtered.filter(
        (nft) =>
          nft.title.toLowerCase().includes(search) ||
          nft.description.toLowerCase().includes(search) ||
          nft.creator.name.toLowerCase().includes(search) ||
          nft.collection.toLowerCase().includes(search)
      );
    }

    // Filtro por coleções
    if (collections.length > 0) {
      filtered = filtered.filter((nft) => collections.includes(nft.collection));
    }

    // Filtro por redes
    if (networks.length > 0) {
      filtered = filtered.filter((nft) => networks.includes(nft.network));
    }

    // Faixa de preço
    if (minPrice) {
      filtered = filtered.filter((nft) => compareEth(nft.priceEth, minPrice) >= 0);
    }
    if (maxPrice) {
      filtered = filtered.filter((nft) => compareEth(nft.priceEth, maxPrice) <= 0);
    }

    // Abas de destaque
    if (tab === 'new') {
      filtered = filtered.filter((nft) => nft.isNewRelease);
    } else if (tab === 'trending') {
      filtered = filtered.filter((nft) => nft.isTrending);
    }

    // Ordenação
    filtered.sort((a, b) => {
      if (sortBy === 'price-asc') {
        return compareEth(a.priceEth, b.priceEth);
      }
      if (sortBy === 'price-desc') {
        return compareEth(b.priceEth, a.priceEth);
      }
      if (sortBy === 'likes') {
        return b.likesCount - a.likesCount;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginated = filtered.slice(startIndex, startIndex + limit);

    return HttpResponse.json({
      data: paginated,
      total,
      page,
      limit,
      totalPages,
    });
  }),

  http.get('/api/nfts/:id', async ({ params }) => {
    const scenario = getScenarioConfig();
    await delay(scenario.latencyMs);

    const { id } = params;
    const db = getDb();
    const nft = db.nfts.find((item) => item.id === id);

    if (!nft) {
      return HttpResponse.json(
        { error: 'NotFound', message: 'NFT não encontrado na coleção' },
        { status: 404 }
      );
    }

    return HttpResponse.json(nft);
  }),
];
