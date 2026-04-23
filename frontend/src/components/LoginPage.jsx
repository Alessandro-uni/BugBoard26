import {useState} from "react";
//import {User} from 'lucide-react';

function LoginPage({onLogin}) {

    //creiamo le variabili
    const [username,setUsername] = useState('');
    const [password, setPassword] = useState('');

    //funzione: quando premi il tasto accedi si crea un oggetto che contiene tutte le info su quel click
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({mail: username, rawPassword: password }),
            });

            if(response.ok){
                const userData = await response.json();
                console.log("Login riuscito:", userData);

                onLogin(userData);
            }else{
                const errorJson = await response.json();
                alert("Errore: " + errorJson.message);
            }
        } catch (error){
            console.error("Errore di connessione:", error);
            alert("il server non risponde");
        }


    };

    return (
        <div className="size-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">

            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center mb-8">

                        <h1 className="text-3xl font-bold text-gray-900 mb-2"> Benvenuto</h1>
                        <p className="text-gray-600"> Accedi al tuo account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/*inserimeto username*/}
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

                    {/*inserimento pw*/}
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

                </form>
            </div>
        </div>
    );

}

export default LoginPage;