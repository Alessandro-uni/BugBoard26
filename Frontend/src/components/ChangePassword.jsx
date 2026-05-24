import React, {useState} from "react";
import {Eye, EyeOff} from "lucide-react";

function ChangePassword({onChangePassword}) {
    const [currentRawPassword, setCurrentRawPassword] = useState('');
    const [newRawPassword, setNewRawPassword] = useState('');
    const [repeatNewRawPassword, setRepeatNewRawPassword] = useState('');

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showRepeatNewPassword, setShowRepeatNewPassword] = useState(false);
    const changeCurrentPasswordVisibility = () => setShowCurrentPassword(!showCurrentPassword);
    const changeNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
    const changeRepeatNewPasswordVisibility = () => setShowRepeatNewPassword(!showRepeatNewPassword);

    // Gestione invio modulo
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
                body: JSON.stringify({currentRawPassword: currentRawPassword, newRawPassword: newRawPassword, repeatNewRawPassword: repeatNewRawPassword}),
            });

            if (response.ok) {
                const userData = await response.json();
                onChangePassword(userData);
            } else {
                const errorJson = await response.json();
                alert("Errore: " + errorJson.message.currentRawPassword + errorJson.message.newRawPassword);
            }

        } catch (error){
            console.error("Errore nella chiamata al backend:", error);
            alert('Errore: ' + error.message);
        }
    };

    return (

        <div className="p-6">
        <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cambia password</h3>
            {/* Card del Form */}
            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Inserimeto pw corrente */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password corrente</label>
                        <div className="relative">
                            <input type={showCurrentPassword ? "text" : "password"}
                                   value={currentRawPassword}
                                   onChange={(e) => setCurrentRawPassword(e.target.value)}
                                   className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                                   placeholder="Inserisci la tua password corrente"
                                   required
                            />

                            {/* Pulsante occhio */}
                            <button
                                type="button"
                                onClick={changeCurrentPasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showCurrentPassword ? <Eye size={20}/> : <EyeOff size={20}/>}
                            </button>
                        </div>
                    </div>

                    {/* Inserimento nuova pw*/}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nuova password</label>
                        <div className="relative">
                            <input type={showNewPassword ? "text" : "password"}
                                   value={newRawPassword}
                                   onChange={(e) => setNewRawPassword(e.target.value)}
                                   className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                                   placeholder="Inserisci la nuova password"
                                   required
                            />

                            {/* Pulsante occhio */}
                            <button
                                type="button"
                                onClick={changeNewPasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showNewPassword ? <Eye size={20}/> : <EyeOff size={20}/>}
                            </button>
                        </div>
                    </div>

                    {/* Inserimento ripeti nuova pw*/}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ripeti nuova password</label>
                        <div className="relative">
                            <input type={showRepeatNewPassword ? "text" : "password"}
                                   value={repeatNewRawPassword}
                                   onChange={(e) => setRepeatNewRawPassword(e.target.value)}
                                   className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                                   placeholder="Conferma la nuova password"
                                   required
                            />

                            {/* Pulsante occhio */}
                            <button
                                type="button"
                                onClick={changeRepeatNewPasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showRepeatNewPassword ? <Eye size={20}/> : <EyeOff size={20}/>}
                            </button>
                        </div>
                    </div>

                    {/* Pulsante di conferma */}
                    <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">
                        Modifica
                    </button>

                </form>
            </div>
        </div>
        </div>
    );
}

export default ChangePassword;