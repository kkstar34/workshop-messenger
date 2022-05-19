
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Home from './pages/Home';
import AuthMiddleware from './middleware/AuthMiddleware';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login/> }/>
      <Route path="/register" element={<Register/>}/>
      
      <Route path="/home" element={<AuthMiddleware><Home/></AuthMiddleware>}/>
    </Routes>
  );
}

export default App;
