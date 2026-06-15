import { useState, useEffect } from 'react'
import LoginPage from './components/LoginPage.jsx';
import Header from "./components/Header.jsx";
import Menu from "./components/Menu.jsx";
import HomePage from "./components/HomePage.jsx";
import ViewIssueList from "./components/ViewIssueList.jsx";
import CreateIssue from "./components/CreateIssue.jsx";
import CreateUser from "./components/CreateUser.jsx";
import ChangePassword from "./components/ChangePassword.jsx";
import ViewSingleIssue from "./components/ViewSingleIssue.jsx";

import { jwtDecode } from 'jwt-decode'; // Libreria per la decodifica di JWT (Json Web Token)

function App() {

    // Creo una costante per verificare lo stato: l'utente è loggato? false = no, true = si
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Verifico quale pagina è attualmente visibile nell'app
    const [currentPage, setCurrentPage] = useState('HomePage');

    // Conservo la pagina precedente
    const [previousPage, setPreviousPage] = useState('HomePage');

    const [selectIssueId, setSelectIssueId] = useState(null);

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userId, setUserId] = useState(null)
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState(null);

    //TEMA
    const [theme, setTheme] = useState('light');

    //NOTIFICHE
    const [notifications, setNotifications] = useState([
        { id: 1, message: "Nuova issue assegnata", time: "10 min fa" },
        { id: 2, message: "Aggiunto un nuovo utente", time: "5 min fa" }
    ]);

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    /*
      FUNZIONI PER LA GESTIONE DI EVENTI = reagisce a un'azione dell'utente e decide cosa deve succedere nell'app
      si occupano di cambiare stato
    */

    // Funzione per l'accesso del login: accetta due parametri mail e pw
    const handleLogin = userData => {
        // Verifica che non siano entrambi vuoti
        if (userData) {
            setIsLoggedIn(true); // Segna l'utente come autenticato tramite useState che aggiorna lo stato

            try {
                // Decodifica del token
                const decoded = jwtDecode(userData.token);

                // Estrazione dell'id
                const id = decoded.userId;

                // Estrazione del ruolo
                const role = decoded.role ? decoded.role.toUpperCase().trim() : 'LURKER';

                // Estrazione dello username
                const username = decoded.username;

                // Aggiornamento dello stato
                setIsLoggedIn(true);
                setUserId(id);
                setUserRole(role);
                setUserName(username);
                localStorage.setItem('token', userData.token);

            } catch (error) {
                console.error("Errore nella decodifica del token:", error);
                alert("Errore durante l'accesso.");
            }

        }
      //setUserInfo(username);

    };

    // Funzione che aggiorna le pagine
    const handleNavigation = (page) => {
        setIsMenuOpen(false);

        //controlli
        if (page === 'Esci') {
            // Eliminato il token
            localStorage.removeItem('token');

            setIsLoggedIn(false);
            setUserRole(null);
            setSelectIssueId(null);
            setUserId(null);
            setUserName(null);
            setTheme('light');
            setCurrentPage('HomePage');
        } else {
            setSelectIssueId(null);
            setCurrentPage(page);
        }
    };

    // Funziona che porta l'utente dalla pagina generale ViewIssueList a quella specifica di una singola issue
    const handleViewIssue = (issueId) => {
        setSelectIssueId(issueId);
        setPreviousPage(currentPage);
        setCurrentPage('Issue selezionata');
    };

    // Funzione di torna indietro
    const handleBack = () => {
        setSelectIssueId(null);
        setCurrentPage(previousPage);
    };

    const handleHomeClick = () => {
        setSelectIssueId(null);
        setCurrentPage('HomePage');
    };

    //CONTROLLO = se l'utente non accede, mostra solo la pagina di login

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin}/>;
    }

    /*
      FUNZIONE = definiamo cosa deve apparire fisicamente sullo schermo
    */

    const renderPage = () => {
        switch (currentPage) {
            case 'HomePage':
                return <HomePage onViewIssue={handleViewIssue} currentUserId={userId} userName={userName} userRole={userRole} onNavigation={handleNavigation}/>;

            case 'Tutte le issue':
                return <ViewIssueList onViewIssue={handleViewIssue} initialBodyParams={{}} key={currentPage} pageName={currentPage}/>;

            case 'Issue assegnate':
                return <ViewIssueList onViewIssue={handleViewIssue} initialBodyParams={{assignedUserId: userId}} key={currentPage} pageName={currentPage}/>;

            case 'Issue segnalate':
                return <ViewIssueList onViewIssue={handleViewIssue} initialBodyParams={{reportingUserId: userId}} key={currentPage} pageName={currentPage}/>;

            case 'Segnala Issue':
                return <CreateIssue onCancel={() => handleNavigation('HomePage')} onIssueCreated={handleViewIssue}/>;

            case 'Assegna Issue':
                return <ViewIssueList onViewIssue={handleViewIssue} initialBodyParams={{isAssigned: false}} key={currentPage} pageName={currentPage}/>;

            case 'Aggiungi nuovo utente':
                return <CreateUser onCreateUser={handleNavigation}/>;

            case 'Cambia password':
                return <ChangePassword onLogout={handleNavigation}/>;

            case 'Issue selezionata':
                return <ViewSingleIssue issueId={selectIssueId} userRole={userRole} userId={userId} onBack={handleBack}/>;

            default:
                return <HomePage onViewIssue={handleViewIssue} currentUserId={userId} userName={userName} userRole={userRole} onNavigation={handleNavigation}/>;
        }
    };

    // Struttura visiva principale dell'app
    return (
        <div className="h-screen overflow-hidden w-full flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            {/* Menu */}
            <Menu
                isOpen={isMenuOpen}
                onClose={() => setIsMenuOpen(false)}
                currentPage={currentPage}
                onNavigate={handleNavigation}
                userRole={userRole}
            />

            <div className="flex-1 flex flex-col min-w-0 min-h-0">
                <Header
                    theme={theme}
                    setTheme={setTheme}
                    onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
                    onHomeClick={() => setCurrentPage('HomePage')}
                    isHomeOpen={currentPage === 'HomePage'}
                    notifications={notifications}
                    removeNotification={removeNotification}
                />

                <main className="flex-1 py-4 md:py-4 overflow-y-auto [scrollbar-gutter:stable]">
                    <div className="max-w-screen-2xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                        {renderPage()}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default App