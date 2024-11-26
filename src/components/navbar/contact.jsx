import React, { useState } from 'react';
import '../../assets/styles/navbar/contact.css';

function Contact() {
    const [formData, setFormData] = useState({
        email: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // ACA IRÍA UN MANEJO DE ENVIO DE INFO A LA API O ALGO ASÍ	
        console.log('Formulario enviado:', formData);
    };

    return (
        <div className='contact'>
            <section className="contact-section">
                <h1>Contáctanos</h1>
                <div className="contact-info">
                    <p><span className="icon">📞</span> +56 9 9567 3547</p>
                    <p><span className="icon">✉️</span> resistenciaDCC@gmail.com</p>
                </div>
                <form className="contact-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Correo:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    
                    <label htmlFor="message">Déjanos tus consultas y te responderemos lo antes posible:</label>
                    <textarea
                        id="message"
                        name="message"
                        rows="4"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                    
                    <button type="submit" className="btn primary">Enviar</button>
                </form>
            </section>
        </div>
    );
}

export default Contact;
