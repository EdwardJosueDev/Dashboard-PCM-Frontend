// src/pages/Users.tsx
import { Icon } from '@iconify/react';
import React, { useEffect, useState } from 'react';
import CompleteTable from '../components/CompleteTable';
import { Column } from '../types/table';
import UserCreateModal, { UserFormData } from '../components/UserCreateModal';
import { PaginatedResponse, User, UserService } from '../services/users.service';

interface UserTableDto {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: string;
  entity: string;
  object: User;
}

export default function Users() {
  const [data, setData] = useState<UserTableDto[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [limit, setLimit] = useState<number>(30);
  const [offset, setOffset] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<UserTableDto | null>(null);

  const fetchUsers = async () => {
    try {
      const response: PaginatedResponse<User> = await UserService.getAll();
      if (!response.data) return;

      const usersTableModel: UserTableDto[] = response.data.map((user: User) => ({
        id: user.id,
        name: user.fullName ?? '',
        entity: user.entity?.name ?? '',
        role: user.role?.name ?? '',
        phone: user.phone ?? '',
        email: user.email ?? '',
		object: user
      }));

      setData(usersTableModel);
      setTotalItems(response.total ?? 0);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSaveUser = async (userData: UserFormData, userId?: number) => {
    try {
      if (userId) {
        // Edición (implementa el update en tu service cuando lo tengas)
        console.log('Actualizando usuario ID:', userId, userData);
		await UserService.update(userId,{
          email: userData.email,
          fullName: userData.fullName,
          password: userData.password,
          roleId: parseInt(userData.roleId),
          entityId: userData.entityId!,
          phone: userData.phone,
        });
        // await UserService.update(userId, userData);
      } else {
        // Creación
        await UserService.create({
          email: userData.email,
          fullName: userData.fullName,
          password: userData.password,
          roleId: parseInt(userData.roleId),
          entityId: userData.entityId!,
          phone: userData.phone,
        });
      }

      setIsModalOpen(false);
      setUserToEdit(null);
      await fetchUsers();
    } catch (error) {
      console.error('Error guardando usuario:', error);
      alert('No se pudo guardar el usuario');
    }
  };

  const openCreateModal = () => {
    setUserToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: UserTableDto) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const cols: Column<UserTableDto>[] = [
    { header: 'Nombre', field: 'name' },
    { header: 'Teléfono', field: 'phone' },
    { header: 'Correo', field: 'email' },
    { header: 'Rol', field: 'role' },
    { header: 'Entidad', field: 'entity' },
    {
      header: 'Acciones',
      type: 'buttons',
      render: (row: UserTableDto) => {
        return (
          <>
            <div className="inline-flex gap-4">
              <button
                onClick={() => openEditModal(row)}
                className="flex items-center gap-2 p-2 bg-[hsl(var(--gob-red))] hover:bg-[hsl(var(--gob-red-dark))] text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
                title="Editar"
              >
                <Icon icon="mdi:pencil" className="text-xl" />
              </button>
              <button
                onClick={async () => {
                  if (window.confirm(`¿Estás seguro de eliminar al usuario ${row.name}?`)) {
                    try {
                      await UserService.delete(row.id);
                      await fetchUsers();
                    } catch (error) {
                      console.error('Error eliminando:', error);
                      alert('No se pudo eliminar el usuario');
                    }
                  }
                }}
                className="flex items-center gap-2 p-2 bg-[hsl(var(--gob-red))] hover:bg-[hsl(var(--gob-red-dark))] text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
                title="Eliminar"
              >
                <Icon icon="mdi:delete" className="text-xl" />
              </button>
            </div>
          </>
        );
      },
    },
  ];

  return (
    <div className="w-full bg-gray-50 shadow rounded-xl">
      <div className="w-full p-4">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h5 className="text-4xl font-headlines font-semibold capitalize">Usuarios</h5>
            <p className="text-lg font-cafe text-gray-700">
              Un usuario es miembro de su equipo.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--gob-red))] hover:bg-[hsl(var(--gob-red-dark))] text-white rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            <Icon icon="mdi:user-add" className="text-xl" />
            <span className="hidden sm:inline font-medium text-sm">Registrar Usuario</span>
          </button>
        </div>
      </div>
      <hr className="my-4 border-t-2 border-gray-100 dark:border-gray-200" />

      <section className="h-[calc(100vh-17rem)] overflow-y-auto">
        <CompleteTable<UserTableDto>
          cols={cols}
          data={data}
          total={totalItems}
          limit={limit}
          offset={offset}
          onSearch={() => {}}
          onAction={() => {}}
        />
      </section>

      <UserCreateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setUserToEdit(null);
        }}
        onSubmit={handleSaveUser}
        userToEdit={userToEdit ? {
			id: userToEdit.object.id,
			fullName: userToEdit.object.fullName,
			email: userToEdit.object.email,
			roleId: userToEdit.object.role.id, 
			phone: userToEdit.phone,
			entityId: userToEdit.object.entity.id, 
			role: userToEdit.object.role,
			entity: userToEdit.object.entity,
        } : null}
      />
    </div>
  );
}