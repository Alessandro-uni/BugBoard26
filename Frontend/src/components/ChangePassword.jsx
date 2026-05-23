import {useState} from "react";
//import {User} from 'lucide-react';

function ChangePassword({onChangePassword}) {
    const [oldRawPassword, setOldRawPassword] = useState('');
    const [newRawPassword, setNewRawPassword] = useState('');
    const [repeatNewRawPassword, setRepeatNewRawPassword] = useState('');


    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8080/api/users/me/password', {
                method: 'PUT',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({oldRawPassword: oldRawPassword, newRawPassword: newRawPassword, repeatNewRawPassword: repeatNewRawPassword}),
            });

            if (response.ok) {
                const userData = await response.json();
                onChangePassword(userData);
            } else {
                const errorJson = await response.json();
                alert("Errore: " + errorJson.message.oldRawPassword + errorJson.message.newRawPassword);
            }

        } catch (error){
            console.error("Errore nella chiamata al backend:", error);
            alert('Errore: ' + error.message);
        }
    };

    return (
        <div className="size-full flex items-center justify-center bg-linear-to-br ">

            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center mb-8">
                    <p className="text-gray-600"> Crea una nuova password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Inserimeto vecchia pw */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password attuale</label>
                        <div className="relative">
                            <input type="password" value={oldRawPassword} onChange={(e) => setOldRawPassword(e.target.value)}
                                   className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                                   placeholder="Inserisci la vecchia password"
                                   required
                            />
                        </div>
                    </div>

                    {/* Inserimento nuova pw*/}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nuova password</label>
                        <div className="relative">
                            <input type="password" value={newRawPassword} onChange={(e) => setNewRawPassword(e.target.value)}
                                   className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                                   placeholder="Inserisci la nuova password"
                                   required
                            />
                        </div>
                    </div>

                    {/* Inserimento ripeti nuova pw*/}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ripeti nuova password</label>
                        <div className="relative">
                            <input type="password" value={repeatNewRawPassword} onChange={(e) => setRepeatNewRawPassword(e.target.value)}
                                   className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                                   placeholder="Conferma la nuova  password"
                                   required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">Cambia password</button>

                </form>
            </div>
        </div>
    );
}

export default ChangePassword;