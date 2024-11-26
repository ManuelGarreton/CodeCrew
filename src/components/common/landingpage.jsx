import '../../assets/styles/common/landingpage.css';
import { useContext } from 'react'; // Asegúrate de importar useContext
import { AuthContext } from '../auth/authContext';

function LandingPage() {
  const { token } = useContext(AuthContext);

  function isNull(value) {
    return value === "null";
  }

  return (
    <div className='landing-page'>
      <div className='title'>
        <h1>Infección en San Joaquín:</h1>
        <h2>La Resistencia del DCC</h2>
      </div>
      <div className="button-container">
        {isNull(token) ? (
          <>
            <a href="/ingreso" className="btn primary">Iniciar Sesión</a>
            <a href="/registro" className="btn secondary">Crear Cuenta</a>
          </>
        ) : (
          <a href="/modo-partida" className="btn primary">Buscar Partida</a>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
