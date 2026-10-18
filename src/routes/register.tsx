import React, { useState } from 'react';
import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import {
  CloseModalIcon,
  GoogleIcon,
  FacebookIcon,
  EyeHideIcon,
  EyeShowIcon,
} from '@/components/ui/icons';
import { Button, Input } from '@/components/ui';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
});

function RegisterPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/register' });
  const { register, isRegistering } = useAuth();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanUsername = username.trim();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    const cleanConfirm = confirmPassword.trim();

    if (!cleanUsername || !cleanEmail || !cleanPassword || !cleanConfirm) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    if (cleanUsername.length < 3) {
      setErrorMessage('O nome de usuário deve ter pelo menos 3 caracteres.');
      return;
    }

    if (cleanPassword.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (cleanPassword !== cleanConfirm) {
      setErrorMessage('As senhas digitadas não coincidem.');
      return;
    }

    try {
      await register({
        name: cleanUsername,
        username: cleanUsername,
        email: cleanEmail,
        password: cleanPassword,
      });
      const target = search.redirect || '/';
      navigate({ to: target });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'Não foi possível criar a conta. Verifique os dados ou tente outro e-mail/usuário.';
      setErrorMessage(msg);
    }
  };

  const handlePreFillSocial = (provider: 'google' | 'facebook') => {
    if (provider === 'google') {
      setUsername('google_collector');
      setEmail('google.collector@kurio.eth');
      setPassword('kurio123');
      setConfirmPassword('kurio123');
    } else {
      setUsername('fb_collector');
      setEmail('facebook.collector@kurio.eth');
      setPassword('kurio123');
      setConfirmPassword('kurio123');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] md:min-h-screen bg-[#140D0A] flex flex-col items-center justify-center">
      {/* ======================================================== */}
      {/* 1. VERSÃO DESKTOP (1440px): Modal com Backdrop Home     */}
      {/* ======================================================== */}
      <div
        className="hidden md:flex relative size-full min-h-[calc(100vh-80px)] items-center justify-center px-4 py-8 overflow-x-hidden"
        data-node-id="9:1022"
        data-name="Desktop / Cadastro"
      >
        {/* Backdrop simulado do catálogo de fundo */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none select-none blur-[1px] px-[120px] py-[24px] flex flex-col gap-[96px] z-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="w-full flex justify-between text-xs text-[#CFB28C]">
            <span>Início / Mercado</span>
            <span>Cadastro</span>
          </div>
          <div className="grid grid-cols-4 gap-6 w-full">
            <div className="h-64 border border-[#3F2319] rounded bg-[#1C110E]" />
            <div className="h-64 border border-[#3F2319] rounded bg-[#1C110E]" />
            <div className="h-64 border border-[#3F2319] rounded bg-[#1C110E]" />
            <div className="h-64 border border-[#3F2319] rounded bg-[#1C110E]" />
          </div>
        </div>

        {/* Overlay escuro em foco */}
        <div className="absolute inset-0 bg-[#140D0A]/75 z-10 pointer-events-none" />

        {/* Modal de Cadastro (500x656px no Figma) */}
        <div
          className="relative z-20 w-full max-w-[500px] bg-[#241612] border border-[#3F2319] rounded-[8px] overflow-hidden shadow-2xl"
          data-node-id="70383:239"
          data-name="Sign Up Modal"
        >
          {/* Botão de Fechar X no topo direito */}
          <button
            type="button"
            onClick={() => navigate({ to: '/' })}
            aria-label="Fechar e voltar ao início"
            className="absolute right-3 top-3 p-2 text-[#D28A4C] hover:opacity-80 transition-opacity cursor-pointer z-30"
            data-node-id="9:947"
          >
            <CloseModalIcon className="size-[18px]" />
          </button>

          {/* Cabeçalho do Modal: Abas Entrar | Criar conta + Subtítulo */}
          <div
            className="flex flex-col items-center pt-[48px] px-[48px]"
            data-node-id="70383:240"
            data-name="Modal Header"
          >
            <div
              className="flex gap-[8px] items-center justify-center"
              data-node-id="9:1148"
            >
              <Link
                to="/login"
                search={{ redirect: search.redirect }}
                className="font-mono text-[20px] font-medium leading-[16px] text-[#F5F1EB] hover:text-[#E89B55] transition-colors"
                data-node-id="9:1149"
              >
                Entrar
              </Link>
              <div
                className="w-px h-[20px] bg-[#F0805F]"
                data-node-id="70410:4119"
              />
              <span
                className="font-mono text-[20px] font-medium leading-[16px] text-[#E89B55]"
                data-node-id="9:1150"
              >
                Criar conta
              </span>
            </div>

            <p
              className="font-mono text-[13px] font-normal leading-[16px] text-[#F5F1EB] text-center mt-[40px]"
              data-node-id="9:1152"
            >
              Crie seu perfil de colecionador e conecte uma carteira quando quiser.
            </p>
          </div>

          {/* Formulário de Cadastro Desktop */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-[12px] pt-[24px] px-[80px]"
            data-node-id="70383:241"
            data-name="Form"
          >
            {/* Input Nome de Usuário */}
            <div
              className="h-[40px] w-full border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[5px] px-[16px] py-[12px] bg-transparent flex items-center transition-colors"
              data-node-id="70383:242"
              data-name="Username Input"
            >
              <Input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Nome de usuário"
                className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none border-0 p-0 h-auto focus-visible:border-0 rounded-none"
                aria-label="Nome de usuário"
              />
            </div>

            {/* Input E-mail */}
            <div
              className="h-[40px] w-full border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[5px] px-[16px] py-[12px] bg-transparent flex items-center transition-colors"
              data-node-id="70383:243"
              data-name="Email Input"
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
                className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none border-0 p-0 h-auto focus-visible:border-0 rounded-none"
                aria-label="Digite seu e-mail"
              />
            </div>

            {/* Input Senha com alternador de visibilidade */}
            <div
              className="relative h-[40px] w-full border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[5px] pl-[16px] pr-[40px] py-[12px] bg-transparent flex items-center transition-colors"
              data-node-id="70383:244"
              data-name="Password Input"
            >
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha"
                className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
                aria-label="Senha"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B39463] hover:text-[#E89B55] transition-colors p-1 cursor-pointer"
                aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeShowIcon /> : <EyeHideIcon />}
              </button>
            </div>

            {/* Input Confirmar Senha com alternador de visibilidade */}
            <div
              className="relative h-[40px] w-full border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[5px] pl-[16px] pr-[40px] py-[12px] bg-transparent flex items-center transition-colors"
              data-node-id="70383:245"
              data-name="Confirm Password Input"
            >
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar senha"
                className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
                aria-label="Confirmar senha"
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

            {/* Mensagem de Erro de Validação ou Cadastro */}
            {errorMessage && (
              <div
                role="alert"
                className="font-mono text-xs text-[#F0805F] bg-[#381F1A] border border-[#F0805F]/50 px-3 py-2 rounded"
              >
                {errorMessage}
              </div>
            )}

            {/* Botão Criar Conta (CTA) */}
            <div
              className="pt-[12px]"
              data-node-id="70383:246"
              data-name="CTA"
            >
              <Button
                type="submit"
                disabled={isRegistering}
                className="h-[45px] w-full bg-[#D28A4C] hover:bg-[#E89B55] active:scale-[0.99] disabled:opacity-50 text-[#140D0A] font-mono font-bold text-[16px] leading-[16px] rounded-[5px] transition-all flex items-center justify-center cursor-pointer shadow-md"
                data-node-id="70383:247"
                data-name="Sign Up Button"
              >
                {isRegistering ? 'Criando conta...' : 'Criar conta'}
              </Button>
            </div>
          </form>

          {/* Bloco Social Desktop */}
          <div
            className="flex flex-col gap-[16px] pt-[24px]"
            data-node-id="70383:248"
            data-name="Social"
          >
            {/* Divisor "Ou continue com" */}
            <div
              className="flex items-center gap-[12px] px-[80px]"
              data-node-id="70383:249"
              data-name="Divider"
            >
              <div className="flex-1 h-px bg-[#3F2319]" data-node-id="9:1169" />
              <p
                className="font-mono text-[13px] leading-[16px] text-[#F5F1EB] whitespace-nowrap"
                data-node-id="9:1153"
              >
                Ou continue com
              </p>
              <div className="flex-1 h-px bg-[#3F2319]" data-node-id="9:1170" />
            </div>

            {/* Botões Sociais */}
            <div
              className="flex flex-col gap-[16px] px-[80px] pb-[32px]"
              data-node-id="70402:3596"
            >
              <button
                type="button"
                onClick={() => handlePreFillSocial('google')}
                className="h-[40px] w-full border border-[#3F2319] hover:border-[#D28A4C] rounded-[5px] flex items-center justify-center gap-[12px] bg-transparent text-[#CFB28C] font-mono font-medium text-[13px] leading-[16px] transition-colors cursor-pointer"
                data-node-id="70483:256"
              >
                <GoogleIcon className="size-[20px]" />
                <span>Continuar com Google</span>
              </button>

              <button
                type="button"
                onClick={() => handlePreFillSocial('facebook')}
                className="h-[40px] w-full border border-[#3F2319] hover:border-[#D28A4C] rounded-[5px] flex items-center justify-center gap-[12px] bg-transparent text-[#CFB28C] font-mono font-medium text-[13px] leading-[16px] transition-colors cursor-pointer"
                data-node-id="70483:262"
              >
                <FacebookIcon className="size-[20px]" />
                <span>Continuar com Facebook</span>
              </button>
            </div>
          </div>

          {/* Barra Decorativa Inferior Âmbar (10px) */}
          <div
            className="h-[10px] w-full bg-[#D28A4C]"
            data-node-id="9:1230"
          />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. VERSÃO MOBILE (390px): Tela Completa com Wordmark     */}
      {/* ======================================================== */}
      <div
        className="flex md:hidden flex-col items-center justify-center w-full max-w-[414px] px-[28px] pt-[80px] pb-[40px] gap-[40px]"
        data-node-id="16:1228"
        data-name="Mobile / Cadastro"
      >
        {/* Wordmark KURIO Grande */}
        <div
          className="h-[136px] flex items-center justify-center"
          data-node-id="70410:4345"
          data-name="Logo"
        >
          <span
            className="font-mono font-bold text-[32px] text-[#F5F1EB] tracking-[3.2px]"
            data-node-id="70410:4346"
          >
            KURIO
          </span>
        </div>

        {/* Título: Criar perfil de colecionador */}
        <div
          className="w-full flex justify-center"
          data-node-id="70399:249"
          data-name="Title"
        >
          <h1
            className="font-mono font-bold text-[18px] leading-[16px] text-[#F5F1EB] text-center"
            data-node-id="16:1241"
          >
            Criar perfil de colecionador
          </h1>
        </div>

        {/* Formulário Mobile */}
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-[358px] flex flex-col gap-[12px]"
          data-node-id="70399:250"
          data-name="Form"
        >
          {/* Campo Nome de usuário */}
          <div
            className="h-[50px] w-full border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[10px] px-[16px] bg-transparent flex items-center transition-colors"
            data-node-id="70410:4348"
            data-name="Container"
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

          {/* Campo E-mail */}
          <div
            className="h-[50px] w-full border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[10px] px-[16px] bg-transparent flex items-center transition-colors"
            data-node-id="70410:4349"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
              aria-label="Digite seu e-mail"
            />
          </div>

          {/* Campo Senha com Toggle */}
          <div
            className="relative h-[50px] w-full border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[10px] pl-[16px] pr-[44px] bg-transparent flex items-center transition-colors"
            data-node-id="70410:4351"
          >
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Senha"
              className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
              aria-label="Senha"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#B39463] hover:text-[#E89B55] transition-colors p-1 cursor-pointer"
              aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
            >
              {showPassword ? <EyeShowIcon /> : <EyeHideIcon />}
            </button>
          </div>

          {/* Campo Confirmar Senha com Toggle */}
          <div
            className="relative h-[50px] w-full border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[10px] pl-[16px] pr-[44px] bg-transparent flex items-center transition-colors"
            data-node-id="70410:4353"
          >
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar senha"
              className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none"
              aria-label="Confirmar senha"
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

          {/* Mensagem de Erro Mobile */}
          {errorMessage && (
            <div
              role="alert"
              className="font-mono text-xs text-[#F0805F] bg-[#381F1A] border border-[#F0805F]/50 px-3 py-2 rounded"
            >
              {errorMessage}
            </div>
          )}

          {/* Botão Criar Perfil Mobile (h: 60px) */}
          <Button
            type="submit"
            disabled={isRegistering}
            className="h-[60px] w-full bg-[#D28A4C] hover:bg-[#E89B55] active:scale-[0.99] disabled:opacity-50 text-[#140D0A] font-mono font-bold text-[16px] leading-[16px] rounded-[10px] transition-all flex items-center justify-center cursor-pointer shadow-md mt-2"
            data-node-id="70399:251"
            data-name="Create Profile Button"
          >
            {isRegistering ? 'Criando perfil...' : 'Criar perfil'}
          </Button>
        </form>

        {/* Bloco de Login Social Mobile */}
        <div
          className="w-full max-w-[358px] flex flex-col gap-[12px]"
          data-node-id="70504:2994"
          data-name="Mobile Social Block"
        >
          {/* Divisor "Ou continue com" */}
          <div
            className="flex items-center gap-[10px] w-full"
            data-node-id="70504:2987"
          >
            <div className="flex-1 h-px bg-[#3F2319]" data-node-id="70504:2988" />
            <p
              className="font-mono text-[13px] leading-[16px] text-[#F5F1EB] whitespace-nowrap"
              data-node-id="70504:2989"
            >
              Ou continue com
            </p>
            <div className="flex-1 h-px bg-[#3F2319]" data-node-id="70504:2990" />
          </div>

          {/* Botões Sociais */}
          <div
            className="flex flex-col gap-[16px] w-full"
            data-node-id="70504:2991"
          >
            <button
              type="button"
              onClick={() => handlePreFillSocial('google')}
              className="h-[40px] w-full border border-[#3F2319] hover:border-[#D28A4C] rounded-[5px] flex items-center justify-center gap-[12px] bg-transparent text-[#CFB28C] font-mono font-medium text-[13px] leading-[16px] transition-colors cursor-pointer"
            >
              <GoogleIcon className="size-[20px]" />
              <span>Continuar com Google</span>
            </button>

            <button
              type="button"
              onClick={() => handlePreFillSocial('facebook')}
              className="h-[40px] w-full border border-[#3F2319] hover:border-[#D28A4C] rounded-[5px] flex items-center justify-center gap-[12px] bg-transparent text-[#CFB28C] font-mono font-medium text-[13px] leading-[16px] transition-colors cursor-pointer"
            >
              <FacebookIcon className="size-[20px]" />
              <span>Continuar com Facebook</span>
            </button>
          </div>
        </div>

        {/* Link Já tem uma conta? Entre */}
        <div
          className="w-full flex justify-center items-end pt-2"
          data-node-id="70399:255"
          data-name="Login Link"
        >
          <Link
            to="/login"
            search={{ redirect: search.redirect }}
            className="font-mono text-[15px] font-normal leading-normal text-[#CFB28C] hover:text-[#F5F1EB] transition-colors"
            data-node-id="16:1243"
          >
            Já tem uma conta? Entre
          </Link>
        </div>
      </div>
    </div>
  );
}
