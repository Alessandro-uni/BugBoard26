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

import {jwtDecode} from 'jwt-decode';

function App() {
    // Stati pagina
    const [currentPage, setCurrentPage] = useState('HomePage');
    const [previousPage, setPreviousPage] = useState('HomePage');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [theme, setTheme] = useState('light');

    // Stati utente
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState(null)
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [userPermissions, setUserPermissions] = useState(null);

    // Stato issue
    const [selectIssueId, setSelectIssueId] = useState(null);

    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // Funzioni per la gestione degli eventi

    // Funzione per login
    const handleLogin = userData => {
        if (userData) {
            setIsLoggedIn(true);

            try {
                const decoded = jwtDecode(userData.token);

                const id = decoded.userId;
                const username = decoded.username;
                const role = decoded.role ? decoded.role.toUpperCase().trim() : 'LURKER';
                const permissions = Array.isArray(decoded.permissions) ? decoded.permissions : [];

                // Salvataggio del token nel local storage
                sessionStorage.setItem('token', userData.token);

                setUserId(id);
                setUserName(username);
                setUserRole(role);
                setUserPermissions(permissions);
                setIsLoggedIn(true);

            } catch (error) {
                console.error("Errore nella decodifica del token:", error);
                alert("Errore imprevisto durante l'accesso.");
            }
        }
    };

    // Funzione che aggiorna le pagine
    const handleNavigation = (page) => {
        setIsMenuOpen(false);

        if (page === 'Esci') {
            sessionStorage.removeItem('token');

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

    // Funzione per visualizzare l'issue selezionata
    const handleViewIssue = (issueId) => {
        setSelectIssueId(issueId);
        setPreviousPage(currentPage);
        setCurrentPage('Issue selezionata');
    };

    // Funzione per tornare alla pagina precedente
    const handleBack = () => {
        setSelectIssueId(null);
        setCurrentPage(previousPage);
    };

    // Verifica che l'utente sia loggato
    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin}/>;
    }

    /*
      FUNZIONE = definiamo cosa deve apparire fisicamente sullo schermo
    */

    // Funzione per la gestione della visualizzazione della pagina richiesta
    const renderPage = () => {
        switch (currentPage) {
            case 'HomePage':
                return <HomePage onViewIssue={handleViewIssue} currentUserId={userId} userName={userName} userPermissions={userPermissions} onNavigation={handleNavigation}/>;

            case 'Tutte le issue':
                return <ViewIssueList onViewIssue={handleViewIssue} initialBodyParams={{}} key={currentPage} pageName={currentPage}/>;

            case 'Issue assegnate':
                return <ViewIssueList onViewIssue={handleViewIssue} initialBodyParams={{assignedUserId: userId}} key={currentPage} pageName={currentPage}/>;

            case 'Issue segnalate':
                return <ViewIssueList onViewIssue={handleViewIssue} initialBodyParams={{reportingUserId: userId}} key={currentPage} pageName={currentPage}/>;

            case 'Segnala Issue':
                return <CreateIssue onCancel={() => handleNavigation('HomePage')} onIssueCreated={handleViewIssue}/>;

            case 'Assegna Issue':
                return <ViewIssueList onViewIssue={handleViewIssue} initialBodyParams={{isAssignable: true}} key={currentPage} pageName={currentPage}/>;

            case 'Aggiungi nuovo utente':
                return <CreateUser onCreateUser={handleNavigation}/>;

            case 'Cambia password':
                return <ChangePassword onLogout={handleNavigation}/>;

            case 'Issue selezionata':
                return <ViewSingleIssue issueId={selectIssueId} userPermissions={userPermissions} userId={userId} onBack={handleBack}/>;
            // todo: rivedi il default quando viene utilizzato
            default:
                return <HomePage onViewIssue={handleViewIssue} currentUserId={userId} userName={userName} userPermissions={userPermissions} onNavigation={handleNavigation}/>;
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
                userPermissions={userPermissions}
            />

            <div className="flex-1 flex flex-col min-w-0 min-h-0">
                <Header
                    theme={theme}
                    setTheme={setTheme}
                    onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
                    onHomeClick={() => setCurrentPage('HomePage')}
                    isHomeOpen={currentPage === 'HomePage'}
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