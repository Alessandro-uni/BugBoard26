import React, {useState, useEffect} from "react";
import {Loader2, X} from "lucide-react";

function History({issueId, onClose}){

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            try{
                const response = await fetch(`http://localhost:8080/api/issues/${issueId}/history`,{
                    headers: {'Authorization': `Bearer ${token}`}
                });
                if(response.ok){
                    const data = await response.json();
                    console.log("Dati ricevuti dall'API:", data);
                    setHistory(data);
                }
            }catch (err){
                console.error('Errore', err);
            }finally {
                setLoading(false);
            }
        }

        fetchHistory();
    }, [issueId]);


    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900">Cronologia Issue</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20}/></button>
                </div>

                <div className="overflow-y-auto flex-1 space-y-3 pr-2"
                    style={{minHeight: '200px',maxHeight: '400px',scrollbarWidth: 'thin'}}
                >
                    {loading ? (
                        <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600"/></div>
                    ) : history.length > 0 ? (
                        history.map((event, index) => (
                            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm hover:border-blue-200 transition-colors">
                                <p className="font-semibold text-blue-800">{event.action}</p>
                                <p className="text-gray-600">
                                    Effettuato da <span className="font-medium text-gray-900">{event.mainActorUsername}</span>
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(event.date).toLocaleString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-4 text-gray-500">Nessun evento presente.</p>
                    )}
                </div>
            </div>
        </div>
    );

}
export default History;