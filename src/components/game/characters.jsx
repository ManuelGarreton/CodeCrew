import React, { useEffect, useState } from 'react';
import '../../assets/styles/game/characters.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../config';

// Imágenes locales de respaldo
import ValeryHuskovic from '../../../public/images/personajes/ValeryHuskovic.png';
import KingGeorge from '../../../public/images/personajes/KingGeorge.png';
import HernyCobrera from '../../../public/images/personajes/HernyCobrera.png';
import TristianLuz from '../../../public/images/personajes/TristianLuz.png';

const localImages = {
    ValeryHuskovic,
    KingGeorge,
    HernyCobrera,
    TristianLuz,
};

function Characters() {
    const [characters, setCharacters] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${API_URL}/characters`)
            .then(response => {
                const dataWithImages = response.data.map(character => {
                    let imgSrc;
                    switch (character.nombre) {
                        case 'Valery Huskovic':
                            imgSrc = localImages.ValeryHuskovic;
                            break;
                        case 'King George Moñoz':
                            imgSrc = localImages.KingGeorge;
                            break;
                        case 'Herny Cobrera':
                            imgSrc = localImages.HernyCobrera;
                            break;
                        case 'Tristián Luz':
                            imgSrc = localImages.TristianLuz;
                            break;
                        default:
                            imgSrc = '';
                    }
                    return { ...character, imgSrc };
                });
                setCharacters(dataWithImages);
            })
            .catch(error => {
                console.error("Error fetching characters:", error);
                setCharacters([
                    {
                        imgSrc: ValeryHuskovic,
                        nombre: "Valery Huskovic",
                        descripcion: "Descripción de Valery Huskovic"
                    },
                    // Agrega los otros personajes aquí según sea necesario
                ]);
            });
    }, []);

    const handleBuscarPartida = () => {
        navigate('/seleccionar-partida');
    };

    return (
        <div className="personajes">
            <h1 className="titulo-personajes">CONOCE A LOS PERSONAJES</h1>
            <p className="subtitulo-personajes">HAZ CLICK SOBRE ELLOS PARA CONOCER SUS CARACTERÍSTICAS</p>
            <button className="buscar-partida-btn" onClick={handleBuscarPartida}>Buscar partida</button>
            <section className="personaje-grid">
                {characters.map((personaje, index) => (
                    <div key={index} className="personaje-container">
                        <div className="personaje-card">
                            <img src={personaje.imgSrc} alt={personaje.nombre} />
                            <h2>{personaje.nombre}</h2>
                            <p>{personaje.descripcion}</p>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default Characters;
