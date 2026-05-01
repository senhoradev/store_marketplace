import { useState } from 'react';
import { LoginPage } from './pages/login-page';
import { RegisterPage } from './pages/register-page';
import Home from "./pages/home-page";
import {Routes, Route} from "react-router";



type Page = 'login' | 'register';

export default function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<LoginPage/>} />
    </Routes>
  );
}