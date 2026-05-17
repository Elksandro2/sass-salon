/**
 * GUIA DE USO - useAlert Hook
 * 
 * Este é um exemplo de como usar o novo sistema de alertas elegante
 * em qualquer componente da aplicação.
 */

import { useAlert } from '../hooks/useAlert';

export const ExemploComponente = () => {
  const { alert, confirm, success, error } = useAlert();

  // Exemplo 1: Alerta simples
  const handleSimpleAlert = async () => {
    await alert('Esta é uma mensagem simples', {
      title: 'Informação',
      type: 'info',
    });
  };

  // Exemplo 2: Confirmação
  const handleConfirm = async () => {
    const confirmed = await confirm(
      'Deseja realmente deletar este item?',
      () => {
        // Código executado se confirmar
        console.log('Item deletado!');
      },
      {
        title: 'Deletar Item',
        confirmText: 'Deletar',
        cancelText: 'Cancelar',
        isDangerous: true, // Deixa o botão vermelho
      }
    );

    if (confirmed) {
      console.log('Usuário confirmou');
    } else {
      console.log('Usuário cancelou');
    }
  };

  // Exemplo 3: Mensagem de sucesso
  const handleSuccess = async () => {
    await success('Operação realizada com sucesso!', 'Sucesso');
  };

  // Exemplo 4: Mensagem de erro
  const handleError = async () => {
    await error('Algo deu errado. Tente novamente.', 'Erro');
  };

  // Exemplo 5: Confirmação com async operation
  const handleAsyncConfirm = async () => {
    await confirm(
      'Deseja processar este arquivo?',
      async () => {
        // Operação assíncrona será executada
        // enquanto o modal mostra "..."
        await fetch('/api/process');
      },
      {
        title: 'Processar',
      }
    );
  };

  return (
    <div>
      <button onClick={handleSimpleAlert}>Alerta Simples</button>
      <button onClick={handleConfirm}>Confirmação</button>
      <button onClick={handleSuccess}>Sucesso</button>
      <button onClick={handleError}>Erro</button>
      <button onClick={handleAsyncConfirm}>Async Confirm</button>
    </div>
  );
};

/**
 * API Reference:
 * 
 * alert(message, options?)
 *   - message: string (obrigatório)
 *   - options: { title?, type?, confirmText? }
 *   - Returns: Promise<boolean>
 * 
 * confirm(message, onConfirm?, options?)
 *   - message: string (obrigatório)
 *   - onConfirm: () => void | Promise<void> (opcional)
 *   - options: { title?, confirmText?, cancelText?, isDangerous? }
 *   - Returns: Promise<boolean> (true se confirmou, false se cancelou)
 * 
 * success(message, title?)
 *   - message: string (obrigatório)
 *   - title: string (opcional, default: "Sucesso!")
 *   - Returns: Promise<boolean>
 * 
 * error(message, title?)
 *   - message: string (obrigatório)
 *   - title: string (opcional, default: "Erro!")
 *   - Returns: Promise<boolean>
 * 
 * Types: 'success' | 'error' | 'warning' | 'info'
 */
