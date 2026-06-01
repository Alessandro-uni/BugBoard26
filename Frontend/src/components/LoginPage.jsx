import React, {useState} from "react";
import {Eye, EyeClosed} from "lucide-react";
import {CustomButton} from "./CustomButton.jsx";

function LoginPage({onLogin}) {
    const [username,setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const changePasswordVisibility = () => setShowPassword(!showPassword);

    const errorMessage = document.getElementById("error-message");

    // Gestione invio modulo
    const handleSubmit = async (e) => {
        e.preventDefault();
        errorMessage.textContent = "";

        // Verifica che l'utente sia connesso alla rete
        if (!navigator.onLine) {
            errorMessage.textContent = "Sei offline. Controlla la tua connessione Internet e riprova";
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify({mail: username, rawPassword: password}),
            });

            if (response.ok) {
                const token = await response.json();
                localStorage.setItem("authentication_token", token);

                onLogin(token);
            } else {
                errorMessage.textContent = "Errore: Mail o password errati";
            }

        } catch (error) {
            console.error("Errore nella chiamata al backend:", error);
            errorMessage.textContent = "Connessione fallita. Il server potrebbe essere spento";
        }
    };

    return (
        <div className="size-full flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">

            <div className="w-full max-w-md px-8 py-2 bg-white rounded-2xl shadow-xl">
                <div className="text-center mb-8 mt-4">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Benvenutə su BugBoard 26
                        </h1>
                        <p className="text-gray-600">Accedi al tuo account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Inserimento username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mail</label>
                        <div className="relative">
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                                className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
                                   placeholder="Inserisci la tua mail"
                                   required
                            />
                        </div>
                    </div>

                    {/* Inserimento pw */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input type={showPassword ? "text" : "password"}
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   className="block w-full px-4 py-3 border border-gray-300 rounded-lg"
                                   placeholder="Inserisci la tua password"
                                   required
                            />

                            {/* Pulsante occhio */}
                            <button
                                type="button"
                                onClick={changePasswordVisibility}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                                {showPassword ? <Eye size={20}/> : <EyeClosed size={20}/>}
                            </button>
                        </div>
                    </div>

                    <CustomButton
                        variant="primary"
                        className="w-full py-3 px-3"
                    >
                        Accedi
                    </CustomButton>

                    {/* Paragrafo di errore */}
                    <p id="error-message" className="text-red-500"></p>

                </form>
            </div>
        </div>
    );
}

export default LoginPage;