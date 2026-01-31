import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Home from './Home/Home.jsx'
import App from './App.jsx'
import Chat from './Chat/chat'
import Login from './Login/Login.jsx'
import Register from './components/Register.jsx'
import Profile from './Profile/Profile.jsx'
import UserProfile from './components/UserProfile.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'

const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App />}>
    <Route path='' element={<Home />} />
    <Route path='/chat' element={<Chat />} />
    <Route path='/login' element={<Login />} />
    <Route path='/register' element={<Register />} />
    
    {/* Protected Routes */}
    <Route path='/profile' element={
      <PrivateRoute>
        <Profile />
      </PrivateRoute>
    } />
    <Route path='/child-health' element={
      <PrivateRoute>
        <UserProfile />
      </PrivateRoute>
    } />
  </Route>
))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)