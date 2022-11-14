import * as Io from 'react-icons/io5'
import * as Ri from 'react-icons/ri'
import * as Ai from 'react-icons/ai'
import * as Gi from 'react-icons/gi'
import { Link } from 'react-router-dom'
import Flyer from '../Flyer';
import { useAux } from '../../context/auxContext'
import { useEffect } from 'react'
const MakeEvent = () => {

    const { useId, setId } = useAux()
    useEffect(() => {
        window.scrollTo(0, 0)
      })
    useEffect(() => {
        if(!useId) setId('events')
    }, [useId])

    const handleClick = (param) => setId(param)
    return (
    <>
        <Flyer />
        <div className='contenedor'>
            <div className="inside">
                <div className="Tittle">
                    <h2>Nunca fue tan fácil vender tus entradas</h2>
                </div>
                <div className="content">
                    <div>
                        <h4><Io.IoRocketOutline />Nos encargamos de todo</h4>
                        <p>No te preocupes por nada. Tan sólo cuéntanos sobre tu evento.Nosotros hacemos el resto</p>
                    </div>
                    <div>
                        <h4><Ri.RiComputerLine />Estadisticas Completas</h4>
                        <p>Accede en tiempo real a completas estadísticas de venta. Toma decisiones en el momento.</p>
                    </div>
                    <div>
                        <h4><Io.IoColorWandOutline />Como por arte de magia</h4>
                        <p>Observa como cualquier cambio se aplica en tiempo real. Gestiona subidas de precios y zonas.</p>
                    </div>
                    <div>
                        <h4><Ai.AiOutlineCreditCard />Acepta pagos online</h4>
                        <p>Aceptamos pagos de cualquier tarjeta bancaria. Sin que tengas que hacer nada, y con total seguridad.</p>
                    </div>
                    <div>
                        <h4><Gi.GiWorld />Alcance mundial</h4>
                        <p>Disponemos de un sistema multi-idioma y multi-moneda. Vende tus entradas en cualquier y para cualquier parte del mundo.</p>
                    </div>
                    <div>
                        <h4><Ri.RiLifebuoyLine />Estamos a tu servicio</h4>
                        <p>Te ayudamos en todo lo que necesites. Tan sólo escríbenos, ahí estaremos.</p>
                    </div>
                </div>
                <div className='contactUs'>
                    <div className='form-control'>
                        <h2>Escríbenos y cuéntanos tu evento</h2>
                        <Link onClick={() => handleClick('contact')} to='/contacto' className='anchor'>hola@festentradas.com</Link>
                        <Link onClick={() => handleClick('contact')} to='/contacto' className='buttonAnchor'><button className='btn btn-primary'>Contáctanos</button></Link>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}

export default MakeEvent