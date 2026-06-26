import React, {useState, useEffect} from "react";
import {X} from "lucide-react";
import {ReloadingBox} from "./ReloadingBox.jsx";
import {API_BASE_URL} from "../apiConfig.js";

function History({issueId, onClose}){

    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            const token = sessionStorage.getItem('token');
            try{
                const response = await fetch(`${API_BASE_URL}/api/issues/${issueId}/history`,{
                    method: 'GET',
                    headers: {'Authorization': `Bearer ${token}`}
                });
                if(response.ok){
                    const data = await response.json();
                    setHistory(data);
                }
            }catch (err){
                console.error('Errore', err);
            }finally {
                setIsLoading(false);
            }
        }

        fetchHistory();
    }, [issueId]);


    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-lg mx-4 max-h-[80vh] flex flex-col border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Cronologia Issue</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X size={20}/></button>
                </div>

                <div className="overflow-y-auto flex-1 space-y-3 pr-2"
                    style={{minHeight: '200px',maxHeight: '400px',scrollbarWidth: 'thin'}}
                >
                    {isLoading ? (
                        <ReloadingBox description='Caricamento history in corso...'></ReloadingBox>
                    ) : history.length > 0 ? (
                        history.map((event, index) => (
                            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600 text-sm hover:border-blue-400 dark:hover:border-blue-500 transition-colors">

                                <p className="text-gray-600 dark:text-gray-300">
                                    <span className="font-medium text-gray-900 dark:text-white">{event.mainActorUsername}</span>
                                </p>
                                <p className="font-semibold text-blue-800 dark:text-blue-300">{event.action}</p>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {new Date(event.date).toLocaleString()}
                                </p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center py-4 text-gray-500 dark:text-gray-400">Nessun evento presente.</p>
                    )}
                </div>
            </div>
        </div>
    );

}
export default History;