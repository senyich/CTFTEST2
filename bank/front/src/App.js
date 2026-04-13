import './App.css';
import { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Cookies from 'js-cookie';
import {ThemeProvider} from '@mui/material/styles';
import '@fontsource/vt323';

import Navbar from './component/frame/Navbar';
import HomePage from './component/page/HomePage';
import ProductPage from './component/page/ProductPage';
import ProfilePage from './component/page/ProfilePage';
import AuthPage from './component/page/AuthPage';
import RegisterPage from './component/page/RegisterPage';
import useTheme from "./Theme"
import CustomWebSocket from './socket';
import { getUser } from './requests';


function App() {
  const [authorized, setAuthorized] = useState(
    Cookies.get('jwt') !== undefined
  );
  
  const [products, setProducts] = useState([]);
  const [userData, setUserData] = useState({});

  const socketRef = useRef(null);

  const HOME = "/";
  const PROFILE = "/profile/";
  const PRODUCT = "/product/";
  const LOGIN = "/login/";
  const REGISTER = "/register/";

  useEffect(() => {
    if (!authorized || socketRef.current) return;

    socketRef.current = new CustomWebSocket({
      uid: userData.id,
      onOpenHandler: () => {
        if (!userData.id)
          getUser({handler: (data) => {
            setUserData(data);
            socketRef.current.id = data.id;
            socketRef.current.sendMessage()
          }});
        else socketRef.current.sendMessage();
      },
      onMessageHandler: (data) => {
        switch(data.type) {
          case 'update':
            socketRef.current.sendMessage(data.pid);
            break;
          case 'user':
            setUserData(data.message);
            break;
          case 'products':
            setProducts(data.message);
            break;
          case 'product':
            setProducts(products => products.map(product =>
              product.id === data.message.id ? data.message : product
            ));
            break;
          default:
            console.log(data.message);
            break;
        };
      }
    });
  }, [userData, authorized]);


  const appContent = authorized ? (
    <Router className="AppFrame">
      <Navbar
        HOME={HOME}
        PROFILE={PROFILE}
        PRODUCT={PRODUCT}
        balance={userData.balance}
      />
      <Routes>
          <Route exact path={HOME} element={
            <HomePage 
              products={products}
              userData={userData}
            />
            }/>
          <Route exact path={PROFILE} element={
            <ProfilePage 
              products={products}
              userData={userData}
            />
          }/>
          <Route exact path={PRODUCT} element={<ProductPage/>}/>
          <Route exact path="*" element={<Navigate to={HOME} replace/>}/>
      </Routes>
    </Router>
  ) : (
    <Router className="AppFrame">
      <Routes>
        <Route exact path={LOGIN} element={
          <AuthPage 
            setAuthorized={setAuthorized}
            REGISTER={REGISTER}
          />
          }/>
        <Route exact path={REGISTER} element={<RegisterPage LOGIN={LOGIN}/>}/>
        <Route exact path="*" element={<Navigate to={LOGIN} replace/>}/>
      </Routes>
    </Router>
  )

  return (
    <div className="App">
      <ThemeProvider theme={useTheme()}>
        {appContent}
      </ThemeProvider>
    </div>
  );
}

export default App;
