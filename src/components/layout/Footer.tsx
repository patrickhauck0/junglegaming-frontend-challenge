import React, { useState } from 'react';
import {
  KurioLogo,
  SocialFacebookIcon,
  SocialInstagramIcon,
  SocialTwitterIcon,
  SocialLinkedinIcon,
  SocialYoutubeIcon,
} from '@/components/ui/icons';

export function Footer() {
  const [email, setEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setNewsletterSubmitted(true);
      setEmail('');
    }
  };

  return (
    <footer className="w-full bg-ink mt-24 pb-20 md:pb-0">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[120px]">
        {/* Bloco 1: Garantias e Newsletter (Figma Frame 70491:697) */}
        <div className="bg-surface-card rounded-t-lg p-6 lg:p-8 border border-border/60">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            {/* Medallion W: Segurança da carteira */}
            <div className="flex flex-col gap-3">
              <div className="size-[74px] rounded-full bg-primary flex items-center justify-center text-ink font-bold text-2xl">
                W
              </div>
              <h3 className="text-[17px] font-bold text-foreground leading-snug">
                Segurança da carteira
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Proteja sua carteira e colecione arte digital verificada com confiança.
              </p>
            </div>

            {/* Medallion C: Criadores em destaque */}
            <div className="flex flex-col gap-3 lg:border-l lg:border-border/60 lg:pl-8">
              <div className="size-[74px] rounded-full bg-primary flex items-center justify-center text-ink font-bold text-2xl">
                C
              </div>
              <h3 className="text-[17px] font-bold text-foreground leading-snug">
                Criadores em destaque
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
              </p>
            </div>

            {/* Medallion D: Alertas de lançamentos */}
            <div className="flex flex-col gap-3 lg:border-l lg:border-border/60 lg:pl-8">
              <div className="size-[74px] rounded-full bg-primary flex items-center justify-center text-ink font-bold text-2xl">
                D
              </div>
              <h3 className="text-[17px] font-bold text-foreground leading-snug">
                Alertas de lançamentos
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
              </p>
            </div>

            {/* Newsletter Box */}
            <div className="flex flex-col gap-3 lg:border-l lg:border-border/60 lg:pl-8">
              <h3 className="text-[18px] font-bold text-foreground leading-snug">
                Antecipe-se ao próximo lançamento
              </h3>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-2">
                <div className="flex bg-surface-dark rounded-md border border-border/80 overflow-hidden shadow-inner">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="digite seu e-mail..."
                    className="flex-1 min-w-0 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-secondary focus-visible:outline-none"
                    aria-label="E-mail para assinar a newsletter"
                    required
                  />
                  <button
                    type="submit"
                    className="shrink-0 whitespace-nowrap bg-primary hover:bg-primary-hover text-ink font-bold text-sm px-4 py-2 transition-colors focus-visible:ring-2 focus-visible:ring-foreground cursor-pointer"
                  >
                    Enviar
                  </button>
                </div>
                {newsletterSubmitted && (
                  <span className="text-xs text-text-accent font-medium" role="status">
                    Obrigado por assinar!
                  </span>
                )}
              </form>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
              </p>
            </div>
          </div>
        </div>

        {/* Bloco 2: Faixa de Contato / Brand Band */}
        <div className="bg-surface-dark border-x border-border/60 px-6 lg:px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-foreground">
          <div className="font-bold tracking-widest">
            <KurioLogo className="h-5 w-auto" />
          </div>
          <div>
            <p className="text-foreground leading-tight">Feito para colecionadores,</p>
            <p className="text-foreground leading-tight">criadores e cultura</p>
          </div>
          <div>
            <a
              href="mailto:contato@email.com"
              className="hover:text-text-accent transition-colors"
            >
              contato@email.com
            </a>
          </div>
          <div>
            <span>+55 11 4002 8922</span>
          </div>
        </div>

        {/* Bloco 3: Links e Redes Sociais */}
        <div className="bg-surface-card border border-border/60 p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Coluna 1: Meu Perfil */}
            <div className="flex flex-col gap-3">
              <h4 className="text-lg font-bold text-foreground">Meu perfil</h4>
              <ul className="flex flex-col gap-2 text-sm text-text-secondary">
                <li className="hover:text-foreground cursor-pointer">Meu perfil</li>
                <li className="hover:text-foreground cursor-pointer">Minha coleção</li>
                <li className="hover:text-foreground cursor-pointer">Atividade</li>
                <li className="hover:text-foreground cursor-pointer">Estúdio do criador</li>
                <li className="hover:text-foreground cursor-pointer">Lista de interesse</li>
              </ul>
            </div>

            {/* Coluna 2: Central de Ajuda */}
            <div className="flex flex-col gap-3">
              <h4 className="text-lg font-bold text-foreground">Central de ajuda</h4>
              <ul className="flex flex-col gap-2 text-sm text-text-secondary">
                <li className="hover:text-foreground cursor-pointer">Central de ajuda</li>
                <li className="hover:text-foreground cursor-pointer">Como comprar NFTs</li>
                <li className="hover:text-foreground cursor-pointer">Carteira e segurança</li>
                <li className="hover:text-foreground cursor-pointer">Política do mercado</li>
                <li className="hover:text-foreground cursor-pointer">Denunciar item</li>
              </ul>
            </div>

            {/* Coluna 3: Coleções */}
            <div className="flex flex-col gap-3">
              <h4 className="text-lg font-bold text-foreground">Coleções</h4>
              <ul className="flex flex-col gap-2 text-sm text-text-secondary">
                <li className="hover:text-foreground cursor-pointer">Arte digital</li>
                <li className="hover:text-foreground cursor-pointer">Fotografia</li>
                <li className="hover:text-foreground cursor-pointer">Música</li>
                <li className="hover:text-foreground cursor-pointer">Arte 3D</li>
                <li className="hover:text-foreground cursor-pointer">Utilidade</li>
              </ul>
            </div>

            {/* Coluna 4: Redes Sociais e Carteiras */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h4 className="text-lg font-bold text-foreground">Redes sociais</h4>
                <div className="flex items-center gap-2.5">
                  <span className="cursor-pointer hover:opacity-80 transition-opacity" aria-label="Facebook">
                    <SocialFacebookIcon />
                  </span>
                  <span className="cursor-pointer hover:opacity-80 transition-opacity" aria-label="Instagram">
                    <SocialInstagramIcon />
                  </span>
                  <span className="cursor-pointer hover:opacity-80 transition-opacity" aria-label="Twitter">
                    <SocialTwitterIcon />
                  </span>
                  <span className="cursor-pointer hover:opacity-80 transition-opacity" aria-label="LinkedIn">
                    <SocialLinkedinIcon />
                  </span>
                  <span className="cursor-pointer hover:opacity-80 transition-opacity" aria-label="YouTube">
                    <SocialYoutubeIcon />
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-lg font-bold text-foreground">Carteiras compatíveis</h4>
                <div className="bg-surface-dark border border-border-soft rounded-md px-3 py-2 text-[9px] text-text-accent font-bold tracking-widest text-center">
                  METAMASK • WALLETCONNECT • COINBASE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="py-6 text-center text-xs text-text-secondary">
          © 2026 Kurio. Propriedade digital para todos.
        </div>
      </div>
    </footer>
  );
}
