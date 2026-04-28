import { useState } from 'react'
import LoginPage from './components/LoginPage.jsx';
import Header from "./components/Header.jsx";
import Menu from "./components/Menu.jsx";
import MenuAdmin from "./components/MenuAdmin.jsx";
import HomePage from "./components/HomePage.jsx";
import ViewIssueList from "./components/ViewIssueList.jsx";
import CreateIssue from "./components/CreateIssue.jsx";
import CreateUser from "./components/CreateUser.jsx";
import ChangePassword from "./components/ChangePassword.jsx";
import ViewSingleIssue from "./components/ViewSingleIssue.jsx";

//import './App.css'
import { jwtDecode } from 'jwt-decode'; //libreria perla decodifica di JWT(Json Web Token)

function App() {

  /*
    useState resituisce una array che contiene due elementi [il primo = stato attuale / il secondo = stato aggiornato]
   */

  //creo una costante per verificare lo stato: l'utente è loggato? false = no, true = si
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //verifico quale pagina è attualmente visibile nell'app
  const [currentPage, setCurrentPage] = useState('HomePage');

  const [selectIssueId, setSelectIssueId] = useState(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState('ADMIN');

  /*
    FUNZIONI PER LA GESTIONE DI EVENTI = reagisce a un'azione dell'utente e decide cosa deve succedere nell'app
    si occupano di cambiare stato
   */

  //funzione per l'accesso del login: accetta due parametri username e pw
  const handleLogin = userData => {
    //verifica che non siano entrambi  vuoti
    if(userData){
      setIsLoggedIn(true); //segna l'utente come autenticato tramite useState che aggiorna lo stato

      try {
        //Decodifica del token
        const decoded = jwtDecode(userData.token);
        console.log("Token decodificato:", decoded);

        //Estrazione del ruolo
        const role = decoded.role ? decoded.role.toLowerCase().trim() : 'user';

        //Aggiornamento dello stato
        setIsLoggedIn(true);
        setUserRole(role);
        localStorage.setItem('token', userData.token);

      } catch (error) {
        console.error("Errore nella decodifica del token:", error);
        alert("Errore durante l'accesso.");
      }

    }
    //setUserInfo(username);

  };

  //funzione che aggiorna le pagine
  const handleNavigation = (page) => {

    setIsMenuOpen(false);
    //controlli
    if(page == 'Esci') {
      setIsLoggedIn(false);
      setUserRole('user');
      setCurrentPage('HomePage');
      setSelectIssueId(null);
    }else if (page == 'Aggiungi nuovo utente') {
      setCurrentPage('Aggiungi nuovo utente');
      setSelectIssueId(null);
    }else if (page == 'Cambia Password') {
      setCurrentPage('Cambia Password');
      setSelectIssueId(null);
    }else {
      setCurrentPage(page);
      setSelectIssueId(null);
    }
  };

  //funziona che porta l'utente dalla  pagina generale  ViewIssue a quella specifica di un singolo issue
  const handleViewIssue = (issueId) => {
    setSelectIssueId(issueId); //indichi quale issue hai selezionato
    setCurrentPage('Assegna Issue'); //aggiorna la pagina
  };

  //funzione di torna indietro
  const handleBackToList = () => {
    setSelectIssueId(null);
    setCurrentPage('Visualizza tutte le Issues');
  };

  const handleHomeClick = () => {
    setCurrentPage('HomePage');
    setSelectIssueId(null);
  };

  //CONTROLLO = se l'utente non accede, mostra solo la pagina di login

  if(!isLoggedIn) {
    return <LoginPage onLogin={handleLogin}/>;
  }

  /*
    FUNZIONE = definiamo cosa deve apparire fisicamente sullo schermo
   */
  const renderPage = () => {
    switch (currentPage) {
      case 'HomePage':
        return <HomePage onViewIssue={handleViewIssue} />;

      case 'Visualizza tutte le Issue':
        return <ViewIssueList onViewIssue={handleViewIssue} />;

      case 'Crea Issue':
        return <CreateIssue />;

      case 'Assegna Issue':
        return selectIssueId ? (
            <ViewSingleIssue issueId={selectIssueId} userRole={userRole}  onBack={handleBackToList}/>
        ):(
            <HomePage onViewIssue={handleViewIssue} />
        );

      case 'Aggiungi nuovo utente':
        return <CreateUser onCreateUser={handleNavigation} />;

      case 'Cambia Password':
        return <ChangePassword onChangePassword={handleNavigation}/>;

      default:
        return <HomePage onViewIssue={handleViewIssue} />;
    }
  };


  //struttura visiva principale dell'app
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gray-50">
      {/*<Menu currentPage={currentPage} onNavigate={handleNavigation}/>*/}
      {userRole === 'admin' ? (
          <MenuAdmin isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} currentPage={currentPage} onNavigate={handleNavigation}/>
      ) : (
          <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} currentPage={currentPage} onNavigate={handleNavigation} />
      )}

        <div className="flex-1 flex flex-col min-w-0">
          <Header isMenuOpen={isMenuOpen} onToggleMenu={() => setIsMenuOpen(!isMenuOpen)} onHomeClick={() => setCurrentPage('HomePage')}/>
          <main className="p-4 md:p-8 lg:p-12 overflow-y-auto">
            <div className="max-w-7xl mx-auto w-full">
              {renderPage()}
            </div>
          </main>
        </div>

    </div>
  )
}

export default App
