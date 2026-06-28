import { Link } from 'react-router-dom';
import LegalPage from '../components/LegalPage';

export default function Privacy() {
  return (
    <LegalPage title="Política de privacidad">
      <p>
        En <strong>UnaHur Anti-Social Net</strong> respetamos tu privacidad. Esta política
        describe qué datos recopilamos y cómo los usamos en el marco del Trabajo Práctico de
        CIU.
      </p>

      <h2 className="h5 mt-4">1. Datos que recopilamos</h2>
      <ul>
        <li>Datos de registro: nickname, nombre, apellido, email, fecha de nacimiento y género.</li>
        <li>Datos de uso: publicaciones, comentarios e imágenes que subas.</li>
        <li>Datos técnicos: sesión guardada en el navegador (localStorage) para mantener el login.</li>
      </ul>

      <h2 className="h5 mt-4">2. Finalidad del tratamiento</h2>
      <p>Usamos tus datos únicamente para:</p>
      <ul>
        <li>Identificarte dentro de la red social.</li>
        <li>Mostrar tu perfil y publicaciones.</li>
        <li>Permitir comentarios y creación de posts.</li>
        <li>Cumplir con los requisitos académicos del trabajo práctico.</li>
      </ul>

      <h2 className="h5 mt-4">3. Almacenamiento</h2>
      <p>
        Los datos se guardan en la base de datos del backend del proyecto y, parcialmente, en
        tu navegador (usuario logueado). No vendemos ni compartimos información con terceros
        comerciales.
      </p>

      <h2 className="h5 mt-4">4. Cookies y almacenamiento local</h2>
      <p>
        Utilizamos <code>localStorage</code> para recordar tu sesión. No usamos cookies de
        rastreo publicitario.
      </p>

      <h2 className="h5 mt-4">5. Derechos del usuario</h2>
      <p>
        Podés solicitar la corrección o eliminación de tu cuenta contactando al equipo del
        proyecto. Dado que es un entorno académico, la base puede reiniciarse durante pruebas.
      </p>

      <h2 className="h5 mt-4">6. Seguridad</h2>
      <p>
        Aplicamos medidas razonables para proteger los datos, pero este es un proyecto
        estudiantil sin certificaciones de seguridad de nivel producción.
      </p>

      <h2 className="h5 mt-4">7. Contacto</h2>
      <p>
        Para consultas sobre privacidad escribinos a{' '}
        <a href="mailto:coronados.tech@unahur.edu.ar">coronados.tech@unahur.edu.ar</a> o
        completá nuestro{' '}
        <Link to="/contacto">formulario de contacto</Link>.
      </p>

      <p className="text-muted small mt-4 mb-0">Última actualización: junio 2026</p>
    </LegalPage>
  );
}
