// src/components/UserCreateModal.tsx
import { Icon } from '@iconify/react';
import React, { useState, useCallback, useEffect } from 'react';
import SectorAutocomplete from './SectorAutocomplete';
import EntityService from '../services/entities.service';
import { ItemsComboBaseDTO } from '../interfaces/ItemsComboBaseDTO';
import RoleService from '../services/role.service';

export interface UserFormData {
  fullName: string;
  email: string;
  roleId: string;
  phone: string;
  password: string;
  entityId: number | null;
}

interface UserToEdit {
  id: number;
  fullName: string;
  email: string;
  roleId: number;
  phone: string;
  entityId: number | null;
  entity: {
    id: number;
    name: string;
    abbreviation?: string;
    entityType: string;
    governmentLevel: string;
  };
  role: {
    id: number;
    name: string;
  };
}

interface UserCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData, id?: number) => void;
  userToEdit?: UserToEdit | null;
}

export default function UserCreateModal({
  isOpen,
  onClose,
  onSubmit,
  userToEdit = null,
}: UserCreateModalProps) {
  const isEdit = !!userToEdit;

  const [formData, setFormData] = useState<UserFormData>({
    fullName: '',
    email: '',
    roleId: '',
    phone: '',
    password: '',
    entityId: null,
  });

  const [selectedEntity, setSelectedEntity] = useState<ItemsComboBaseDTO | null>(null);
  const [loadingEntities, setLoadingEntities] = useState(false);
  const [entities, setEntities] = useState<ItemsComboBaseDTO[]>([]);

  const [roles, setRoles] = useState<ItemsComboBaseDTO[]>([]);

  // Precargar datos cuando se abre el modal o cambia el usuario a editar
  useEffect(() => {
    if (isOpen) {
      initfunctions();

      if (isEdit && userToEdit) {
        setFormData({
          fullName: userToEdit.fullName || '',
          email: userToEdit.email || '',
          roleId: String(userToEdit.roleId) || '',
          phone: userToEdit.phone || '',
          password: '',
          entityId: userToEdit.entityId,
        });

        // Preseleccionar entidad
        if (userToEdit.entity) {
          const entityDTO: ItemsComboBaseDTO = {
            key: userToEdit.entity.id,
            value: userToEdit.entity.name,
            description: `${userToEdit.entity.abbreviation || ''} • ${userToEdit.entity.entityType} • ${userToEdit.entity.governmentLevel}`,
          };
          setSelectedEntity(entityDTO);
        }
      } else {
        // Limpieza para creación
        setFormData({
          fullName: '',
          email: '',
          roleId: '',
          phone: '',
          password: '',
          entityId: null,
        });
        setSelectedEntity(null);
      }
    }
  }, [isOpen, userToEdit, isEdit]);

  async function initfunctions() {
    RoleService.fetchCombo().then((roles: ItemsComboBaseDTO[]) => {
      setRoles(roles);
    });

    // Carga inicial de entidades (vacío o todas)
    EntityService.search('').then((entities: ItemsComboBaseDTO[]) => {
      setEntities(entities);
    });
  }

  const handleSearchEntities = useCallback(async (query: string) => {
    setLoadingEntities(true);
    try {
      const results = await EntityService.search(query);
      setEntities(results);
    } catch (error) {
      console.error('Error searching entities:', error);
      setEntities([]);
    } finally {
      setLoadingEntities(false);
    }
  }, []);

  const handleEntityChange = (entity: ItemsComboBaseDTO | null) => {
    setSelectedEntity(entity);
    setFormData((prev) => ({
      ...prev,
      entityId: entity ? entity.key : null,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.entityId) {
      alert('Por favor seleccione una entidad');
      return;
    }

    onSubmit(formData, isEdit ? userToEdit?.id : undefined);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            {isEdit ? 'Editar usuario' : 'Registrar nuevo usuario'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <Icon icon="mdi:close" className="text-2xl text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombres completos <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gob-red))] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Correo electrónico <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gob-red))] focus:border-transparent"
            />
          </div>

          <div>
            <SectorAutocomplete<ItemsComboBaseDTO, false>
              label="Entidad"
              data={entities}
              onSearch={handleSearchEntities}
              value={selectedEntity}
              onChange={handleEntityChange}
              multiple={false}
              allowNoSpecify={false}
              placeholder="Seleccione una entidad"
              required
              getLabel={(e) => e.value}
              getKey={(e) => e.key}
              loading={loadingEntities}
              getDescription={(e) => e.description || ''}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rol <span className="text-red-600">*</span>
            </label>
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gob-red))] focus:border-transparent"
            >
              <option value="">Seleccione un rol</option>
              {roles.map((role) => (
                <option key={role.key} value={role.key}>
                  {role.value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Teléfono
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gob-red))] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña {isEdit ? '' : <span className="text-red-600">*</span>}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required={!isEdit}
              placeholder={isEdit ? 'Dejar vacío para no cambiar' : ''}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--gob-red))] focus:border-transparent"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[hsl(var(--gob-red))] hover:bg-[hsl(var(--gob-red-dark))] text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
            >
              {isEdit ? 'Guardar cambios' : 'Registrar usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}