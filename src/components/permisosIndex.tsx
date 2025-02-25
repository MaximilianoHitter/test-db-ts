import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserPermissions, Permission } from "../db/db.administracion";
import { getUser } from "../db/db.users";


export default function PermisosIndex() {
    const { id } = useParams();

    const permis = async () => {
        const permisos = await getUserPermissions(Number(id));
        setPermissions(permisos);
    }

    const [permissions, setPermissions] = useState<Permission[]>([]);

    const [user, setUser] = useState<any>({});

    const userData = async () => {
        console.log(await getUser(Number(id)))
        return await getUser(Number(id));
    }

    useEffect(() => {
        permis();
        setUser(userData());
    }, []);


    return (
        <div>
            <button onClick={() => { setUser(userData()) }}>SetUser</button>
            <table className='table-fixed w-full border-collapse border-white'>
                {
                    <caption>
                        <h2 >Permisos de {user?.usuario?.nombre_completo}</h2>
                    </caption>
                }
                <tbody>
                    <tr>
                        <td className="border border-white">Id</td>
                        <td className="border border-white">Name</td>
                        <td className="border border-white">Description</td>
                        <td className="border border-white">Acciones</td>
                    </tr>
                    {permissions.map((permiso) => (
                        <tr key={permiso.id}>
                            <td className="border border-white">{permiso.id}</td>
                            <td className="border border-white">{permiso.name}</td>
                            <td className="border border-white">{permiso.description}</td>
                            <td className="border border-white"></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}