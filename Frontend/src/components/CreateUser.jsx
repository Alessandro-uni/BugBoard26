import React, {useState} from "react";
import {Eye, EyeOff} from 'lucide-react';
import {CustomButton} from "./CustomButton.jsx";

function CreateUser({onCreateUser}) {
    const [mail,setMail] = useState('');
    const [username,setUsername] = useState('');
    const [rawPassword, setRawPassword] = useState('');
    const [repeatRawPassword, setRepeatRawPassword] = useState('');
    const [role, setRole] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showRepeatPassword, setShowRepeatPassword] = useState(false);
    const changePasswordVisibility = () => setShowPassword(!showPassword);
    const changeRepeatPasswordVisibility = () => setShowRepeatPassword(!showRepeatPassword);
    const passwordsMatch = repeatRawPassword.length > 0 && rawPassword === repeatRawPassword;
    const passwordsDontMatch = repeatRawPassword.length > 0 && rawPassword !== repeatRawPassword;

    // Stati per gestire gli errori
    const [errors, setErrors] = useState({});
    const [genericError, setGenericError] = useState('');

    // Funzione che rimuove l'errore in un campo, quando l'utente inizia a scriverci dentro
    const clearError = (fieldName) => {
        if (errors[fieldName]) {
            setErrors(prev => ({...prev, [fieldName]: undefined}));
        }
        setGenericError('');
    };

    const [isLoading, setIsLoading] = useState(false);

    // Gestione invio modulo
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (passwordsDontMatch) {
            setErrors({repeatPasswordMatch: "Le password non coincidono"});
            return;
        }

        setErrors({});
        setGenericError("");
        setIsLoading(true);

        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:8080/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                    //'Authorization': `Bearer ${token}`  // todo: togliere il commento dopo aver collegato il db persistente
                },
                body: JSON.stringify({mail: mail, username: username, rawPassword: rawPassword, repeatRawPassword: repeatRawPassword, role: role}),
            });

            if (response.ok) {
                const userData = await response.json();
                onCreateUser(userData);
            } else {
                const errorJson = await response.json();

                if (errorJson.message && typeof errorJson.message === 'object') {
                    setErrors((errorJson.message));
                } else {
                    setGenericError((errorJson.message || "Si è verificato un errore imprevisto durante la registrazione"));
                }
            }

        } catch (error) {
            console.error("Errore nella chiamata al backend:", error);
            setGenericError("Errore: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto">
            {/* Intestazione */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Crea un nuovo utente</h2>
                <p className="text-gray-600">Compila i campi e invia il modulo</p>
            </div>

            {/* Card del Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-md">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Username
                        </label>
                        <div className="relative">
                            <input type="text"
                                   value={username}
                                   onChange={(e) => {
                                       setUsername(e.target.value);
                                       clearError('username');
                                   }}
                                   className={`block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                       errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                   }`}
                                   placeholder="Inserisci l'username"
                                   required
                            />
                        </div>

                        {/* Mostra errore relativo ad username */}
                        {errors.username && <p className="mt-2 text-sm text-red-500">{errors.username}</p>}

                    </div>

                    {/* Mail */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mail
                        </label>
                        <div className="relative">
                            <input type="email"
                                   value={mail}
                                   onChange={(e) => {
                                       setMail((e.target.value).trim());
                                       clearError('mail');
                                   }}
                                   className={`block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                       errors.mail ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                   }`}
                                   placeholder="Inserisci la mail"
                                   required
                            />
                        </div>

                        {/* Mostra errore relativo a mail */}
                        {errors.mail && <p className="mt-2 text-sm text-red-500">{errors.mail}</p>}

                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"}
                                   value={rawPassword}
                                   onChange={(e) => {
                                       setRawPassword(e.target.value);
                                       clearError('rawPassword');
                                   }}
                                   className={`block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                       errors.rawPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                   }`}
                                   placeholder="Inserisci la password"
                                   required
                            />

                            {/* Pulsante occhio */}
                            <button
                                type="button"
                                onClick={changePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <Eye size={20}/> : <EyeOff size={20}/>}
                            </button>
                        </div>

                        {/* Mostra errore relativo a password */}
                        {errors.rawPassword && <p className="mt-2 text-sm text-red-500">{errors.rawPassword}</p>}

                    </div>

                    {/* Ripeti password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ripeti password
                        </label>
                        <div className="relative">
                            <input type={showRepeatPassword ? "text" : "password"}
                                   value={repeatRawPassword}
                                   onChange={(e) => {
                                       setRepeatRawPassword(e.target.value);
                                       clearError('repeatRawPassword');
                                       clearError('repeatPasswordMatch');
                                   }}
                                   className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200 ${
                                       (errors.repeatRawPassword || errors.repeatPasswordMatch)
                                           ? 'border-red-500 focus:ring-red-500'
                                           : repeatRawPassword.length > 0
                                               ? rawPassword === repeatRawPassword
                                                   ? 'border-green-500 focus:ring-green-500'
                                                   : 'border-red-500 focus:ring-red-500'
                                               : 'border-gray-300 focus:ring-gray-300'
                                   }`}
                                   placeholder="Conferma la password"
                                   required
                            />

                            {/* Pulsante occhio */}
                            <button
                                type="button"
                                onClick={changeRepeatPasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showRepeatPassword ? <Eye size={20}/> : <EyeOff size={20}/>}
                            </button>
                        </div>

                        {/* Feedback testuale */}
                        <>
                            {passwordsDontMatch && (
                                <p className="mt-2 text-sm text-red-500 font-medium">
                                    Le password non coincidono
                                </p>
                            )}
                            {passwordsMatch && (
                                <p className="mt-2 text-sm text-green-500 font-medium">
                                    Le password coincidono
                                </p>
                            )}
                        </>

                    </div>

                    {/* Ruolo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ruolo
                        </label>
                        <div className="relative">
                            <select
                                id="type"
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value);
                                    clearError('role');
                                }}
                                className={`block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                    errors.role ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                }`}
                                required
                            > {/* todo: decidere se prelevare ruoli dal db */}
                                <option value="" disabled hidden>Seleziona ruolo</option>
                                <option value="ADMIN">Admin</option>
                                <option value="USER">User</option>
                                <option value="LURKER">Lurker</option>
                            </select>
                        </div>

                        {/* Mostra errore relativo a ruolo */}
                        {errors.role && <p className="mt-2 text-sm text-red-500">{errors.role}</p>}

                    </div>

                    {/* Pulsante di conferma */}
                    <div className="flex justify-end">
                        <CustomButton
                            variant="primary"
                            disabled={isLoading || passwordsDontMatch}
                        >
                            {isLoading ? 'Creazione in corso...' : 'Crea utente'}
                        </CustomButton>
                    </div>

                    {/* Eventuali errori generici */}
                    {genericError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                            <p className="text-red-600 text-sm font-medium">{genericError}</p>
                        </div>
                    )}

                </form>
            </div>
        </div>
    );
}

export default CreateUser;