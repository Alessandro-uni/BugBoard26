import {useState} from "react";
//import {User} from 'lucide-react';

function LoginPage({onLogin}) {
    const [username,setUsername] = useState('');
    const [password, setPassword] = useState('');

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

            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center mb-8">

                        <h1 className="text-3xl font-bold text-gray-900 mb-2"> Benvenuto</h1>
                        <p className="text-gray-600"> Accedi al tuo account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Inserimento username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mail</label>
                        <div className="relative">
                            <div>

                            </div>
                            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                                   placeholder="Inserisci la tua mail"
                                   required
                            />
                        </div>
                    </div>

                    {/* Inserimento pw */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">

                            </div>
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                                   className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                                   placeholder="Inserisci la tua password"
                                   required
                            />
                        </div>
                    </div>

                    <button type="submit" className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg">Accedi</button>

                    {/* Paragrafo di errore */}
                    <p id="error-message" className="text-red-500"></p>

                </form>
            </div>
        </div>
    );
}

export default LoginPage;