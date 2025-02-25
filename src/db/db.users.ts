import Dexie, { type EntityTable } from "dexie";
import { Permission, Role } from "./db.administracion";

type Genero = 'M' | 'F';

interface Usuario {
    persona_id: number;
    fecha_alta: Date;
    documento: number;
    genero: Genero;
    apellidos: string;
    nombres: string;
    nombre_completo: string;
    fecha_nacimiento: Date;
    tramite: number;
    ejemplar: string;
    emision: Date;
    vencimiento: Date;
    cuil: string;
    codigo_postal: number;
    cpa: null;
    calle: string;
    numero: string;
    piso: string;
    monoblock: string;
    barrio: string;
    direccion_completa: string;
    fecha_fallecimiento: Date | null;
    fecha_registro: Date;
    actualizacion: Date;
    celular: string;
    celular_verificado: boolean;
    correo_electronico: string;
    correo_electronico_verificado: boolean;
    geo_localizacion: string | null;
    busy: boolean;
}

interface User {
    id: number;
    email: string;
    domicilio_electronico_id: number;
    usuario: Usuario;
}

const db = new Dexie("users") as Dexie & {
    users: EntityTable<User, 'id'>;
}


db.version(1).stores({
    users: 'id, email, domicilio_electronico_id, usuario',
});

export type { Usuario, User };
export default db;

export const getUser = async (id: number) => {
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
};

export const clearUsers = async () => {
    await db.users.clear();
};


