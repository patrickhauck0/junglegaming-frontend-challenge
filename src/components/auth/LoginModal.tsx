import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useAuth } from '@/hooks/useAuth';
import {
  CloseModalIcon,
  GoogleIcon,
  FacebookIcon,
  EyeHideIcon,
  EyeShowIcon,
} from '@/components/ui/icons';
import { Button, Input } from '@/components/ui';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl?: string;
  onSuccess?: () => void;
}

export function LoginModal({
  isOpen,
  onClose,
  redirectUrl,
  onSuccess,
}: LoginModalProps) {
  const navigate = useNavigate();
  const { login, isLoggingIn } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);

  const [emailOrUsername, setEmailOrUsername] = useState('contato@email.com');
  const [password, setPassword] = useState('kurio123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Escuta tecla Escape para fechar modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!emailOrUsername.trim() || !password.trim()) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await login({
        emailOrUsername: emailOrUsername.trim(),
        password: password.trim(),
      });
      onClose();
      if (onSuccess) {
        onSuccess();
      }
      if (redirectUrl) {
        navigate({ to: redirectUrl });
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        'E-mail, usuário ou senha incorretos. Use a senha de demonstração "kurio123".';
      setErrorMessage(msg);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#140D0A]/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Modal Box (Figma Node 70381:239 Sign In Modal) */}
      <div
        ref={modalRef}
        className="relative w-full max-w-[500px] bg-[#241612] border border-[#3F2319] rounded-[8px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        data-node-id="70381:239"
        data-name="Sign In Modal"
      >
        {/* Botão de Fechar X no topo direito */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar e voltar ao início"
          className="absolute right-3 top-3 p-2 text-[#D28A4C] hover:opacity-80 transition-opacity cursor-pointer z-30"
          data-node-id="9:947"
        >
          <CloseModalIcon className="size-[18px]" />
        </button>

        {/* Cabeçalho do Modal: Abas Entrar | Criar conta + Subtítulo */}
        <div
          className="flex flex-col items-center pt-[40px] md:pt-[48px] px-6 md:px-[48px]"
          data-node-id="70381:240"
          data-name="Modal Header"
        >
          <div
            className="flex gap-[8px] items-center justify-center"
            data-node-id="9:977"
          >
            <span
              id="login-modal-title"
              className="font-mono text-[20px] font-medium leading-[16px] text-[#E89B55]"
              data-node-id="9:949"
            >
              Entrar
            </span>
            <div
              className="w-px h-[20px] bg-[#F0805F]"
              data-node-id="70410:4120"
            />
            <button
              type="button"
              onClick={() => {
                onClose();
                navigate({
                  to: '/register',
                  search: redirectUrl ? { redirect: redirectUrl } : undefined,
                });
              }}
              className="font-mono text-[20px] font-medium leading-[16px] text-[#F5F1EB] hover:text-[#E89B55] transition-colors cursor-pointer bg-transparent border-0"
              data-node-id="9:950"
            >
              Criar conta
            </button>
          </div>

          <p
            className="font-mono text-[13px] font-normal leading-[16px] text-[#F5F1EB] text-center mt-[24px] md:mt-[40px]"
            data-node-id="9:955"
          >
            Entre para gerenciar sua carteira, coleção e perfil de criador.
          </p>
        </div>

        {/* Formulário de Login */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-[12px] pt-[20px] md:pt-[24px] px-6 md:px-[80px]"
          data-node-id="70381:241"
          data-name="Form"
        >
          {/* Input E-mail / Usuário */}
          <div
            className="h-[40px] w-full border border-[#3F2319] focus-within:border-[#D28A4C] rounded-[5px] px-[16px] py-[12px] bg-transparent flex items-center transition-colors"
            data-node-id="70381:242"
            data-name="Email Input"
          >
            <Input
              type="text"
              required
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="contato@email.com"
              className="w-full bg-transparent font-mono text-[14px] text-[#F5F1EB] placeholder:text-[#B39463] outline-none border-0 p-0 h-auto focus-visible:border-0 rounded-none shadow-none"
              aria-label="E-mail ou nome de usuário"
            />
          </div>

          {/* Input Senha com alternador de visibilidade */}
          <div
            className="relative h-[40px] w-full border border-[#D28A4C] rounded-[5px] pl-[16px] pr-[40px] py-[12px] bg-transparent flex items-center"
            data-node-id="70381:243"
            data-name="Password Input"
          >
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="***********"
              className="w-full bg-transparent font-mono text-[16px] text-[#F5F1EB] placeholder:text-[#F5F1EB] outline-none tracking-wider"
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

          {/* Link Esqueceu a senha */}
          <div
            className="flex justify-end"
            data-node-id="70381:244"
            data-name="Forgot Link"
          >
            <button
              type="button"
              onClick={() => alert('Para demonstração, use a senha padrão: kurio123')}
              className="font-mono text-[14px] leading-[16px] text-[#E89B55] hover:underline cursor-pointer bg-transparent border-0 p-0"
              data-node-id="9:984"
            >
              Esqueceu a senha?
            </button>
          </div>

          {/* Mensagem de Erro de Autenticação */}
          {errorMessage && (
            <div
              role="alert"
              className="font-mono text-xs text-[#F0805F] bg-[#381F1A] border border-[#F0805F]/50 px-3 py-2 rounded"
            >
              {errorMessage}
            </div>
          )}

          {/* Botão Entrar (CTA) */}
          <div
            className="pt-[8px] md:pt-[12px]"
            data-node-id="70381:245"
            data-name="CTA"
          >
            <Button
              type="submit"
              disabled={isLoggingIn}
              className="h-[45px] w-full bg-[#D28A4C] hover:bg-[#E89B55] active:scale-[0.99] disabled:opacity-50 text-[#140D0A] font-mono font-bold text-[16px] leading-[16px] rounded-[5px] transition-all flex items-center justify-center cursor-pointer shadow-md"
              data-node-id="70381:246"
              data-name="Sign In Button"
            >
              {isLoggingIn ? 'Entrando...' : 'Entrar'}
            </Button>
          </div>
        </form>

        {/* Bloco de Login Social */}
        <div
          className="flex flex-col gap-[12px] pt-[20px] md:pt-[24px]"
          data-node-id="70381:247"
          data-name="Social"
        >
          {/* Divisor "Ou continue com" */}
          <div
            className="flex items-center gap-[12px] px-6 md:px-[80px]"
            data-node-id="70381:248"
            data-name="Divider"
          >
            <div className="flex-1 h-px bg-[#3F2319]" data-node-id="9:986" />
            <p
              className="font-mono text-[13px] leading-[16px] text-[#F5F1EB] whitespace-nowrap"
              data-node-id="9:985"
            >
              Ou continue com
            </p>
            <div className="flex-1 h-px bg-[#3F2319]" data-node-id="9:987" />
          </div>

          {/* Botões Sociais */}
          <div
            className="flex flex-col gap-[10px] md:gap-[12px] px-6 md:px-[80px] pb-[24px] md:pb-[32px]"
            data-node-id="70402:3572"
          >
            <button
              type="button"
              onClick={() => {
                setEmailOrUsername('google.collector@kurio.eth');
                setPassword('kurio123');
              }}
              className="h-[40px] w-full border border-[#3F2319] hover:border-[#D28A4C] rounded-[5px] flex items-center justify-center gap-[12px] bg-transparent text-[#CFB28C] font-mono font-medium text-[13px] leading-[16px] transition-colors cursor-pointer"
              data-node-id="70483:256"
            >
              <GoogleIcon className="size-[20px]" />
              <span>Continuar com Google</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmailOrUsername('facebook.collector@kurio.eth');
                setPassword('kurio123');
              }}
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
          data-node-id="9:1228"
        />
      </div>
    </div>
  );
}
