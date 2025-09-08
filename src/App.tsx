import { Route, Routes } from 'react-router-dom';
import Dashboard from './component/Dashboard/Dashboard';
import Login from './component/AuthSystem/Login/Login';
import Register from './component/AuthSystem/Register/Register';
import Wallet from './component/AuthSystem/Wallet';
import Card from './component/AuthSystem/Card';
import Welcome from './component/AuthSystem/Welcome';
import Support from './Support/Support';
import AI from './Support/AI';
import Profile from './component/Profile/Profile';
function App() {

  return (
    <>
      <Routes>
        <Route path="/Profile" element={<Profile />} />
        <Route path="/AI" element={<AI />} />
        <Route path="/Support" element={<Support />} />
        <Route path='/Welcome' element={<Welcome />}></Route>
        <Route path="/Card" element={<Card />} />
        <Route path="/Wallet" element={<Wallet />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/Register" element={<Register />} />
      </Routes>
    </>
  )
}

export default App
