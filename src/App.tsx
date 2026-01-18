import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { StoreProvider } from './contexts/StoreContext'
import { AuthProvider } from './contexts/AuthContext'

// Store Pages
import StorePage from './pages/store/Store'
import StoreCheckout from './pages/store/Checkout'
import StoreSuccess from './pages/store/Success'

// Client Pages
import ClientLogin from './pages/client/Login'
import ClientRegister from './pages/client/Register'
import ClientHome from './pages/client/Home'
import ClientHistory from './pages/client/History'
import ClientTopup from './pages/client/Topup'
import ClientSettings from './pages/client/Settings'
import ClientPalmPairs from './pages/client/PalmPairs'

function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <Router>
          <Routes>
            {/* Client Routes */}
            <Route path="/client/login" element={<ClientLogin />} />
            <Route path="/client/register" element={<ClientRegister />} />
            <Route path="/client/home" element={<ClientHome />} />
            <Route path="/client/history" element={<ClientHistory />} />
            <Route path="/client/topup" element={<ClientTopup />} />
            <Route path="/client/settings" element={<ClientSettings />} />
            <Route path="/client/palm-pairs" element={<ClientPalmPairs />} />
            
            {/* Store Routes */}
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/checkout" element={<StoreCheckout />} />
            <Route path="/store/success" element={<StoreSuccess />} />
            
            {/* Default Route */}
            <Route path="/" element={<ClientLogin />} />
          </Routes>
        </Router>
      </StoreProvider>
    </AuthProvider>
  )
}

export default App