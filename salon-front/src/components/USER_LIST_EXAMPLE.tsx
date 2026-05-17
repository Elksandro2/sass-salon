/**
 * Exemplo Real: Componente com Alertas
 * 
 * Este componente mostra como integrar o novo sistema de alertas
 * em um caso de uso real (deletar, confirmar ação, etc.)
 */

import { useState } from 'react';
import { useAlert } from '../hooks/useAlert';
import api from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
}

export const UserListExample = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { confirm, success, error } = useAlert();

  const handleDeleteUser = async (user: User) => {
    await confirm(
      `Tem certeza que deseja deletar ${user.name}? Esta ação não pode ser desfeita.`,
      async () => {
        setIsLoading(true);
        try {
          await api.delete(`/users/${user.id}`);
          setUsers((prev) => prev.filter((u) => u.id !== user.id));
          await success(`${user.name} foi deletado com sucesso!`, 'Usuário Deletado');
        } catch (err: any) {
          await error(
            err.response?.data?.message || 'Erro ao deletar usuário',
            'Erro na Deleção'
          );
        } finally {
          setIsLoading(false);
        }
      },
      {
        title: 'Deletar Usuário',
        confirmText: 'Deletar',
        cancelText: 'Cancelar',
        isDangerous: true,
      }
    );
  };

  /**
   * Exemplo de bulk delete (não implementado neste componente)
   * 
   * Para usar:
   * 
   * const handleBulkDelete = async (userIds: number[]) => {
   *   await confirm(
   *     `Deseja deletar ${userIds.length} usuários? Esta ação não pode ser desfeita.`,
   *     async () => {
   *       // ... implementar operação
   *     },
   *     { title: 'Deletar Múltiplos', isDangerous: true }
   *   );
   * };
   */

  return (
    <div>
      <table>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button
                  onClick={() => handleDeleteUser(user)}
                  disabled={isLoading}
                  style={{ backgroundColor: '#ef4444', color: 'white' }}
                >
                  Deletar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/**
 * Padrões Recomendados:
 * 
 * 1. SEMPRE use isDangerous={true} para operações irreversíveis (delete, etc)
 * 2. Use confirmText descritivo: "Deletar", "Confirmar Ação", não genérico
 * 3. Mosupe o que vai acontecer na mensagem
 * 4. Use success/error para feedback após operação
 * 5. Sempre trate exceções da API
 * 6. Mostrar loading state enquanto processa
 */
