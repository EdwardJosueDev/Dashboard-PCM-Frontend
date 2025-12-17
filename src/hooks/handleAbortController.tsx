// src/utils/handleAbortController.ts
import { useRef, useEffect } from 'react';

export function handleAbortController() {
  const controllerRef = useRef<AbortController | null>(null);

  const createController = () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    return controller;
  };

  const abort = () => {
    controllerRef.current?.abort();
    controllerRef.current = null;
  };

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  return { createController, abort };
}
