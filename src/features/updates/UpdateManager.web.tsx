import { useEffect } from 'react';
import { useToast } from '@/components/ui';
export function UpdateManager() {
  const toast = useToast();
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;
    let disposed = false;
    navigator.serviceWorker
      .register('/coi-serviceworker.js')
      .then(async (reg) => {
        const offer = () => {
          if (reg.waiting && !disposed)
            toast({
              message: 'Nova versão disponível',
              actionLabel: 'Atualizar',
              onAction: () => reg.waiting?.postMessage('ACTIVATE_UPDATE'),
              duration: 15000,
            });
        };
        offer();
        reg.addEventListener('updatefound', () =>
          reg.installing?.addEventListener('statechange', offer),
        );
        await navigator.serviceWorker.ready;
        const cacheNames = await caches.keys();
        if (!disposed && cacheNames.some((n) => n.startsWith('ers-financas-')))
          toast({ message: 'Aplicativo disponível offline', duration: 4000 });
      })
      .catch(() => {
        if (!disposed) toast({ message: 'Não foi possível preparar o cache offline.' });
      });
    const reload = () => window.location.reload();
    navigator.serviceWorker.addEventListener('controllerchange', reload);
    return () => {
      disposed = true;
      navigator.serviceWorker.removeEventListener('controllerchange', reload);
    };
  }, [toast]);
  return null;
}
