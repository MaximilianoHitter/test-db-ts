import Dexie, { type EntityTable } from "dexie";

interface Permission {
    id: number;
    name: string;
    description: string;
}

interface User_Has_Role {
    model_id: number;
    role_id: number;
    model_type: string;
}

interface User_Has_Permission {
    model_id: number;
    permission_id: number;
    model_type: string;
}

interface Role_Has_Permission {
    role_id: number;
    permission_id: number;
}

interface Role {
    id: number;
    name: string;
    description: string;
    permissions: Permission[];
}

const role_permission = new Dexie("role_permission") as Dexie & {
    role: EntityTable<Role, 'id'>;
    permission: EntityTable<Permission, 'id'>;
    user_has_role: '[model_id+role_id]';
    user_has_permission: '[model_id+permission_id]';
    role_has_permission: '[role_id+permission_id]';
}

role_permission.version(1).stores({
    role: 'id, name, description, permissions',
    permission: 'id, name, description',
    user_has_role: 'model_id, role_id, model_type',
    user_has_permission: 'model_id, permission_id, model_type',
    role_has_permission: 'role_id, permission_id',
});

export type { Role, Permission, Role_Has_Permission, User_Has_Role, User_Has_Permission };
export default role_permission;

export const getRole = async (name: string) => {
    try {
        const role = await role_permission.role.where('name').equals(name).first();
        return role;
    } catch (error) {
        console.log('No se ha encontrado ningún rol');
        return null;
    }
}

export const getPermission = async (name: string) => {
    try {
        const permission = await role_permission.permission.where('name').equals(name).first();
        return permission;
    } catch (error) {
        console.log('No se ha encontrado el permiso');
        return null;
    }
}

export const setUser = async (user_id: number, roles: Role[], permissions: Permission[]) => {
    try {
        permissions.map(async (permission: Permission) => {
            await role_permission.permission.add(permission);
            await role_permission.user_has_permission.add({
                model_id: user_id,
                permission_id: permission.id,
                model_type: 'App\\Models\\User',
            });
        });
        console.log('Permisos añadidos');
    } catch (error) {
        console.log('Hubo un error añadiendo permisos');
        console.log(error);
    }

    try {
        roles.map(async (role: Role) => {
            await role_permission.role.add(role);
            await role_permission.user_has_role.add({
                model_id: user_id,
                role_id: role.id,
                model_type: 'App\\Models\\User',
            });
            role.permissions.map(async (permission) => {
                await role_permission.role_has_permission.add({
                    role_id: role.id,
                    permission_id: permission.id,
                });
            });
        });
        console.log('Roles añadidos correctamente');
    } catch (error) {
        console.log('Hubo un error añadiendo roles');
        console.log(error);
    }

}

export const getUserRoles = async (user_id: number) => {
    try {
        const user_has_roles = await role_permission.user_has_role.where('model_id').equals(user_id).toArray();
        const roles = await Promise.all(user_has_roles.map(async (user_has_role) => {
            const role = await role_permission.role.get(user_has_role.role_id);
            return role;
        }));
        return roles;
    } catch (error) {
        console.log('Hubo un error obteniendo los roles del usuario');
        console.log(error);
        return null;
    }
}

export const getUserPermissions = async (user_id: number) => {
    try {
        const user_has_permissions = await role_permission.user_has_permission.where('model_id').equals(user_id).toArray();
        const permisos = await Promise.all(user_has_permissions.map(async (user_has_permission) => {
            const permission = await role_permission.permission.get(user_has_permission.permission_id);
            return permission;
        }));
        return permisos;
    } catch (error) {
        console.log('Hubo un error obteniendo los permisos del usuario');
        console.log(error);
        return null;
    }
}

export const clearRolePermissions = async () => {
    await role_permission.role.clear();
    await role_permission.permission.clear();
    await role_permission.user_has_role.clear();
    await role_permission.user_has_permission.clear();
    await role_permission.role_has_permission.clear();
}


/* export const getUser = async (id: number) => {
    const user = await db.users.get(id);
    return user;
};

export const getUsers = async () => {
    const users = await db.users.toArray();
    return users;
};

export const addUser = async (user: User) => {
    await db.users.add(user);
};

export const updateUser = async (user: User) => {
    await db.users.put(user);
};

export const deleteUser = async (id: number) => {
    await db.users.delete(id);
}; */
