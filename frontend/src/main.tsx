import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter,Router,Routes,Route } from 'react-router-dom';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './redux/store';
import AuthForm from "./page/login_signup"
import {Dashboard} from "./page/Dashboard"
import  PrivateRoute from "./hooks/protected"
import VideoCall from './components/videocall/interface';
import Videomain from './components/videocall/video_main';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate  persistor={persistor}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route element={< PrivateRoute/>}>
              <Route path="/dashboard" element={<Dashboard />} />
            </Route>
        <Route path="/check" element={<Videomain/>} />
      </Routes>
    </BrowserRouter>    
    </PersistGate>
    </Provider>
  </StrictMode>,
)
