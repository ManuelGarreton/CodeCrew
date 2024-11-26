import '../../assets/styles/navbar/instructions.css';
import { useNavigate } from 'react-router-dom';

function Instructions() {
    const navigate = useNavigate();

    const handleNavigateToCharacters = () => {
        navigate('/personajes-vista');
    };

    return (
        <div className="instructions">
            <div className="instructions-section">
                <h1>Acerca De</h1>
                <p>Infección en San Joaquín: La Resistencia del DCC es un juego cooperativo de estrategia de conquista de zonas, donde de dos a cuatro jugadores asumen el rol de profesores del Departamento de Ciencia de la Computación (DCC) de la Pontificia Universidad Católica de Chile. El objetivo es combatir la infección que ha tomado control del campus de San Joaquín. Los jugadores deberán enfrentarse a jefes, superar misiones y recolectar recursos para mejorar sus habilidades y recuperar las diversas zonas del mapa. Cada logro dentro del juego será debidamente premiado y puntuado, de modo que aquel jugador que al final de la partida tenga el mejor puntaje de aura será nombrado como el “Gran Héroe de la Resistencia”.</p>
                <h1>CONOCE A LOS PERSONAJES</h1>
                <h2 className="highlighted-question">¿Quieres saber más de ellos?</h2>


                <button className="character-button" onClick={handleNavigateToCharacters}>Vamos a conocerlos</button>
            </div>
        </div>
    );
}

export default Instructions;
