import React from 'react';
import './App.css';
import './Events.css';
import NavBar from './components/pages/NavBar';
import SideBar from './components/pages/SideBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useMediaQuery } from 'react-responsive';
import Home from './components/pages/Home';
import Footer from './components/pages/Footer';
import About from './components/pages/About';
import FAQ from './components/pages/FAQ';
import Newsletter from './components/pages/Newsletter';
import Contact from './components/pages/Contact';
import MakeEvent from './components/pages/MakeEvent';
import Planos from './components/pages/Planos';
import Payment from './components/Payment';
import Gateway from './components/Gateway';
import Legal from './components/pages/Legal';
import Privacy from './components/pages/Privacy';
import NotFound from './components/pages/NotFound';
import { AuxProvider } from './context/auxContext';
import { QueryContextProvider } from './context/QueryContext';
import Flyer from './components/Flyer';
import Seguro from './components/pages/Seguro';
function App() {
  const isDesktop = useMediaQuery({
    query: '(min-width: 1000px)'
  })
  return (
    <BrowserRouter>
      <QueryContextProvider>
        <AuxProvider>
          {isDesktop ? <NavBar /> : <SideBar />}
          {/* <Flyer />
          <div className='contenedor'> */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quienes-somos" element={<About />} />
            <Route path="/crea-tu-evento" element={<MakeEvent />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/evento/:id" element={<Planos />} />
            <Route path="/misdatos/:id" element={<Payment />} />
            <Route path="/gateway/:id" element={<Gateway />} />
            <Route path="/aviso-legal" element={<Legal />} />
            <Route path="/politica-de-privacidad" element={<Privacy />} />
            <Route path="/condiciones-seguro" element={<Seguro />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          {/* </div> */}
          <Footer />
        </AuxProvider>
      </QueryContextProvider>
    </BrowserRouter>
  );
}

export default App;
