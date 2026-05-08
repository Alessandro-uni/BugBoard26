import {useState} from "react";
//import {User} from 'lucide-react';

function ChangePassword({onChangePassword}) {

    //creiamo le variabili

    const [rawPassword, setRawPassword] = useState('');
    const [repeatRawPassword, setRepeatRawPassword] = useState('');


    //funzione: quando premi il tasto accedi si crea un oggetto che contiene tutte le info su quel click
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify({ rawPassword: rawPassword, repeatRawPassword: repeatRawPassword }),
            });

            if(response.ok){
                const userData = await response.json();
                console.log("Creazione riuscita:", userData);

                onChangePassword(userData);
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
        <div className="size-full flex items-center justify-center bg-gradient-to-br ">

            <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
                <div className="text-center mb-8">

                    <p className="text-gray-600"> Crea una nuova password</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/*inserimeto vecchia pw*/}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vecchia password</label>
                        <div className="relative">
                            <div>

                            </div>
                            <input type="text" value={rawPassword} onChange={(e) => setRawPassword(e.target.value)}
                                   className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                                   placeholder="Inserisci la vecchia password"
                                   required
                            />
                        </div>
                    </div>

                    {/*inserimento pw*/}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nuova password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">

                            </div>
                            <input type="password" value={rawPassword} onChange={(e) => setRawPassword(e.target.value)}
                                   className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                                   placeholder="Inserisci la nuova password"
                                   required
                            />
                        </div>
                    </div>

                    {/*inserimento ripeti pw*/}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ripeti password</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">

                            </div>
                            <input type="password" value={repeatRawPassword} onChange={(e) => setRepeatRawPassword(e.target.value)}
                                   className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg"
                                   placeholder="Inserisci la nuova  password"
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