import { db } from "../firebase"
import { useAux } from "../context/auxContext"
import { useNavigate } from "react-router"
import { useEffect, useLayoutEffect, useState } from "react"
import { getDoc, doc } from "firebase/firestore"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCreditCard } from "@fortawesome/free-regular-svg-icons"
import { faMobileAlt } from "@fortawesome/free-solid-svg-icons"
import Flyer from '../components/Flyer';
import CheckoutFlyer from "./CheckoutFlyer"
const Gateway = () => {
  const initialValues = {
    webImage: '',
  }
  const navigate = useNavigate()
  const {
    useId,
    setId,
    usePayload,
    useMinutes,
    setMinutes,
    useSeconds,
    setSeconds, } = useAux()
  const [useEvent, setEvent] = useState(initialValues)
  const [ useResponse, setResponse ] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
    if (useId === '') navigate('/404')

    if(!useId.descuento) {
      setId({...useId, descuento: {
        descuentoCheck: false
      }})
    }
    const fullEvent = async () => {
      console.log(useId, usePayload, 'a')
      const task = await getDoc(doc(db, 'Eventos', useId.evento))
      console.log(task.data())
      setEvent(task.data())
    }
    if (useId) fullEvent()
    console.log(usePayload)
  }, [usePayload])

  useEffect(() => {
    let sampleInterval = setInterval(() => {
      if (Number(useSeconds) > 0) {
        const newNumber = Number(useSeconds) - 1
        setSeconds(newNumber);
      }
      if (Number(useSeconds) === 0) {
        if (useMinutes === 0) {
          clearInterval(sampleInterval);
        } else {
          setMinutes(useMinutes - 1);
          setSeconds(59);
        }
      }
    }, 1000);

    if (!useMinutes && !useSeconds) {
      navigate('/')
    }
    return () => {
      clearInterval(sampleInterval);
    };

  }, [useMinutes, useSeconds]);
  useEffect(() => {
    if(document.getElementById('autosubmit')) document.getElementById('autosubmit').submit()
    return
  }, [useResponse])
  const PUBLICO = {
    '+12': 'Mayores de 12 años',
    '+14': 'Mayores de 14 años',
    '+16': 'Mayores de 16 años',
    '+18': 'Mayores de 18 años',
    '+21': 'Mayores de 21 años',
    '+25': 'Mayores de 25 años',
    'MenoresAcomp': 'Menores Acompañados',
    'Otros': 'Otros',
    'ATP': 'Todos los públicos'
  }

  const convertUnix = (unix) => {
    const Days = ['Doming', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const date = unix ? new Date(unix * 1000) : new Date()
    const stringDate = date.toISOString().split('T')[0]
    const arrDate = stringDate.split('-')
    const day = date.getDay()
    return {
      day: Days[day],
      date: arrDate[2] + '/' + arrDate[1] + '/' + arrDate[0]
    }
  }

  const convertedDate = useEvent.unixDateStart !== '' ? convertUnix(useEvent.unixDateStart) : ''
  const uriRedsys = 'https://dentraliaserver.herokuapp.com/api/v1'//'https://sis-t.redsys.es:25443/sis/realizarPago'
  const uriRedsysBizum = 'https://dentraliaserver.herokuapp.com/api/v1/bizum'//'https://sis-t.redsys.es:25443/sis/realizarPago'
  const handleSubmit = async (e) => {
    e.preventDefault() 
    if (useId.descuento.descuentoCheck) {
      usePayload.totalPrice = usePayload.totalPrice - useId.descuento.descuentoPrice
    }
    const getResponse = await fetch('https://dentraliaserver.herokuapp.com/api/v1', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({usePayload})
    })
    const responseJSON = await getResponse.json()
    console.log(responseJSON)
    setResponse(responseJSON.response)
  }
  // console.log(evento)
  return (
    <>
      <CheckoutFlyer />
      <div className='contenedor'>
        <p className="timerEvent">
          0{Number(useMinutes)}:{Number(useSeconds) < 10 ? `0${Number(useSeconds)}` : Number(useSeconds)}
        </p>
        <div className="container gridDisplay">
          <section className="ticketResume">
            <h1 className="eventTittle">
              <strong>
                {useEvent.name !== '' ? useEvent.name : ''}
              </strong>
            </h1>
            <h6 className="eventSubtittle">{useEvent.name !== '' ? convertedDate.day + ' ' + convertedDate.date + ' @ ' + useEvent.recintoName + ' en ' + useEvent.province + ' (' + PUBLICO[useEvent.publico] + ')' : ''}</h6>
            <h6 className="eventDetailed"><b>VAS A REALIZAR UN PAGO POR IMPORTE DE <strong className="ticketData">"{useId.descuento 
              ? Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(usePayload.totalPrice - useId.descuento.descuentoPrice) 
              : Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(usePayload.totalPrice) }"</strong> CORRESPONDIENTE AL EVENTO DEL DÍA <strong className="ticketData">"{convertedDate.date}"</strong> EN <strong className="ticketData">{useEvent.recintoName}</strong>. PARA TU(S) <strong className="ticketData">"{usePayload.quantity}"</strong> ENTRADA(S) <strong className="ticketData">"
              {
                usePayload ? usePayload.carrito.map(ticket => ticket.zona) : ''
              }"</strong></b></h6>
            <span className="ticketTittle">LOS DATOS ASOCIADOS A LA(S) ENTRADA(S) SON:</span>
            <ul className="ticketData">
              <li>Nombre y apellidos: {usePayload?.cliente?.fullName}</li>
              <li>DNI: {usePayload?.cliente?.dni}</li>
              <li>Tel&eacute;fono: {usePayload?.cliente?.tel}</li>
              <li>Cantidad: {usePayload?.quantity}</li>
              <li>Precio unitario: {Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(usePayload?.unitPrice)}</li>
              <li>Precio total: {useId.descuento.descuentoCheck 
              ? Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(usePayload.totalPrice - useId.descuento.descuentoPrice) 
              : Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(usePayload?.totalPrice) }</li>
            </ul>

            <b>TU(S) ASIENTO(S) SELECCIONADO(S) SON:</b>
            <ul className="ticketsList">
              {usePayload ? usePayload?.carrito.map((ticket) => {
                return (<li key={ticket.dbstring}>{ticket.seatInfo}</li>)
              }) : ''}
            </ul>

            <article className="GDGDeclaration">
              En el importe a pagar se incluyen los gastos de gesti&oacute;n
            </article>

            {/* <div className="normativaAnchor">
              Realizando la compra aceptas la <a href="/">normativa referente al Covid-19</a>
            </div> */}
            <div className="d-flex mb-2">
              <form className="mx-2" action={uriRedsys} method="POST" onSubmit={handleSubmit}>
                <input type="hidden" name="payload" value={JSON.stringify(usePayload)}></input>
                <button className="btn btn-primary btn-lg mb-xlg btnPagar"><FontAwesomeIcon icon={faCreditCard} className="faCreditCard" />Pagar con tarjeta ({useId.descuento.descuentoCheck 
              ? Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(usePayload.totalPrice - useId.descuento.descuentoPrice) 
              : Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(usePayload?.totalPrice) })</button>
              </form>
              <form action={uriRedsysBizum} method="POST" onSubmit={handleSubmit}>
                <input type="hidden" name="payload" value={JSON.stringify(usePayload)}></input>
                <button className="btn btn-primary btn-lg mb-xlg btnPagar"><FontAwesomeIcon icon={faMobileAlt} className="faMobileAlt" /> Pagar con Bizum ({useId.descuento.descuentoCheck 
              ? Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(usePayload.totalPrice - useId.descuento.descuentoPrice) 
              : Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(usePayload?.totalPrice) })</button>
              </form>
            </div>
          </section>
          <section className="imageCheckout">
            <div className="col-md-5">
              <img style={{ width: "100%" }} src={useEvent.webImage ? useEvent.webImage : 'https://mgt-media.fra1.cdn.digitaloceanspaces.com/varios/festentradas-logo.png'}></img>
            </div>
          </section>
        </div>
      </div>
      {useResponse == '' ? '' : <div dangerouslySetInnerHTML={{__html: useResponse}}></div>}
    </>
  )
}

export default Gateway