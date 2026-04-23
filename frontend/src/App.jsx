import { useState } from 'react'
import LoginPage from './components/LoginPage.jsx';
//import './App.css'

function App() {

  /*
    useState resituisce una array che contiene due elementi [il primo = stato attuale / il secondo = stato aggiornato]
   */

  //creo una costante per verificare lo stato: l'utente è loggato? false = no, true = si
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //verifico quale pagina è attualmente visibile nell'app
  const [currentPage, setCurrentPage] = useState('Home');

  const [selectIssueId, setSelectIssueId] = useState(null);

  // modalità aggiungi utente
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  // modalità cambia pw
  const [isChangePwModalOpen, setIsChangePwModalOpen] = useState(false);

  /*
    FUNZIONI PER LA GESTIONE DI EVENTI = reagisce a un'azione dell'utente e decide cosa deve succedere nell'app
    si occupano di cambiare stato
   */

  //funzione per l'accesso del login: accetta due parametri username e pw
  const handleLogin = userData => {

    //verifica che non siano entrambi  vuoti
    if(userData){
      setIsLoggedIn(true); //segna l'utente come autenticato tramite useState che aggiorna lo stato
    }
    setUserInfo(username);

  };

  //funzione che aggiorna le pagine
  const handleNavigation = (page) => {

    //controlli
    if(page == 'Logout') {
      setIsLoggedIn(false);
      setCurrentPage('Home');
      setSelectIssueId(null);
    }else if (page == 'Aggiungi User') {
      setIsAddUserModalOpen(true);
    }else if (page == 'Cambia Password') {
      setIsChangePwModalOpen(true);
    }else {
      setCurrentPage(page);
      setSelectIssueId(null);
    }
  };

  //funziona che porta l'utente dalla  pagina generale  ViewIssue a quella specifica di un singolo issue
  const handleViewIssue = (issueId) => {
    setSelectIssueId(issueId); //indichi quale issue hai selezionato
    setCurrentPage('Visualizza Singola Issue'); //aggiorna la pagina
  };

  //funzione di torna indietro
  const handleBackToList = () => {
    setSelectIssueId(null);
    setCurrentPage('Visualizza tutte le Issues');
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
      case 'home':
        return <HomePage onViewIssue={handleViewIssue} />;

      case 'Visualizza tutte le Issues':
        return <ViewAllIssuesPage onViewIssue={handleViewIssue} />;

      case 'Crea Issue':
        return <CreateIssuePage />;

      case 'Assegna Issues':
        return <AssignIssuesPage />;

      case 'Visulizza singola Issue':
        return selectIssueId ? (
            <ViewSingleIssuePage issueId={selectIssueId} onBack={handleBackToList()}/>
        ):(
            <HomePage onViewIssue={handleViewIssue} />
        );

      default:
        return <HomePage onViewIssue={handleViewIssue} />;
    }
  };


  //struttura visiva principale dell'app
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-gray-50">
        <Menu currentPage={currentPage} onNavigate={handleNavigation}/>

        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          <main className="p-4 md:p-8 lg:p-12 overflow-y-auto">
            <div className="max-w-7xl mx-auto w-full">
              {renderPage()}
            </div>
          </main>
        </div>


          <AddUserModal
            isOpen={isAddUserModalOpen}
            onClose={() => setIsAddUserModalOpen(false)}
          />

          <ChangePwModal
            isOpen={isChangePwModalOpen}
            onClone={() => setIsChangePwModalOpen(false)}
          />
        
    </div>
  )
}

export default App
