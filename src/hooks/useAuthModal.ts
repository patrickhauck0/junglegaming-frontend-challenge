import { useState, useEffect } from 'react';

let globalIsOpen = false;
let globalRedirectUrl: string | undefined = undefined;
const listeners = new Set<() => void>();

export function openLoginModal(redirect?: string) {
  globalIsOpen = true;
  globalRedirectUrl = redirect;
  listeners.forEach((l) => l());
}

export function closeLoginModal() {
  globalIsOpen = false;
  globalRedirectUrl = undefined;
  listeners.forEach((l) => l());
}

export function useLoginModal() {
  const [isOpen, setIsOpen] = useState(globalIsOpen);
  const [redirectUrl, setRedirectUrl] = useState(globalRedirectUrl);

  useEffect(() => {
    const handler = () => {
      setIsOpen(globalIsOpen);
      setRedirectUrl(globalRedirectUrl);
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  return {
    isOpen,
    redirectUrl,
    open: openLoginModal,
    close: closeLoginModal,
  };
}
