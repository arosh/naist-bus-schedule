export type ServiceWorkerConfig = {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
};

export function register(config?: ServiceWorkerConfig): void;
export function unregister(): void;
