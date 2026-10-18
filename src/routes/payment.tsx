import { useState, type FormEvent } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useCart } from '@/hooks/useCart';
import {
  ArrowLeftIcon,
  ArrowDownIcon,
  WalletIcon,
  MoreVerticalIcon,
  RadioSelectedIcon,
  RadioUnselectedIcon,
} from '@/components/ui/icons';
import { addEth, subtractEth, multiplyEthByQuantity } from '@/utils/eth-math';
import { apiClient } from '@/lib/axios';

export const Route = createFileRoute('/payment')({
  component: PaymentPage,
});

const DEFAULT_ITEMS = [
  {
    nftId: 'nft_01',
    title: 'Emerald Ape #042',
    tokenId: '#0042',
    priceEth: '1.19',
    quantity: 2,
    imageUrl: '/assets/nfts/emerald-ape.webp',
  },
  {
    nftId: 'nft_02',
    title: 'Violet Nomad #314',
    tokenId: '#0314',
    priceEth: '1.39',
    quantity: 6,
    imageUrl: '/assets/nfts/sage-nomad.webp',
  },
  {
    nftId: 'nft_05',
    title: 'Ivory Baron #088',
    tokenId: '#0088',
    priceEth: '1.79',
    quantity: 9,
    imageUrl: '/assets/nfts/ivory-baron.webp',
  },
];

const GAS_FEE_ETH = '0.016';

function PaymentPage() {
  const navigate = useNavigate();
  const { data: cart } = useCart();

  // Form states
  const [displayName, setDisplayName] = useState('');
  const [network, setNetwork] = useState('Ethereum');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletType, setWalletType] = useState('Coinbase Wallet');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [profileName, setProfileName] = useState('');
  const [secondaryWallet, setSecondaryWallet] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [ensName, setEnsName] = useState('.eth');
  const [useOtherWallet, setUseOtherWallet] = useState(false);
  const [notes, setNotes] = useState('');

  // Selected wallet option for desktop & mobile
  const [selectedWalletOption, setSelectedWalletOption] = useState<'multi' | 'metamask' | 'coinbase'>('coinbase');
  const [selectedConnectedWallet, setSelectedConnectedWallet] = useState<'reserva' | 'principal'>('reserva');

  // Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Compute items: use cart items if available; otherwise use default items from Figma
  const cartItems = cart?.items && cart.items.length > 0 ? cart.items : null;
  const items = cartItems
    ? cartItems.map((item) => ({
        nftId: item.nftId,
        title: item.nft?.title || item.nftId,
        tokenId: item.nft?.edition ? `#${item.nft.edition.replace('/', '')}` : `#00${item.nftId.replace(/\D/g, '') || '42'}`,
        priceEth: item.priceEth,
        quantity: item.quantity,
        imageUrl: item.nft?.imageUrl || '/assets/nfts/emerald-ape.webp',
      }))
    : DEFAULT_ITEMS;

  const subtotalEth = items.reduce((acc, item) => {
    const itemTotal = multiplyEthByQuantity(item.priceEth, item.quantity);
    return addEth(acc, itemTotal);
  }, '0.00');

  const discountEth = '0.00';
  const subtotalAfterDiscount = subtractEth(subtotalEth, discountEth);
  const totalEth = addEth(subtotalAfterDiscount, GAS_FEE_ETH);

  const handleConfirmOrder = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const idempotencyKey = `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    try {
      const payload = {
        items: items.map((i) => ({ nftId: i.nftId, quantity: i.quantity })),
        walletAddress: walletAddress.trim() || '0x71C2B895C984c3B821A858712e96d9978EbC4982',
        network,
      };

      const res = await apiClient.post('/api/orders', payload, {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      });

      const order = res.data;
      navigate({ to: '/orders/$id', params: { id: order.id } });
    } catch (err: unknown) {
      const errObj = err as { response?: { data?: { message?: string } } };
      setErrorMessage(errObj.response?.data?.message || 'Falha ao processar pagamento. Verifique os dados e tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink text-foreground">
      {/* ========================================================= */}
      {/* DESKTOP LAYOUT (1440px / md+)                              */}
      {/* ========================================================= */}
      <div className="hidden md:block max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-[120px] pt-6 pb-24 font-mono">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-7">
          <p className="font-mono font-bold text-[15px] leading-[16px] text-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Início
            </Link>{' '}
            /{' '}
            <Link to="/cart" className="hover:text-primary transition-colors">
              Mercado
            </Link>{' '}
            / <span className="text-foreground">Pagamento</span>
          </p>
        </nav>

        {/* Page Content: Left Form (flex-1) + Right Summary (405px) */}
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 lg:gap-8 w-full">
          {/* Left Column: Perfil do colecionador */}
          <div className="flex-1 w-full max-w-[760px] flex flex-col gap-3">
            <h1 className="font-mono font-bold text-[17px] text-foreground leading-[16px]">
              Perfil do colecionador
            </h1>

            <form onSubmit={handleConfirmOrder} className="flex flex-col gap-6 w-full mt-1">
              {/* Two columns form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                {/* Left Column Fields */}
                <div className="flex flex-col gap-3">
                  {/* Nome de exibição */}
                  <div className="flex flex-col">
                    <label htmlFor="display-name" className="flex items-center text-[15px] text-foreground font-normal leading-[15px] mb-1">
                      <span>Nome de exibição</span>
                      <span className="text-[#F0805F] ml-1 leading-none text-[18px]">*</span>
                    </label>
                    <input
                      id="display-name"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="border border-border h-10 rounded-[3px] bg-transparent px-3 text-[14px] text-foreground focus:border-primary outline-none transition-colors"
                    />
                  </div>

                  {/* Rede */}
                  <div className="flex flex-col">
                    <label htmlFor="network-select" className="flex items-center text-[15px] text-foreground font-normal leading-[15px] mb-1">
                      <span>Rede</span>
                      <span className="text-[#F0805F] ml-1 leading-none text-[18px]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="network-select"
                        value={network}
                        onChange={(e) => setNetwork(e.target.value)}
                        className="border border-border h-10 rounded-[3px] bg-transparent px-3 pr-8 text-[14px] text-foreground focus:border-primary outline-none transition-colors w-full appearance-none cursor-pointer"
                      >
                        <option value="Ethereum" className="bg-[#241612] text-foreground">Ethereum</option>
                        <option value="Polygon" className="bg-[#241612] text-foreground">Polygon</option>
                        <option value="Solana" className="bg-[#241612] text-foreground">Solana</option>
                      </select>
                      <ArrowDownIcon className="size-4 text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Endereço da carteira */}
                  <div className="flex flex-col">
                    <label htmlFor="wallet-address" className="flex items-center text-[15px] text-foreground font-normal leading-[15px] mb-1">
                      <span>Endereço da carteira</span>
                      <span className="text-[#F0805F] ml-1 leading-none text-[18px]">*</span>
                    </label>
                    <input
                      id="wallet-address"
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="Endereço 0x da carteira"
                      className="border border-border h-10 rounded-[3px] bg-transparent px-3 text-[14px] text-foreground placeholder:text-secondary focus:border-primary outline-none transition-colors"
                    />
                  </div>

                  {/* Tipo de carteira */}
                  <div className="flex flex-col">
                    <label htmlFor="wallet-type" className="flex items-center text-[15px] text-foreground font-normal leading-[15px] mb-1">
                      <span>Tipo de carteira</span>
                      <span className="text-[#F0805F] ml-1 leading-none text-[18px]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="wallet-type"
                        value={walletType}
                        onChange={(e) => setWalletType(e.target.value)}
                        className="border border-border h-10 rounded-[3px] bg-transparent px-3 pr-8 text-[14px] text-foreground focus:border-primary outline-none transition-colors w-full appearance-none cursor-pointer"
                      >
                        <option value="Coinbase Wallet" className="bg-[#241612] text-foreground">Coinbase Wallet</option>
                        <option value="MetaMask" className="bg-[#241612] text-foreground">MetaMask</option>
                        <option value="WalletConnect" className="bg-[#241612] text-foreground">WalletConnect</option>
                      </select>
                      <ArrowDownIcon className="size-4 text-secondary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* E-mail */}
                  <div className="flex flex-col">
                    <label htmlFor="email-input" className="flex items-center text-[15px] text-foreground font-normal leading-[15px] mb-1">
                      <span>E-mail</span>
                      <span className="text-[#F0805F] ml-1 leading-none text-[18px]">*</span>
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border border-border h-10 rounded-[3px] bg-transparent px-3 text-[14px] text-foreground focus:border-primary outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Right Column Fields */}
                <div className="flex flex-col gap-3">
                  {/* Nome de usuário */}
                  <div className="flex flex-col">
                    <label htmlFor="username-input" className="flex items-center text-[15px] text-foreground font-normal leading-[15px] mb-1">
                      <span>Nome de usuário</span>
                      <span className="text-[#F0805F] ml-1 leading-none text-[18px]">*</span>
                    </label>
                    <input
                      id="username-input"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="border border-border h-10 rounded-[3px] bg-transparent px-3 text-[14px] text-foreground focus:border-primary outline-none transition-colors"
                    />
                  </div>

                  {/* Nome do perfil */}
                  <div className="flex flex-col">
                    <label htmlFor="profile-name" className="flex items-center text-[15px] text-foreground font-normal leading-[15px] mb-1">
                      <span>Nome do perfil</span>
                      <span className="text-[#F0805F] ml-1 leading-none text-[18px]">*</span>
                    </label>
                    <input
                      id="profile-name"
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="border border-border h-10 rounded-[3px] bg-transparent px-3 text-[14px] text-foreground focus:border-primary outline-none transition-colors"
                    />
                  </div>

                  {/* ENS ou carteira secundária */}
                  <div className="flex flex-col justify-end pt-5">
                    <input
                      id="secondary-wallet"
                      type="text"
                      value={secondaryWallet}
                      onChange={(e) => setSecondaryWallet(e.target.value)}
                      placeholder="ENS ou carteira secundária (opcional)"
                      className="border border-border h-10 rounded-[3px] bg-transparent px-3 text-[14px] text-foreground placeholder:text-secondary focus:border-primary outline-none transition-colors"
                    />
                  </div>

                  {/* Código de indicação */}
                  <div className="flex flex-col">
                    <label htmlFor="referral-code" className="flex items-center text-[15px] text-foreground font-normal leading-[15px] mb-1">
                      <span>Código de indicação</span>
                      <span className="text-[#F0805F] ml-1 leading-none text-[18px]">*</span>
                    </label>
                    <input
                      id="referral-code"
                      type="text"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      className="border border-border h-10 rounded-[3px] bg-transparent px-3 text-[14px] text-foreground focus:border-primary outline-none transition-colors"
                    />
                  </div>

                  {/* Nome ENS */}
                  <div className="flex flex-col w-[92px]">
                    <label htmlFor="ens-select" className="flex items-center text-[15px] text-foreground font-normal leading-[15px] mb-1">
                      <span>Nome ENS</span>
                      <span className="text-[#F0805F] ml-1 leading-none text-[18px]">*</span>
                    </label>
                    <div className="relative">
                      <select
                        id="ens-select"
                        value={ensName}
                        onChange={(e) => setEnsName(e.target.value)}
                        className="border border-border h-10 rounded-[3px] bg-transparent px-2 pr-6 text-[15px] text-foreground focus:border-primary outline-none transition-colors w-full appearance-none cursor-pointer"
                      >
                        <option value=".eth" className="bg-[#241612] text-foreground">.eth</option>
                        <option value=".sol" className="bg-[#241612] text-foreground">.sol</option>
                      </select>
                      <ArrowDownIcon className="size-3 text-secondary absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Usar outra carteira? */}
              <button
                type="button"
                onClick={() => setUseOtherWallet(!useOtherWallet)}
                className="flex items-center gap-2 cursor-pointer text-left self-start"
              >
                <div className="size-[15px] rounded-full border border-border flex items-center justify-center">
                  {useOtherWallet && <div className="size-2 rounded-full bg-primary" />}
                </div>
                <span className="text-[15px] text-foreground font-normal">
                  Usar outra carteira?
                </span>
              </button>

              {/* Observação do colecionador */}
              <div className="flex flex-col gap-2 w-full max-w-[350px]">
                <label htmlFor="collector-notes" className="text-[15px] text-foreground font-normal leading-[15px]">
                  Observação do colecionador (opcional)
                </label>
                <textarea
                  id="collector-notes"
                  rows={6}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="border border-border rounded-[3px] bg-transparent p-3 text-[14px] text-foreground focus:border-primary outline-none transition-colors resize-none h-[152px]"
                />
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-950/40 border border-red-700/50 rounded-[3px] text-red-300 text-[13px]">
                  {errorMessage}
                </div>
              )}
            </form>
          </div>

          {/* Right Column: Seus NFTs + Carteira e rede (width 405px) */}
          <div className="w-full lg:w-[405px] shrink-0 flex flex-col gap-3">
            <h2 className="font-mono font-bold text-[17px] text-foreground leading-[16px]">
              Seus NFTs
            </h2>

            {/* Table Header Row */}
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center justify-between text-foreground text-[16px]">
                <span className="font-bold">NFTs</span>
                <span className="font-medium">Subtotal</span>
              </div>
              <div className="w-full h-px bg-primary/30" />
            </div>

            {/* Cart Items List */}
            <div className="flex flex-col gap-3 w-full">
              {items.map((item) => {
                const itemTotalEth = multiplyEthByQuantity(item.priceEth, item.quantity);

                return (
                  <div
                    key={item.nftId}
                    className="bg-surface-card h-[70px] rounded-[6px] pl-1 pr-4 flex items-center justify-between w-full"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="size-[66px] rounded-[8px] object-cover shrink-0"
                      />
                      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                        <p className="font-mono font-bold text-[16px] text-foreground leading-[16px] whitespace-nowrap">
                          {item.title}
                        </p>
                        <p className="font-mono font-normal text-[14px] text-secondary leading-[16px]">
                          ID do token: {item.tokenId}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right shrink-0">
                      <span className="font-mono text-[14px] text-text-secondary">
                        (x {item.quantity})
                      </span>
                      <span className="font-mono font-bold text-[18px] text-text-accent">
                        {itemTotalEth} ETH
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Financial Summary */}
            <div className="flex flex-col gap-3 w-full mt-2">
              <p className="font-mono text-[14px] text-foreground text-center">
                Tem um código promocional? Aplique aqui
              </p>

              <div className="flex items-center justify-between text-foreground text-[15px]">
                <span>Subtotal</span>
                <span className="text-[18px]">{subtotalEth} ETH</span>
              </div>

              <div className="flex items-center justify-between text-foreground text-[15px]">
                <span>Desconto do lançamento</span>
                <span>(-) 00.00</span>
              </div>

              <div className="flex items-center justify-between text-foreground text-[15px]">
                <span>Taxa de rede</span>
                <span className="text-[18px]">{GAS_FEE_ETH} ETH</span>
              </div>

              <p className="text-[12px] text-text-accent text-center -mt-1">
                Taxa estimada
              </p>

              <div className="w-full h-px bg-primary/30 my-1" />

              <div className="flex items-center justify-between font-bold w-full">
                <span className="text-[16px] text-foreground">Total</span>
                <span className="text-[18px] text-text-accent">{totalEth} ETH</span>
              </div>
            </div>

            {/* Carteira e rede Section */}
            <div className="flex flex-col gap-4 w-full mt-4">
              <h3 className="font-mono font-bold text-[17px] text-foreground text-center">
                Carteira e rede
              </h3>

              <div className="flex flex-col gap-4 w-full">
                {/* Option 1: Multi wallets pill */}
                <button
                  type="button"
                  onClick={() => setSelectedWalletOption('multi')}
                  className={`border border-border h-[45px] rounded-[3px] flex items-center px-3 cursor-pointer transition-colors ${
                    selectedWalletOption === 'multi' ? 'border-primary' : 'hover:border-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {selectedWalletOption === 'multi' ? (
                      <RadioSelectedIcon className="size-4 shrink-0" />
                    ) : (
                      <RadioUnselectedIcon className="size-4 shrink-0" />
                    )}
                    <div className="bg-[#38220F] border border-[#55321F] rounded-[6px] px-2 py-1 flex items-center justify-center">
                      <span className="text-[9px] font-bold text-text-accent tracking-wider whitespace-nowrap">
                        METAMASK • WALLETCONNECT • COINBASE
                      </span>
                    </div>
                  </div>
                </button>

                {/* Option 2: MetaMask */}
                <button
                  type="button"
                  onClick={() => setSelectedWalletOption('metamask')}
                  className={`border border-border h-[45px] rounded-[3px] flex items-center px-3 cursor-pointer transition-colors ${
                    selectedWalletOption === 'metamask' ? 'border-primary' : 'hover:border-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {selectedWalletOption === 'metamask' ? (
                      <RadioSelectedIcon className="size-4 shrink-0" />
                    ) : (
                      <RadioUnselectedIcon className="size-4 shrink-0" />
                    )}
                    <span className="text-[15px] text-foreground font-normal">
                      MetaMask
                    </span>
                  </div>
                </button>

                {/* Option 3: Coinbase Wallet (Selected in Figma) */}
                <button
                  type="button"
                  onClick={() => setSelectedWalletOption('coinbase')}
                  className={`border h-[45px] rounded-[3px] flex items-center px-3 cursor-pointer transition-colors ${
                    selectedWalletOption === 'coinbase' ? 'border-primary' : 'border-border hover:border-secondary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {selectedWalletOption === 'coinbase' ? (
                      <RadioSelectedIcon className="size-4 shrink-0" />
                    ) : (
                      <RadioUnselectedIcon className="size-4 shrink-0" />
                    )}
                    <span className="text-[15px] text-foreground font-normal">
                      Coinbase Wallet
                    </span>
                  </div>
                </button>

                {/* Confirm Button */}
                <button
                  type="button"
                  onClick={() => handleConfirmOrder()}
                  disabled={isSubmitting}
                  className="bg-primary h-[45px] w-full rounded-[8px] flex items-center justify-center font-mono font-bold text-[15px] text-ink hover:bg-[#E89B55] transition-colors cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isSubmitting ? 'Processando compra...' : 'Confirmar compra'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MOBILE LAYOUT (390px / md:hidden)                          */}
      {/* ========================================================= */}
      <div className="md:hidden min-h-screen bg-ink flex flex-col justify-between px-7 py-8 font-mono">
        <div className="flex flex-col gap-4 w-full">
          {/* Mobile Screen Header */}
          <div className="relative h-11 flex items-center mb-1">
            <button
              type="button"
              onClick={() => navigate({ to: '/cart' })}
              className="size-[35px] rounded-full bg-surface-raised border border-border flex items-center justify-center text-secondary hover:text-foreground transition-colors cursor-pointer z-10"
              aria-label="Voltar para o carrinho"
            >
              <ArrowLeftIcon className="size-4" />
            </button>
            <h1 className="font-mono font-bold text-[20px] text-foreground absolute left-1/2 -translate-x-1/2 whitespace-nowrap leading-[16px]">
              Pagamento com carteira
            </h1>
          </div>

          {/* Section: Carteira conectada */}
          <div className="flex items-center justify-between text-[16px] font-bold text-foreground pt-1">
            <span>Carteira conectada</span>
            <button
              type="button"
              onClick={() => setSelectedConnectedWallet(selectedConnectedWallet === 'reserva' ? 'principal' : 'reserva')}
              className="text-[14px] text-text-accent font-normal hover:underline cursor-pointer"
            >
              Trocar carteira
            </button>
          </div>

          {/* Wallet Cards */}
          <div className="flex flex-col gap-5 w-full">
            {/* Card 1: Reserva */}
            <button
              type="button"
              onClick={() => setSelectedConnectedWallet('reserva')}
              className={`h-[93px] w-full bg-surface-card rounded-[14px] p-4 flex items-center justify-between text-left cursor-pointer transition-shadow ${
                selectedConnectedWallet === 'reserva' ? 'shadow-[0px_20px_20px_0px_rgba(10,6,4,0.45)]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {selectedConnectedWallet === 'reserva' ? (
                  <RadioSelectedIcon className="size-4 shrink-0" />
                ) : (
                  <RadioUnselectedIcon className="size-4 shrink-0" />
                )}
                <div className="flex flex-col">
                  <span className="font-mono font-bold text-[16px] text-foreground">
                    Reserva
                  </span>
                  <span className="font-mono text-[14px] text-text-secondary leading-tight mt-1">
                    nova.kurio.eth
                  </span>
                  <span className="font-mono text-[14px] text-text-secondary leading-tight">
                    Rede Polygon
                  </span>
                </div>
              </div>
              <MoreVerticalIcon className="size-4 text-secondary" />
            </button>

            {/* Card 2: Principal */}
            <button
              type="button"
              onClick={() => setSelectedConnectedWallet('principal')}
              className={`h-[93px] w-full bg-surface-card rounded-[14px] p-4 flex items-center justify-between text-left cursor-pointer transition-shadow ${
                selectedConnectedWallet === 'principal' ? 'shadow-[0px_20px_20px_0px_rgba(10,6,4,0.45)]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {selectedConnectedWallet === 'principal' ? (
                  <RadioSelectedIcon className="size-4 shrink-0" />
                ) : (
                  <RadioUnselectedIcon className="size-4 shrink-0" />
                )}
                <div className="flex flex-col">
                  <span className="font-mono font-bold text-[16px] text-foreground">
                    Principal
                  </span>
                  <span className="font-mono text-[14px] text-text-secondary leading-tight mt-1">
                    0xA91F…E82C
                  </span>
                  <span className="font-mono text-[14px] text-text-secondary leading-tight">
                    Rede principal Ethereum
                  </span>
                </div>
              </div>
              <MoreVerticalIcon className="size-4 text-secondary" />
            </button>
          </div>

          {/* Section: Carteira e rede */}
          <div className="flex flex-col gap-4 w-full pt-1">
            <h2 className="font-mono font-bold text-[16px] text-foreground">
              Carteira e rede
            </h2>

            <div className="flex flex-col gap-4 w-full">
              {/* Option 1: WalletConnect */}
              <button
                type="button"
                onClick={() => setSelectedWalletOption('multi')}
                className="h-[65px] w-full bg-surface-card rounded-[15px] shadow-[0px_0px_20px_0px_rgba(10,6,4,0.45)] px-3.5 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-surface-raised border border-border flex items-center justify-center">
                    <span className="font-bold text-[14px] text-text-accent">W</span>
                  </div>
                  <span className="text-[14px] text-foreground font-normal">
                    WalletConnect
                  </span>
                </div>
                {selectedWalletOption === 'multi' ? (
                  <RadioSelectedIcon className="size-4" />
                ) : (
                  <RadioUnselectedIcon className="size-4" />
                )}
              </button>

              {/* Option 2: MetaMask */}
              <button
                type="button"
                onClick={() => setSelectedWalletOption('metamask')}
                className="h-[65px] w-full bg-surface-card rounded-[15px] shadow-[0px_0px_20px_0px_rgba(10,6,4,0.45)] px-3.5 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-surface-raised border border-border flex items-center justify-center">
                    <span className="font-bold text-[14px] text-text-accent">M</span>
                  </div>
                  <span className="text-[14px] text-foreground font-normal">
                    MetaMask
                  </span>
                </div>
                {selectedWalletOption === 'metamask' ? (
                  <RadioSelectedIcon className="size-4" />
                ) : (
                  <RadioUnselectedIcon className="size-4" />
                )}
              </button>

              {/* Option 3: Coinbase Wallet (Selected) */}
              <button
                type="button"
                onClick={() => setSelectedWalletOption('coinbase')}
                className="h-[65px] w-full bg-surface-card rounded-[15px] shadow-[0px_0px_40px_0px_rgba(10,6,4,0.45)] px-3.5 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-surface-raised border border-border flex items-center justify-center text-text-accent">
                    <WalletIcon className="size-5 text-text-accent" />
                  </div>
                  <span className="text-[14px] text-foreground font-normal">
                    Coinbase Wallet
                  </span>
                </div>
                {selectedWalletOption === 'coinbase' ? (
                  <RadioSelectedIcon className="size-4" />
                ) : (
                  <RadioUnselectedIcon className="size-4" />
                )}
              </button>
            </div>
          </div>

          {/* Total Row */}
          <div className="flex items-center justify-end gap-7 pt-2 pb-4">
            <span className="font-bold text-[16px] text-foreground">Total:</span>
            <span className="font-bold text-[18px] text-text-accent">{totalEth} ETH</span>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-950/40 border border-red-700/50 rounded-[3px] text-red-300 text-[13px]">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Mobile Confirm Button */}
        <button
          type="button"
          onClick={() => handleConfirmOrder()}
          disabled={isSubmitting}
          className="h-[60px] w-full rounded-[40px] flex items-center justify-center font-mono font-bold text-[15px] text-ink bg-gradient-to-r from-primary to-primary/80 cursor-pointer disabled:opacity-50 hover:opacity-95 transition-opacity"
        >
          {isSubmitting ? 'Processando compra...' : 'Confirmar compra'}
        </button>
      </div>
    </div>
  );
}
