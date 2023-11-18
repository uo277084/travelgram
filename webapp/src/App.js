import * as React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import AppRouter from './components/routes/AppRouter';
import listeners from './firebase/firebaseListeners';

function App() {

  const [userLogged, setUserLogged] = useState(null);

  useEffect(() => {
    const storedUser = window.localStorage.getItem('userLogged');
    setUserLogged(storedUser ? JSON.parse(storedUser) : null);
    if (storedUser) {
      const infoUser = JSON.parse(storedUser);
      hasSessionExpired(infoUser);
    }
  }, []);

  useEffect(() => {

    const updateUser = (user) => {
      const infoUser = JSON.parse(window.localStorage.getItem('userLogged'));
      infoUser.user = user;
      window.localStorage.setItem('userLogged', JSON.stringify(infoUser));
    };

    if (userLogged) {
      const unsubscribe = listeners.changeUserListener(userLogged.userId, (updatedUser) => {
        updateUser(updatedUser);
      });
      return () => unsubscribe();
    }
  }, [userLogged]);

  const hasSessionExpired = (dataUser) => {
    const currentTime = new Date().getTime();
    const userTime = new Date(dataUser.timestamp).getTime();
    const oneHour = 60 * 60 * 1000;
    if ((currentTime - userTime) >= oneHour) {
      window.localStorage.removeItem('userLogged');
      setUserLogged(null);
      window.location.href = '/';
    }
    return (currentTime - userTime) >= oneHour;
  }

  return (
    <div className="App">
      <AppRouter />
      {userLogged && hasSessionExpired(userLogged)}
    </div>
  );
}

export default App;
