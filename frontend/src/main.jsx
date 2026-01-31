import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import Home  from './Home/Home.jsx'
import App from './App.jsx'
import Chat from './Chat/chat'
import Login from './Login/Login.jsx'
import Verify from './components/Verify.jsx'


const router = createBrowserRouter(createRoutesFromElements(
  <Route path='/' element={<App />}>
    <Route path='' element={<Home />} />
    <Route path='/chat' element={<Chat />} />
    <Route path='/login' element={<Login />} />
    <Route path='/verify' element={<Verify />} />
  </Route>
))

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <RouterProvider router={router} />
  </StrictMode>,
)
