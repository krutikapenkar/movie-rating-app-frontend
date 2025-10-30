import React, { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Auth from './components/auth';
import { CookiesProvider } from 'react-cookie';

// export const TokenContext = createContext();

const router = createBrowserRouter([
  { path: "/", element: <Auth/>,},
  { path: "/movies", element: <App/>,}
]);

function Router(){

  const [token, setToken] = useState(null);
  return(
    <CookiesProvider value={{token, setToken}}>
      <RouterProvider router={router} />
    </CookiesProvider>
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <App /> */}
    <Router/>
  
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
