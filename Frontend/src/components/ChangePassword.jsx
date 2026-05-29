import React, {useState} from "react";
import {Eye, EyeClosed} from "lucide-react";
import {CustomButton} from "./CustomButton.jsx";

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
    const passwordsMatch = repeatNewRawPassword.length > 0 && newRawPassword === repeatNewRawPassword;
    const passwordsDontMatch = repeatNewRawPassword.length > 0 && newRawPassword !== repeatNewRawPassword;

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
            setErrors({repeatNewPasswordMatch: "Le password non coincidono"});
            return;
        }

        setErrors({});
        setGenericError("");
        setIsLoading(true);

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

                if (errorJson.message && typeof errorJson.message === 'object') {
                    setErrors((errorJson.message))
                } else {
                    setGenericError((errorJson.message || "Si è verificato un errore imprevisto durante il cambio della password"));
                }
            }

        } catch (error){
            console.error("Errore nella chiamata al backend:", error);
            setGenericError("Errore: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            {/* Intestazione */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Cambia password</h2>
                <p className="text-gray-600">Compila i campi e invia il modulo</p>
            </div>

            {/* Card del Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-md">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Inserimeto pw corrente */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password corrente
                        </label>
                        <div className="relative">
                            <input type={showCurrentPassword ? "text" : "password"}
                                   value={currentRawPassword}
                                   onChange={(e) => {
                                       setCurrentRawPassword(e.target.value);
                                       clearError('currentRawPassword')
                                   }}
                                   className={`block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                       errors.currentRawPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                   }`}
                                   placeholder="Inserisci la tua password corrente"
                                   required
                            />

                            {/* Pulsante occhio */}
                            <button
                                type="button"
                                onClick={changeCurrentPasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showCurrentPassword ? <Eye size={20}/> : <EyeClosed size={20}/>}
                            </button>
                        </div>

                        {/* Mostra errore relativo a password */}
                        {errors.currentRawPassword && <p className="mt-2 text-sm text-red-500">{errors.currentRawPassword}</p>}

                    </div>

                    {/* Inserimento nuova pw*/}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nuova password
                        </label>
                        <div className="relative">
                            <input type={showNewPassword ? "text" : "password"}
                                   value={newRawPassword}
                                   onChange={(e) => {
                                       setNewRawPassword(e.target.value);
                                       clearError('newRawPassword');
                                   }}
                                   className={`block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                                       errors.newRawPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
                                   }`}
                                   placeholder="Inserisci la nuova password"
                                   required
                            />

                            {/* Pulsante occhio */}
                            <button
                                type="button"
                                onClick={changeNewPasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showNewPassword ? <Eye size={20}/> : <EyeClosed size={20}/>}
                            </button>
                        </div>

                        {/* Mostra errore relativo a password */}
                        {errors.newRawPassword && <p className="mt-2 text-sm text-red-500">{errors.newRawPassword}</p>}

                    </div>

                    {/* Inserimento ripeti nuova pw*/}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ripeti nuova password
                        </label>
                        <div className="relative">
                            <input type={showRepeatNewPassword ? "text" : "password"}
                                   value={repeatNewRawPassword}
                                   onChange={(e) => {
                                       setRepeatNewRawPassword(e.target.value);
                                       clearError('repeatNewRawPassword');
                                       clearError('repeatNewPasswordMatch');
                                   }}
                                   className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-colors duration-200 ${
                                       (errors.repeatNewRawPassword || errors.repeatNewPasswordMatch)
                                           ? 'border-red-500 focus:ring-red-500'
                                           : repeatNewRawPassword.length > 0
                                               ? newRawPassword === repeatNewRawPassword
                                                   ? 'border-green-500 focus:ring-green-500'
                                                   : 'border-red-500 focus:ring-red-500'
                                               : 'border-gray-300 focus:ring-gray-300'
                                   }`}
                                   placeholder="Conferma la nuova password"
                                   required
                            />

                            {/* Pulsante occhio */}
                            <button
                                type="button"
                                onClick={changeRepeatNewPasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showRepeatNewPassword ? <Eye size={20}/> : <EyeClosed size={20}/>}
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

                    {/* Pulsante di conferma */}
                    <div className="flex justify-end">
                        <CustomButton
                            variant="primary"
                            disabled={isLoading || passwordsDontMatch}
                        >
                            {isLoading ? 'Modifica in corso...' : 'Modifica'}
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

export default ChangePassword;