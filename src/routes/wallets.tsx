import React, { useState, useEffect } from 'react';
import { createFileRoute, Link, useNavigate, redirect } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import { useWallets } from '@/hooks/useWallets';
import {
  UserProfileIcon,
  LocationPinIcon,
  ShoppingBagOutlineIcon,
  ActivityCurveIcon,
  DownloadOutlineIcon,
  DangerTriangleOutlineIcon,
  LogoutOutlineIcon,
  ChevronDownOutlineIcon,
  RadioSelectedIcon,
  RadioUnselectedIcon,
  HeartIcon,
} from '@/components/ui/icons';
import { Button, Input, Label } from '@/components/ui';

export const Route = createFileRoute('/wallets')({
  beforeLoad: ({ location }) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('__kurio_auth_token__') : null;
    if (!token) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
  component: WalletsPage,
});

function WalletsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const {
    wallets,
    createWallet,
    isCreating,
    isError,
    refetch,
  } = useWallets();

  // Form states
  const [displayName, setDisplayName] = useState('');
  const [walletAlias, setWalletAlias] = useState('MetaMask Principal');
  const [network, setNetwork] = useState<'Ethereum' | 'Polygon' | 'Solana'>('Ethereum');
  const [profileName, setProfileName] = useState('');
  const [walletAddress, setWalletAddress] = useState('0x71C...B29F');
  const [secondaryAddress, setSecondaryAddress] = useState('');
  const [walletType, setWalletType] = useState('MetaMask');
  const [referralCode, setReferralCode] = useState('KURIO-2026');
  const [email, setEmail] = useState('');
  const [ensName, setEnsName] = useState('');

  // Secondary wallet toggle
  const [sameAsPrimary, setSameAsPrimary] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.name || 'Emerald Collector');
      setProfileName(user.username || 'collector_01');
      setEmail(user.email || 'contato@email.com');
      setEnsName(user.username ? `${user.username}` : 'collector');
    } else {
      setDisplayName('Emerald Collector');
      setProfileName('collector_01');
      setEmail('contato@email.com');
      setEnsName('collector');
    }

    if (wallets && wallets.length > 0) {
      const primary = wallets.find((w) => w.isPrimary) || wallets[0];
      if (primary) {
        setWalletAlias(primary.name);
        setWalletAddress(primary.address);
        setNetwork(primary.network);
      }
    }
  }, [user, wallets]);

  const handleSaveWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!displayName.trim() || !walletAlias.trim() || !walletAddress.trim()) {
      setStatusMessage({ type: 'error', text: 'Por favor, preencha todos os campos obrigatórios (*).' });
      return;
    }

    try {
      await createWallet({
        name: walletAlias.trim(),
        address: walletAddress.trim(),
        network,
        isPrimary: true,
      });

      setStatusMessage({ type: 'success', text: 'Carteira principal salva com sucesso!' });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Ocorreu um erro ao salvar a carteira. Tente novamente.';
      setStatusMessage({ type: 'error', text: msg });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate({ to: '/' });
    } catch {
      navigate({ to: '/' });
    }
  };

  if (isError) {
    return (
      <div className="min-h-screen bg-[#140D0A] flex flex-col items-center justify-center p-4 text-center font-mono">
        <div className="w-full max-w-md bg-[#241612] border border-red-700/50 rounded-[8px] p-8 shadow-2xl flex flex-col items-center gap-4">
          <p className="text-lg font-bold text-red-300">Erro ao carregar carteiras</p>
          <p className="text-sm text-[#CFB28C]">
            Não foi possível recuperar a lista de carteiras cadastradas.
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              onClick={() => refetch()}
              className="bg-[#D28A4C] hover:bg-[#E89B55] text-[#140D0A] font-bold"
            >
              Tentar novamente
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: '/' })}
              className="border-[#D28A4C] text-[#E89B55]"
            >
              Voltar ao início
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] py-[24px]"
      data-node-id="9:1670"
      data-name="Desktop / Carteiras"
    >
      {/* ======================================================== */}
      {/* BARRA HORIZONTAL MOBILE PARA NAVEGAÇÃO DE SEÇÕES         */}
      {/* ======================================================== */}
      <div className="flex md:hidden overflow-x-auto no-scrollbar gap-2 pb-4 mb-4 border-b border-[#3F2319]">
        <Link
          to="/profile"
          className="px-4 py-2 rounded-[6px] bg-[#241612] border border-[#3F2319] text-[#E89B55] hover:text-[#F5F1EB] font-mono text-xs whitespace-nowrap"
        >
          Dados do perfil
        </Link>
        <span className="px-4 py-2 rounded-[6px] bg-[#D28A4C] text-[#140D0A] font-mono font-bold text-xs whitespace-nowrap">
          Carteiras
        </span>
        <Link
          to="/favorites"
          className="px-4 py-2 rounded-[6px] bg-[#241612] border border-[#3F2319] text-[#E89B55] hover:text-[#F5F1EB] font-mono text-xs whitespace-nowrap"
        >
          Lista de interesse
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="px-4 py-2 rounded-[6px] bg-[#241612] border border-[#3F2319] text-[#E89B55] hover:text-[#F0805F] font-mono text-xs whitespace-nowrap"
        >
          Sair
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-[28px] items-start w-full" data-node-id="70390:266" data-name="Body">
        {/* ======================================================== */}
        {/* 1. SIDEBAR LATERAL DO PERFIL (310px no Desktop)          */}
        {/* ======================================================== */}
        <aside
          className="hidden md:flex flex-col items-start w-[310px] shrink-0 bg-[#241612] border border-[#3F2319] rounded-[4px] py-[8px]"
          data-node-id="70420:4594"
          data-name="Account Sidebar"
        >
          {/* Título Meu perfil */}
          <div className="p-[10px] w-full" data-node-id="70420:4595">
            <h2
              className="font-mono font-bold text-[18px] leading-[16px] text-[#F5F1EB]"
              data-node-id="70420:4596"
            >
              Meu perfil
            </h2>
          </div>

          {/* Item: Dados do perfil */}
          <Link
            to="/profile"
            className="px-[16px] flex items-center gap-[16px] w-full hover:bg-[#2F1D15] transition-colors"
            data-node-id="70420:4597"
          >
            <UserProfileIcon className="size-[18px] text-[#B39463] shrink-0" />
            <span
              className="font-mono font-normal text-[15px] leading-[45px] text-[#E89B55]"
              data-node-id="70420:4600"
            >
              Dados do perfil
            </span>
          </Link>

          {/* Item Ativo: Carteiras */}
          <div
            className="border-l-[6px] border-[#D28A4C] px-[16px] flex items-center gap-[12px] w-full bg-[#2F1D15]/40"
            data-node-id="70420:4601"
          >
            <LocationPinIcon className="size-[20px] text-[#D28A4C] shrink-0" />
            <span
              className="font-mono font-normal text-[15px] leading-[45px] text-[#E89B55]"
              data-node-id="70420:4603"
            >
              Carteiras
            </span>
          </div>

          {/* Item: Atividade */}
          <div
            className="px-[16px] flex items-center gap-[12px] w-full hover:bg-[#2F1D15] transition-colors cursor-pointer"
            data-node-id="70420:4604"
          >
            <ShoppingBagOutlineIcon className="size-[18px] text-[#B39463] shrink-0" />
            <span
              className="font-mono font-normal text-[15px] leading-[45px] text-[#E89B55]"
              data-node-id="70420:4607"
            >
              Atividade
            </span>
          </div>

          {/* Item: Lista de interesse */}
          <Link
            to="/favorites"
            className="px-[16px] flex items-center gap-[12px] w-full hover:bg-[#2F1D15] transition-colors"
            data-node-id="70420:4608"
          >
            <HeartIcon className="size-[16px] text-[#B39463] shrink-0" />
            <span
              className="font-mono font-normal text-[15px] leading-[45px] text-[#E89B55]"
              data-node-id="70420:4611"
            >
              Lista de interesse
            </span>
          </Link>

          {/* Item: Ofertas */}
          <div
            className="px-[16px] flex items-center gap-[12px] w-full hover:bg-[#2F1D15] transition-colors cursor-pointer"
            data-node-id="70420:4612"
          >
            <ActivityCurveIcon className="size-[18px] text-[#B39463] shrink-0" />
            <span
              className="font-mono font-normal text-[15px] leading-[45px] text-[#E89B55]"
              data-node-id="70420:4614"
            >
              Ofertas
            </span>
          </div>

          {/* Item: Arquivos baixados */}
          <div
            className="px-[16px] flex items-center gap-[12px] w-full hover:bg-[#2F1D15] transition-colors cursor-pointer"
            data-node-id="70420:4615"
          >
            <DownloadOutlineIcon className="size-[18px] text-[#B39463] shrink-0" />
            <span
              className="font-mono font-normal text-[15px] leading-[45px] text-[#E89B55]"
              data-node-id="70420:4617"
            >
              Arquivos baixados
            </span>
          </div>

          {/* Item: Suporte */}
          <div
            className="px-[16px] flex items-center gap-[12px] w-full hover:bg-[#2F1D15] transition-colors cursor-pointer"
            data-node-id="70420:4618"
          >
            <DangerTriangleOutlineIcon className="size-[18px] text-[#B39463] shrink-0" />
            <span
              className="font-mono font-normal text-[15px] leading-[45px] text-[#E89B55]"
              data-node-id="70420:4620"
            >
              Suporte
            </span>
          </div>

          {/* Linha Divisória */}
          <div className="h-px w-full bg-[#3F2319] my-1" data-node-id="70420:4621" />

          {/* Item: Sair */}
          <button
            type="button"
            onClick={handleLogout}
            className="px-[16px] flex items-center gap-[8px] h-[40px] w-full hover:bg-[#2F1D15] transition-colors cursor-pointer text-left"
            data-node-id="70420:4622"
          >
            <LogoutOutlineIcon className="size-[20px] text-[#D28A4C] shrink-0" />
            <span
              className="font-mono font-bold text-[15px] leading-[15px] text-[#E89B55]"
              data-node-id="70420:4624"
            >
              Sair
            </span>
          </button>
        </aside>

        {/* ======================================================== */}
        {/* 2. FORMULÁRIO PRINCIPAL: Gerenciamento de Carteiras      */}
        {/* ======================================================== */}
        <main
          className="flex-1 min-w-0 flex flex-col gap-[32px] items-start w-full"
          data-node-id="70390:239"
          data-name="Wallets Form"
        >
          {/* Cabeçalho da Seção */}
          <div className="flex flex-col gap-[8px] items-start w-full" data-node-id="70390:240" data-name="Section Heading">
            <div className="flex items-start justify-between w-full" data-node-id="70390:241" data-name="Title Row">
              <h1
                className="font-mono font-bold text-[17px] leading-[16px] text-[#F5F1EB]"
                data-node-id="9:1703"
              >
                Carteira principal
              </h1>
              <button
                type="button"
                onClick={() => {
                  setWalletAlias('Nova Carteira Principal');
                  setWalletAddress('0x4A8...99E1');
                }}
                className="font-mono font-medium text-[16px] leading-[16px] text-[#E89B55] hover:underline cursor-pointer bg-transparent border-0"
                data-node-id="9:1833"
              >
                Adicionar
              </button>
            </div>
            <p
              className="font-mono font-normal text-[14px] leading-[15px] text-[#CFB28C]"
              data-node-id="9:1834"
            >
              Estas carteiras ficam disponíveis no pagamento e para receber NFTs comprados.
            </p>
          </div>

          <form onSubmit={handleSaveWallet} className="flex flex-col gap-[24px] w-full" data-node-id="70390:242" data-name="Fields">
            {/* Linha 1: Nome de exibição + Apelido da carteira */}
            <div
              className="flex flex-col md:flex-row justify-between items-start gap-[24px] w-full"
              data-node-id="70390:243"
              data-name="Field Row 1"
            >
              {/* Campo: Nome de exibição */}
              <div
                className="flex flex-col gap-[10px] items-start w-full md:w-[417px]"
                data-node-id="70390:244"
                data-name="Main Wallet Name"
              >
                <Label className="flex items-center font-mono text-[15px] leading-[15px] text-[#F5F1EB]">
                  <span>Nome de exibição</span>
                  <span className="text-[22px] leading-[29px] text-[#F0805F] ml-1" data-node-id="9:1858">
                    *
                  </span>
                </Label>
                <div
                  className="h-[40px] w-full md:w-[417px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] px-[16px] bg-transparent flex items-center transition-colors"
                  data-node-id="9:1861"
                >
                  <Input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Nome de exibição"
                    className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none border-0 p-0 h-auto focus-visible:ring-0 shadow-none"
                    aria-label="Nome de exibição"
                  />
                </div>
              </div>

              {/* Campo: Apelido da carteira */}
              <div
                className="flex flex-col gap-[10px] items-start w-full md:w-[417px]"
                data-node-id="70390:245"
                data-name="Wallet Alias"
              >
                <Label className="flex items-center font-mono text-[15px] leading-[15px] text-[#F5F1EB]">
                  <span>Apelido da carteira</span>
                  <span className="text-[22px] leading-[29px] text-[#F0805F] ml-1" data-node-id="9:1859">
                    *
                  </span>
                </Label>
                <div
                  className="h-[40px] w-full md:w-[417px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] px-[16px] bg-transparent flex items-center transition-colors"
                  data-node-id="9:1862"
                >
                  <Input
                    type="text"
                    required
                    value={walletAlias}
                    onChange={(e) => setWalletAlias(e.target.value)}
                    placeholder="Apelido da carteira"
                    className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none border-0 p-0 h-auto focus-visible:ring-0 shadow-none"
                    aria-label="Apelido da carteira"
                  />
                </div>
              </div>
            </div>

            {/* Linha 2: Rede + Nome do perfil */}
            <div
              className="flex flex-col md:flex-row justify-between items-start gap-[24px] w-full"
              data-node-id="70390:246"
              data-name="Field Row 2"
            >
              {/* Campo: Rede */}
              <div
                className="flex flex-col gap-[10px] items-start w-full md:w-[417px]"
                data-node-id="70390:247"
                data-name="Network Select"
              >
                <label className="flex items-center font-mono text-[15px] leading-[15px] text-[#F5F1EB]">
                  <span>Rede</span>
                  <span className="text-[22px] leading-[29px] text-[#F0805F] ml-1" data-node-id="9:1716">
                    *
                  </span>
                </label>
                <div
                  className="relative h-[40px] w-full md:w-[417px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] bg-transparent flex items-center transition-colors px-[13px]"
                  data-node-id="70390:248"
                  data-name="Input"
                >
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value as 'Ethereum' | 'Polygon' | 'Solana')}
                    className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] outline-none appearance-none cursor-pointer pr-6"
                    aria-label="Rede da carteira"
                  >
                    <option value="Ethereum" className="bg-[#241612] text-[#F5F1EB]">
                      Ethereum (Mainnet)
                    </option>
                    <option value="Polygon" className="bg-[#241612] text-[#F5F1EB]">
                      Polygon
                    </option>
                    <option value="Solana" className="bg-[#241612] text-[#F5F1EB]">
                      Solana
                    </option>
                  </select>
                  <ChevronDownOutlineIcon className="size-[16px] text-[#B39463] absolute right-3 pointer-events-none" />
                </div>
              </div>

              {/* Campo: Nome do perfil */}
              <div
                className="flex flex-col gap-[10px] items-start w-full md:w-[417px]"
                data-node-id="70390:249"
                data-name="Wallet Label"
              >
                <label className="flex items-center font-mono text-[15px] leading-[15px] text-[#F5F1EB]">
                  <span>Nome do perfil</span>
                  <span className="text-[22px] leading-[29px] text-[#F0805F] ml-1" data-node-id="9:1719">
                    *
                  </span>
                </label>
                <div
                  className="h-[40px] w-full md:w-[417px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] px-[16px] bg-transparent flex items-center transition-colors"
                  data-node-id="9:1744"
                >
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Nome do perfil"
                    className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
                    aria-label="Nome do perfil"
                  />
                </div>
              </div>
            </div>

            {/* Linha 3: Endereço da carteira + ENS opcional */}
            <div
              className="flex flex-col md:flex-row justify-between items-end gap-[24px] w-full"
              data-node-id="70390:250"
              data-name="Field Row 3"
            >
              {/* Campo: Endereço da carteira */}
              <div
                className="flex flex-col gap-[10px] items-start w-full md:w-[417px]"
                data-node-id="70390:251"
                data-name="Wallet Address"
              >
                <label className="flex items-center font-mono text-[15px] leading-[15px] text-[#F5F1EB]">
                  <span>Endereço da carteira</span>
                  <span className="text-[22px] leading-[29px] text-[#F0805F] ml-1" data-node-id="9:1841">
                    *
                  </span>
                </label>
                <div
                  className="h-[40px] w-full md:w-[417px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] px-[13px] bg-transparent flex items-center transition-colors"
                  data-node-id="70390:252"
                  data-name="Input"
                >
                  <input
                    type="text"
                    required
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    placeholder="Endereço 0x da carteira"
                    className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
                    aria-label="Endereço da carteira"
                  />
                </div>
              </div>

              {/* Campo: Endereço secundário opcional */}
              <div
                className="h-[40px] w-full md:w-[417px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] px-[13px] bg-transparent flex items-center transition-colors"
                data-node-id="70390:253"
                data-name="Secondary Address Input"
              >
                <input
                  type="text"
                  value={secondaryAddress}
                  onChange={(e) => setSecondaryAddress(e.target.value)}
                  placeholder="ENS ou carteira secundária (opcional)"
                  className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
                  aria-label="ENS ou carteira secundária opcional"
                />
              </div>
            </div>

            {/* Linha 4: Tipo de carteira + Código de indicação */}
            <div
              className="flex flex-col md:flex-row justify-between items-start gap-[24px] w-full"
              data-node-id="70390:254"
              data-name="Field Row 4"
            >
              {/* Campo: Tipo de carteira */}
              <div
                className="flex flex-col gap-[10px] items-start w-full md:w-[417px]"
                data-node-id="70390:255"
                data-name="Wallet Select"
              >
                <label className="flex items-center font-mono text-[15px] leading-[15px] text-[#F5F1EB]">
                  <span>Tipo de carteira</span>
                  <span className="text-[22px] leading-[29px] text-[#F0805F] ml-1" data-node-id="9:1849">
                    *
                  </span>
                </label>
                <div
                  className="relative h-[40px] w-full md:w-[417px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] bg-transparent flex items-center transition-colors px-[13px]"
                  data-node-id="70390:256"
                  data-name="Input"
                >
                  <select
                    value={walletType}
                    onChange={(e) => setWalletType(e.target.value)}
                    className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] outline-none appearance-none cursor-pointer pr-6"
                    aria-label="Tipo de carteira"
                  >
                    <option value="MetaMask" className="bg-[#241612] text-[#F5F1EB]">
                      MetaMask
                    </option>
                    <option value="Coinbase Wallet" className="bg-[#241612] text-[#F5F1EB]">
                      Coinbase Wallet
                    </option>
                    <option value="WalletConnect" className="bg-[#241612] text-[#F5F1EB]">
                      WalletConnect
                    </option>
                    <option value="Phantom" className="bg-[#241612] text-[#F5F1EB]">
                      Phantom
                    </option>
                  </select>
                  <ChevronDownOutlineIcon className="size-[16px] text-[#B39463] absolute right-3 pointer-events-none" />
                </div>
              </div>

              {/* Campo: Código de indicação */}
              <div
                className="flex flex-col gap-[10px] items-start w-full md:w-[417px]"
                data-node-id="70390:257"
                data-name="Wallet Tag"
              >
                <label className="flex items-center font-mono text-[15px] leading-[15px] text-[#F5F1EB]">
                  <span>Código de indicação</span>
                  <span className="text-[22px] leading-[29px] text-[#F0805F] ml-1" data-node-id="9:1850">
                    *
                  </span>
                </label>
                <div
                  className="h-[40px] w-full md:w-[417px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] px-[16px] bg-transparent flex items-center transition-colors"
                  data-node-id="9:1853"
                >
                  <input
                    type="text"
                    required
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value)}
                    placeholder="KURIO-2026"
                    className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
                    aria-label="Código de indicação"
                  />
                </div>
              </div>
            </div>

            {/* Linha 5: E-mail + Nome ENS */}
            <div
              className="flex flex-col md:flex-row justify-between items-start gap-[24px] w-full"
              data-node-id="70390:258"
              data-name="Field Row 5"
            >
              {/* Campo: E-mail */}
              <div
                className="flex flex-col gap-[10px] items-start w-full md:w-[417px]"
                data-node-id="70390:259"
                data-name="Extra Field"
              >
                <label className="flex items-center font-mono text-[15px] leading-[15px] text-[#F5F1EB]">
                  <span>E-mail</span>
                  <span className="text-[22px] leading-[29px] text-[#F0805F] ml-1" data-node-id="9:1718">
                    *
                  </span>
                </label>
                <div
                  className="h-[40px] w-full md:w-[417px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] px-[16px] bg-transparent flex items-center transition-colors"
                  data-node-id="9:1743"
                >
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E-mail"
                    className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
                    aria-label="E-mail"
                  />
                </div>
              </div>

              {/* Campo: Nome ENS */}
              <div
                className="flex flex-col gap-[10px] items-start w-full md:w-[417px]"
                data-node-id="70390:260"
                data-name="ENS Field"
              >
                <label className="flex items-center font-mono text-[15px] leading-[15px] text-[#F5F1EB]">
                  <span>Nome ENS</span>
                  <span className="text-[22px] leading-[29px] text-[#F0805F] ml-1" data-node-id="9:1717">
                    *
                  </span>
                </label>
                <div
                  className="h-[40px] w-full md:w-[417px] flex gap-[10px] items-center"
                  data-node-id="70390:261"
                  data-name="Input"
                >
                  {/* Prefixo .eth com Chevron */}
                  <div
                    className="h-[40px] w-[78px] shrink-0 border border-[#3F2319] rounded-[3px] flex items-center justify-between px-[10px] bg-transparent"
                    data-node-id="9:1742"
                  >
                    <span className="font-mono text-[15px] text-[#F5F1EB]" data-node-id="9:1714">
                      .eth
                    </span>
                    <ChevronDownOutlineIcon className="size-[16px] text-[#F5F1EB]" />
                  </div>

                  {/* Input do nome ENS */}
                  <div
                    className="h-[40px] flex-1 border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] px-[16px] bg-transparent flex items-center transition-colors"
                    data-node-id="9:1741"
                  >
                    <input
                      type="text"
                      value={ensName}
                      onChange={(e) => setEnsName(e.target.value)}
                      placeholder="colecionador"
                      className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
                      aria-label="Nome ENS"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Mensagem de Feedback */}
            {statusMessage && (
              <div
                role="alert"
                className={`font-mono text-xs px-4 py-2.5 rounded-[4px] border ${
                  statusMessage.type === 'success'
                    ? 'bg-[#1C2C1D] text-[#59C36A] border-[#59C36A]/50'
                    : 'bg-[#381F1A] text-[#F0805F] border-[#F0805F]/50'
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            {/* Botão Salvar Carteira (131px x 40px) */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isCreating}
                className="h-[40px] w-full sm:w-[131px] rounded-[3px] bg-[#D28A4C] hover:bg-[#E89B55] active:scale-[0.99] disabled:opacity-50 font-mono font-bold text-[14px] leading-[16px] text-[#140D0A] flex items-center justify-center cursor-pointer shadow-sm transition-all text-center"
                data-node-id="70390:262"
                data-name="Save Wallet Button"
              >
                {isCreating ? 'Salvando...' : 'Salvar carteira'}
              </Button>
            </div>
          </form>

          {/* ======================================================== */}
          {/* SEÇÃO INFERIOR: CARTEIRA SECUNDÁRIA                      */}
          {/* ======================================================== */}
          <div
            className="flex flex-col gap-[12px] items-start w-full pt-6 border-t border-[#3F2319]/60"
            data-node-id="70390:263"
            data-name="Secondary Wallet"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between w-full gap-4" data-node-id="70390:264" data-name="Title Row">
              <h2
                className="font-mono font-bold text-[17px] leading-[16px] text-[#F5F1EB]"
                data-node-id="9:1863"
              >
                Carteira secundária
              </h2>

              <div className="flex items-center gap-[24px]" data-node-id="70390:265" data-name="Actions">
                <button
                  type="button"
                  onClick={() => setSameAsPrimary(!sameAsPrimary)}
                  className="flex items-center gap-[8px] cursor-pointer bg-transparent border-0 p-0"
                >
                  {sameAsPrimary ? (
                    <RadioSelectedIcon className="size-[16px]" />
                  ) : (
                    <RadioUnselectedIcon className="size-[16px]" />
                  )}
                  <span
                    className="font-mono font-normal text-[14px] leading-[16px] text-[#F5F1EB]"
                    data-node-id="9:1866"
                  >
                    Igual à carteira principal
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => alert('Para adicionar outra carteira, conecte-se com sua extensão Web3 preferida.')}
                  className="font-mono font-medium text-[16px] leading-[16px] text-[#E89B55] hover:underline cursor-pointer bg-transparent border-0"
                  data-node-id="9:1864"
                >
                  Adicionar
                </button>
              </div>
            </div>

            <p
              className="font-mono font-normal text-[14px] leading-[15px] text-[#CFB28C]"
              data-node-id="9:1865"
            >
              {sameAsPrimary
                ? `Espelhando a carteira principal: ${walletAddress}`
                : 'Você ainda não adicionou uma carteira secundária.'}
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
