import React, { useState, useEffect } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import {
  UserProfileIcon,
  LocationPinIcon,
  ShoppingBagOutlineIcon,
  ActivityCurveIcon,
  DownloadOutlineIcon,
  DangerTriangleOutlineIcon,
  LogoutOutlineIcon,
  ImagePlaceholderIcon,
  ChevronDownOutlineIcon,
  EyeHideIcon,
  EyeShowIcon,
  HeartIcon,
} from '@/components/ui/icons';

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { profile, updateProfile, isUpdating, changePassword, isChangingPassword } = useProfile();

  // Form states
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [ensName, setEnsName] = useState('');
  const [walletNickname, setWalletNickname] = useState('MetaMask Principal');
  const [avatarUrl, setAvatarUrl] = useState('/assets/nfts/emerald-ape.webp');

  // Password fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Password visibility
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status messages
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Initialize form with user/profile data or demo defaults
  useEffect(() => {
    const activeData = profile || user;
    if (activeData) {
      setDisplayName(activeData.name || 'Emerald Collector');
      setUsername(activeData.username || 'collector_01');
      setEmail(activeData.email || 'contato@email.com');
      setEnsName(activeData.username ? `${activeData.username}` : 'collector');
      if (activeData.avatarUrl) {
        setAvatarUrl(activeData.avatarUrl);
      }
    } else {
      setDisplayName('Emerald Collector');
      setUsername('collector_01');
      setEmail('contato@email.com');
      setEnsName('collector');
    }
  }, [profile, user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!displayName.trim() || !username.trim() || !email.trim()) {
      setStatusMessage({ type: 'error', text: 'Por favor, preencha todos os campos obrigatórios (*).' });
      return;
    }

    try {
      // 1. Atualizar dados do perfil
      await updateProfile({
        name: displayName.trim(),
        username: username.trim(),
        avatarUrl,
      });

      // 2. Se houver tentativa de troca de senha
      if (currentPassword || newPassword || confirmNewPassword) {
        if (!currentPassword || !newPassword || !confirmNewPassword) {
          setStatusMessage({ type: 'error', text: 'Para alterar a senha, preencha todos os 3 campos de senha.' });
          return;
        }

        if (newPassword.length < 6) {
          setStatusMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres.' });
          return;
        }

        if (newPassword !== confirmNewPassword) {
          setStatusMessage({ type: 'error', text: 'A confirmação de senha não coincide com a nova senha.' });
          return;
        }

        await changePassword({
          currentPassword,
          newPassword,
        });

        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      }

      setStatusMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Ocorreu um erro ao salvar as alterações do perfil. Tente novamente.';
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

  const handleToggleAvatar = () => {
    const avatars = [
      '/assets/nfts/emerald-ape.webp',
      '/assets/nfts/golden-beat.webp',
      '/assets/nfts/ivory-baron.webp',
      '/assets/nfts/sage-nomad.webp',
    ];
    const currentIndex = avatars.indexOf(avatarUrl);
    const nextIndex = (currentIndex + 1) % avatars.length;
    const nextAvatar = avatars[nextIndex];
    if (nextAvatar) {
      setAvatarUrl(nextAvatar);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
  };

  return (
    <div
      className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px] py-[24px]"
      data-node-id="9:1238"
      data-name="Desktop / Perfil do Colecionador"
    >
      {/* ======================================================== */}
      {/* BARRA HORIZONTAL MOBILE PARA NAVEGAÇÃO DE SEÇÕES         */}
      {/* ======================================================== */}
      <div className="flex md:hidden overflow-x-auto no-scrollbar gap-2 pb-4 mb-4 border-b border-[#3F2319]">
        <span className="px-4 py-2 rounded-[6px] bg-[#D28A4C] text-[#140D0A] font-mono font-bold text-xs whitespace-nowrap">
          Dados do perfil
        </span>
        <Link
          to="/wallets"
          className="px-4 py-2 rounded-[6px] bg-[#241612] border border-[#3F2319] text-[#E89B55] hover:text-[#F5F1EB] font-mono text-xs whitespace-nowrap"
        >
          Carteiras
        </Link>
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

      <div className="flex flex-col md:flex-row gap-[28px] items-start w-full" data-node-id="70386:263" data-name="Body">
        {/* ======================================================== */}
        {/* 1. SIDEBAR LATERAL DO PERFIL (310px no Desktop)          */}
        {/* ======================================================== */}
        <aside
          className="hidden md:flex flex-col items-start w-[310px] shrink-0 bg-[#241612] border border-[#3F2319] rounded-[4px] py-[8px]"
          data-node-id="70420:4536"
          data-name="Account Sidebar"
        >
          {/* Título Meu perfil */}
          <div className="p-[10px] w-full" data-node-id="70420:4537">
            <h2
              className="font-mono font-bold text-[18px] leading-[16px] text-[#F5F1EB]"
              data-node-id="70420:4538"
            >
              Meu perfil
            </h2>
          </div>

          {/* Item Ativo: Dados do perfil */}
          <div
            className="border-l-[6px] border-[#D28A4C] px-[16px] flex items-center gap-[16px] w-full bg-[#2F1D15]/40"
            data-node-id="70420:4539"
          >
            <UserProfileIcon className="size-[18px] text-[#D28A4C] shrink-0" />
            <span
              className="font-mono font-normal text-[15px] leading-[45px] text-[#E89B55]"
              data-node-id="70420:4542"
            >
              Dados do perfil
            </span>
          </div>

          {/* Item: Carteiras */}
          <Link
            to="/wallets"
            className="px-[16px] flex items-center gap-[12px] w-full hover:bg-[#2F1D15] transition-colors"
            data-node-id="70420:4543"
          >
            <LocationPinIcon className="size-[20px] text-[#B39463] shrink-0" />
            <span
              className="font-mono font-normal text-[15px] leading-[45px] text-[#E89B55]"
              data-node-id="70420:4545"
            >
              Carteiras
            </span>
          </Link>

          {/* Item: Atividade */}
          <div
            className="px-[16px] flex items-center gap-[12px] w-full hover:bg-[#2F1D15] transition-colors cursor-pointer"
            data-node-id="70420:4546"
          >
            <ShoppingBagOutlineIcon className="size-[18px] text-[#B39463] shrink-0" />
            <span
              className="font-mono font-normal text-[15px] leading-[45px] text-[#E89B55]"
              data-node-id="70420:4549"
            >
              Atividade
            </span>
          </div>

          {/* Item: Lista de interesse */}
          <Link
            to="/favorites"
            className="px-[16px] flex items-center gap-[12px] w-full hover:bg-[#2F1D15] transition-colors"
            data-node-id="70420:4550"
          >
            <HeartIcon className="size-[16px] text-[#B39463] shrink-0" />
            <span
              className="font-mono font-normal text-[15px] leading-[45px] text-[#E89B55]"
              data-node-id="70420:4553"
            >
              Lista de interesse
            </span>
          </Link>

          {/* Item: Ofertas */}
          <div
            className="px-[16px] flex items-center gap-[12px] w-full hover:bg-[#2F1D15] transition-colors cursor-pointer"
            data-node-id="70420:4554"
          >
            <ActivityCurveIcon className="size-[18px] text-[#B39463] shrink-0" />
            <span
              className="font-mono font-normal text-[15px] leading-[45px] text-[#E89B55]"
              data-node-id="70420:4556"
            >
              Ofertas
            </span>
          </div>

          {/* Item: Arquivos baixados */}
          <div
            className="px-[16px] flex items-center gap-[12px] w-full hover:bg-[#2F1D15] transition-colors cursor-pointer"
            data-node-id="70420:4557"
          >
            <DownloadOutlineIcon className="size-[18px] text-[#B39463] shrink-0" />
            <span
              className="font-mono font-normal text-[15px] leading-[45px] text-[#E89B55]"
              data-node-id="70420:4559"
            >
              Arquivos baixados
            </span>
          </div>

          {/* Item: Suporte */}
          <div
            className="px-[16px] flex items-center gap-[12px] w-full hover:bg-[#2F1D15] transition-colors cursor-pointer"
            data-node-id="70420:4560"
          >
            <DangerTriangleOutlineIcon className="size-[18px] text-[#B39463] shrink-0" />
            <span
              className="font-mono font-normal text-[15px] leading-[45px] text-[#E89B55]"
              data-node-id="70420:4562"
            >
              Suporte
            </span>
          </div>

          {/* Linha Divisória */}
          <div className="h-px w-full bg-[#3F2319] my-1" data-node-id="70420:4563" />

          {/* Item: Sair */}
          <button
            type="button"
            onClick={handleLogout}
            className="px-[16px] flex items-center gap-[8px] h-[40px] w-full hover:bg-[#2F1D15] transition-colors cursor-pointer text-left"
            data-node-id="70420:4564"
          >
            <LogoutOutlineIcon className="size-[20px] text-[#D28A4C] shrink-0" />
            <span
              className="font-mono font-bold text-[15px] leading-[15px] text-[#E89B55]"
              data-node-id="70420:4566"
            >
              Sair
            </span>
          </button>
        </aside>

        {/* ======================================================== */}
        {/* 2. FORMULÁRIO PRINCIPAL: Perfil do colecionador          */}
        {/* ======================================================== */}
        <main
          className="flex-1 min-w-0 flex flex-col gap-[32px] items-start w-full"
          data-node-id="70386:239"
          data-name="Profile Form"
        >
          <h1
            className="font-mono font-bold text-[16px] leading-[16px] text-[#F5F1EB]"
            data-node-id="9:1569"
          >
            Perfil do colecionador
          </h1>

          <form onSubmit={handleSave} className="flex flex-col gap-[24px] w-full">
            {/* Linha 1: Nome de exibição + Nome de usuário */}
            <div
              className="flex flex-col md:flex-row justify-between items-start gap-[24px] w-full"
              data-node-id="70386:241"
              data-name="Field Row 1"
            >
              {/* Campo: Nome de exibição */}
              <div
                className="flex flex-col gap-[10px] items-start w-full md:w-[417px]"
                data-node-id="70386:242"
                data-name="Display Name Field"
              >
                <label className="flex items-center font-mono text-[15px] leading-[15px] text-[#F5F1EB]">
                  <span>Nome de exibição</span>
                  <span className="text-[22px] leading-[29px] text-[#F0805F] ml-1" data-node-id="9:1516">
                    *
                  </span>
                </label>
                <div
                  className="h-[40px] w-full md:w-[417px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] px-[16px] bg-transparent flex items-center transition-colors"
                  data-node-id="9:1509"
                >
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Nome de exibição"
                    className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
                    aria-label="Nome de exibição"
                  />
                </div>
              </div>

              {/* Campo: Nome de usuário */}
              <div
                className="flex flex-col gap-[10px] items-start w-full md:w-[417px]"
                data-node-id="70386:243"
                data-name="Username Field"
              >
                <label className="flex items-center font-mono text-[15px] leading-[15px] text-[#F5F1EB]">
                  <span>Nome de usuário</span>
                  <span className="text-[22px] leading-[29px] text-[#F0805F] ml-1" data-node-id="9:1517">
                    *
                  </span>
                </label>
                <div
                  className="h-[40px] w-full md:w-[417px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] px-[16px] bg-transparent flex items-center transition-colors"
                  data-node-id="9:1511"
                >
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nome de usuário"
                    className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
                    aria-label="Nome de usuário"
                  />
                </div>
              </div>
            </div>

            {/* Linha 2: E-mail + Nome ENS */}
            <div
              className="flex flex-col md:flex-row justify-between items-start gap-[24px] w-full"
              data-node-id="70386:245"
              data-name="Field Row 2"
            >
              {/* Campo: E-mail */}
              <div
                className="flex flex-col gap-[10px] items-start w-full md:w-[417px]"
                data-node-id="70386:246"
                data-name="Bio Field"
              >
                <label className="flex items-center font-mono text-[15px] leading-[15px] text-[#F5F1EB]">
                  <span>E-mail</span>
                  <span className="text-[22px] leading-[29px] text-[#F0805F] ml-1" data-node-id="9:1579">
                    *
                  </span>
                </label>
                <div
                  className="h-[40px] w-full md:w-[417px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] px-[16px] bg-transparent flex items-center transition-colors"
                  data-node-id="9:1580"
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
                data-node-id="70386:247"
                data-name="ENS Field"
              >
                <label className="flex items-center font-mono text-[15px] leading-[15px] text-[#F5F1EB]">
                  <span>Nome ENS</span>
                  <span className="text-[22px] leading-[29px] text-[#F0805F] ml-1" data-node-id="9:1519">
                    *
                  </span>
                </label>
                <div
                  className="h-[40px] w-full md:w-[417px] flex gap-[10px] items-center"
                  data-node-id="70386:249"
                  data-name="ENS Input"
                >
                  {/* Prefixo .eth com Chevron */}
                  <div
                    className="h-[40px] w-[78px] shrink-0 border border-[#3F2319] rounded-[3px] flex items-center justify-between px-[10px] bg-transparent"
                    data-node-id="9:1587"
                  >
                    <span className="font-mono text-[15px] text-[#F5F1EB]" data-node-id="9:1588">
                      .eth
                    </span>
                    <ChevronDownOutlineIcon className="size-[16px] text-[#F5F1EB]" />
                  </div>

                  {/* Input do nome ENS */}
                  <div
                    className="h-[40px] flex-1 border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] px-[16px] bg-transparent flex items-center transition-colors"
                    data-node-id="9:1522"
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

            {/* Linha 3: Apelido da carteira + Avatar */}
            <div
              className="flex flex-col md:flex-row justify-between items-start gap-[24px] w-full"
              data-node-id="70386:250"
              data-name="Field Row 3"
            >
              {/* Campo: Apelido da carteira */}
              <div
                className="flex flex-col gap-[10px] items-start w-full md:w-[417px]"
                data-node-id="70386:251"
                data-name="Website Field"
              >
                <label className="flex items-center font-mono text-[15px] leading-[15px] text-[#F5F1EB]">
                  <span>Apelido da carteira</span>
                  <span className="text-[22px] leading-[29px] text-[#F0805F] ml-1" data-node-id="9:1520">
                    *
                  </span>
                </label>
                <div
                  className="h-[40px] w-full md:w-[417px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] px-[16px] bg-transparent flex items-center transition-colors"
                  data-node-id="9:1523"
                >
                  <input
                    type="text"
                    required
                    value={walletNickname}
                    onChange={(e) => setWalletNickname(e.target.value)}
                    placeholder="MetaMask Principal"
                    className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
                    aria-label="Apelido da carteira"
                  />
                </div>
              </div>

              {/* Campo: Avatar */}
              <div
                className="flex flex-col gap-[10px] items-start w-full md:w-[417px]"
                data-node-id="70386:252"
                data-name="Avatar Field"
              >
                <label
                  className="font-mono text-[15px] leading-[15px] text-[#F5F1EB]"
                  data-node-id="9:1536"
                >
                  Avatar
                </label>
                <div
                  className="flex items-center gap-[24px]"
                  data-node-id="70386:254"
                  data-name="Avatar Controls"
                >
                  {/* Foto redonda 50px */}
                  <div
                    className="size-[50px] rounded-full bg-[#2F1D15] border border-[#3F2319] flex items-center justify-center overflow-hidden shrink-0"
                    data-node-id="9:1581"
                  >
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Avatar do colecionador"
                        className="size-full object-cover"
                      />
                    ) : (
                      <ImagePlaceholderIcon className="size-[24px] text-[#D28A4C]" />
                    )}
                  </div>

                  {/* Botões Alterar e Remover */}
                  <div className="flex items-center gap-[20px]" data-node-id="9:1582">
                    <button
                      type="button"
                      onClick={handleToggleAvatar}
                      className="h-[40px] w-[98px] rounded-[3px] bg-[#D28A4C] hover:bg-[#E89B55] active:scale-[0.99] font-mono font-bold text-[14px] text-[#140D0A] flex items-center justify-center cursor-pointer transition-colors shadow-sm"
                      data-node-id="9:1540"
                    >
                      Alterar
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="font-mono font-normal text-[14px] text-[#F5F1EB] hover:text-[#E89B55] cursor-pointer transition-colors bg-transparent border-0"
                      data-node-id="9:1548"
                    >
                      Remover
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ======================================================== */}
            {/* SUB-SEÇÃO: ALTERAR SENHA                                 */}
            {/* ======================================================== */}
            <div
              className="flex flex-col gap-[24px] items-start w-full pt-4 border-t border-[#3F2319]/60"
              data-node-id="70386:255"
              data-name="Change Password"
            >
              <h2
                className="font-mono font-medium text-[16px] leading-[16px] text-[#F5F1EB]"
                data-node-id="9:1586"
              >
                Alterar senha
              </h2>

              {/* Senha atual */}
              <div
                className="flex flex-col gap-[12px] items-start w-full md:w-[417px]"
                data-node-id="70386:256"
                data-name="Current Password Field"
              >
                <label
                  className="font-mono text-[15px] leading-[15px] text-[#F5F1EB]"
                  data-node-id="9:1529"
                >
                  Senha atual
                </label>
                <div className="relative h-[40px] w-full md:w-[417px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] pl-[16px] pr-[40px] bg-transparent flex items-center transition-colors">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
                    aria-label="Senha atual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B39463] hover:text-[#E89B55] transition-colors p-1 cursor-pointer"
                    aria-label={showCurrentPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showCurrentPassword ? <EyeShowIcon /> : <EyeHideIcon />}
                  </button>
                </div>
              </div>

              {/* Nova senha */}
              <div
                className="flex flex-col gap-[12px] items-start w-full md:w-[417px]"
                data-node-id="70386:258"
                data-name="New Password Field"
              >
                <label
                  className="font-mono text-[15px] leading-[15px] text-[#F5F1EB]"
                  data-node-id="9:1532"
                >
                  Nova senha
                </label>
                <div className="relative h-[40px] w-full md:w-[417px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] pl-[16px] pr-[40px] bg-transparent flex items-center transition-colors">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
                    aria-label="Nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B39463] hover:text-[#E89B55] transition-colors p-1 cursor-pointer"
                    aria-label={showNewPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showNewPassword ? <EyeShowIcon /> : <EyeHideIcon />}
                  </button>
                </div>
              </div>

              {/* Confirmar nova senha */}
              <div
                className="flex flex-col gap-[12px] items-start w-full md:w-[417px]"
                data-node-id="70386:260"
                data-name="Confirm Password Field"
              >
                <label
                  className="font-mono text-[15px] leading-[15px] text-[#F5F1EB]"
                  data-node-id="9:1534"
                >
                  Confirmar nova senha
                </label>
                <div className="relative h-[40px] w-full md:w-[417px] border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[3px] pl-[16px] pr-[40px] bg-transparent flex items-center transition-colors">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
                    aria-label="Confirmar nova senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B39463] hover:text-[#E89B55] transition-colors p-1 cursor-pointer"
                    aria-label={showConfirmPassword ? 'Ocultar confirmação de senha' : 'Exibir confirmação de senha'}
                  >
                    {showConfirmPassword ? <EyeShowIcon /> : <EyeHideIcon />}
                  </button>
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

            {/* Botão Salvar (131px x 40px) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isUpdating || isChangingPassword}
                className="h-[40px] w-full sm:w-[131px] rounded-[3px] bg-[#D28A4C] hover:bg-[#E89B55] active:scale-[0.99] disabled:opacity-50 font-mono font-bold text-[14px] leading-[16px] text-[#140D0A] flex items-center justify-center cursor-pointer shadow-sm transition-all"
                data-node-id="70386:262"
                data-name="Save Button"
              >
                {isUpdating || isChangingPassword ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
