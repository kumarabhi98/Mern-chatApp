import React from 'react';
import { Route } from "react-router-dom";
import Home from './pages/home'
import ChatPage from './pages/chatPage'

function App() {  
  return (
      <div className="App">
        <Route path='/' component={Home} exact />
        <Route path='/chats' component={ChatPage} />
      </div>
  );
}

export default App;

