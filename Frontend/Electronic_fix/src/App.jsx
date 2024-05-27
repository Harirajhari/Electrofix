import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GetStartedPage from './component/GetStarted';
import Login from "./component/Login";
import Dashboard from './component/Dashboard';
import Profile from "./component/Profile";
import AskQuestion from './component/AskQuestion';

function App() {

  return (
    <>
    <Router>
            <Routes>
                <Route path="/" element={<GetStartedPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/ask-question" element={<AskQuestion />} />
            </Routes>
        </Router>
    </>
  )
}

export default App
