import { addUser, clearUsers, getUser, getUsers, User } from '../db/db.users'
import { clearRolePermissions, getUserPermissions, getUserRoles, setUser } from '../db/db.administracion'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Index() {

    const [req, setReq] = useState({
        data: null, error: null, loading: false
    })

    const [users, setUsers] = useState<User[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (users.length === 0) {
            setUsersTable();
        }
    }, []);

    const setUsersTable = async () => {
        const res = await fetch('http://template-laravel.test/api/user')
        const data = await res.json()
        setReq({ data, error: null, loading: false })
        console.log(data.data);
        await clearUsers();
        await clearRolePermissions();
        setUser(data.data.id, data.data.roles, data.data.permissions);
        let userData = data.data;
        delete userData.roles;
        delete userData.permissions;
        addUser(data.data);
        setUsers(await getUsers());
    }

    return (
        <>
            <div className='flex justify-center gap-2'>
                {/* <button
                    type='button'
                    disabled={req.loading}
                    onClick={async () => {
                        setReq({ ...req, loading: true })
                        try {
                            setUsersTable();

                        } catch (error) {
                            console.log(error);
                            setReq({ data: null, error, loading: false })
                        }
                    }}
                >Obtener usuario y cargarlo
                    {req.loading &&
                        <div role="status">
                            <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                        </div>
                    }</button> */}
                <button type='button' onClick={async () => {
                    await clearUsers();
                    await clearRolePermissions();
                    setUsers(await getUsers());
                }}>Limpiar tablas</button>
            </div>
            <div className='mt-4'>
                <table className='table-fixed w-full border-collapse border-white'>
                    <tbody>
                        <tr>
                            <td className="border border-white">Id</td>
                            <td className="border border-white">Email</td>
                            <td className="border border-white">Nombre Completo</td>
                            <td className="border border-white">Acciones</td>
                        </tr>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="border border-white">{user.id}</td>
                                <td className="border border-white">{user.email}</td>
                                <td className="border border-white">{user.usuario.nombre_completo}</td>
                                <td className="border border-white">
                                    <button type='button' onClick={async () => {

                                        console.log(await getUserRoles(user.id))
                                    }}>
                                        Obtener Roles
                                    </button>
                                    <button type='button' onClick={async () => {
                                        navigate('/permisos/' + user.id)
                                        //console.log(await getUserPermissions(user.id))
                                    }}
                                        aria-labelledby="modal-title" role="dialog" aria-modal="true"
                                    >
                                        Obtener Permisos
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}