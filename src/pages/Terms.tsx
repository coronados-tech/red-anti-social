import { Link } from 'react-router-dom';
import LegalPage from '../components/LegalPage';

export default function Terms() {
  return (
    <LegalPage title="Términos y condiciones">
      <p>
        Bienvenido/a a <strong>UnaHur Anti-Social Net</strong>. Al usar esta plataforma aceptás
        estos términos. Si no estás de acuerdo, no utilices el servicio.
      </p>

      <h2 className="h5 mt-4">1. Naturaleza del servicio</h2>
      <p>
        Este sitio es un proyecto académico desarrollado por estudiantes de la Universidad
        Nacional de Hurlingham. No constituye un producto comercial ni una red social en
        producción real.
      </p>

      <h2 className="h5 mt-4">2. Registro y cuenta</h2>
      <p>
        Para usar ciertas funciones debés registrarte con datos verídicos. Sos responsable de
        mantener la confidencialidad de tu acceso. El acceso se valida con JWT contra el backend.
      </p>

      <h2 className="h5 mt-4">3. Contenido y conducta en la comunidad</h2>
      <p>
        UnaHur Anti-Social Net es una red académica. Esperamos un trato respetuoso entre
        integrantes de la UNaHur. Al usar la plataforma aceptás estas normas además de ser
        responsable de lo que publicás.
      </p>

      <h3 className="h6 mt-3">3.1 Publicaciones y comentarios</h3>
      <p>No está permitido compartir contenido que sea:</p>
      <ul>
        <li>Ilegal o que promueva actividades ilegales.</li>
        <li>Ofensivo, violento, discriminatorio o de incitación al odio.</li>
        <li>Acoso, amenazas o humillación hacia otras personas.</li>
        <li>Que vulnere derechos de terceros (privacidad, propiedad intelectual, etc.).</li>
        <li>Que contenga malware o intente engañar a otros usuarios.</li>
      </ul>

      <h3 className="h6 mt-3">3.2 Imágenes en publicaciones</h3>
      <p>
        Las fotos que subas a un post deben ser apropiadas para un entorno universitario. No
        se permiten imágenes con desnudez explícita, violencia gráfica, símbolos de odio,
        contenido discriminatorio ni material que resulte ofensivo para la comunidad.
      </p>

      <h3 className="h6 mt-3">3.3 Perfil de usuario</h3>
      <p>
        Tu nickname, nombre visible y foto de perfil también forman parte de la comunidad. Deben
        ser respetuosos y adecuados al contexto académico. En particular, no están permitidos:
      </p>
      <ul>
        <li>
          Nicknames o nombres que hagan referencia a figuras de odio, ideologías extremistas,
          crimen organizado o genocidio.
        </li>
        <li>
          Insultos, expresiones discriminatorias o burlas hacia personas o grupos por su
          identidad.
        </li>
        <li>Suplantación de identidad o uso engañoso de nombres ajenos.</li>
        <li>
          Fotos de perfil con símbolos de odio, violencia explícita, contenido sexual
          explícito u otro material ofensivo.
        </li>
      </ul>

      <h3 className="h6 mt-3">3.4 Moderación y reportes</h3>
      <p>
        El equipo de Coronados Tech puede revisar, ocultar o eliminar contenido y restringir
        cuentas que incumplan estas normas. Desde cada publicación podés usar la opción{' '}
        <strong>Reportar publicación</strong>, que abre un formulario con motivo y descripción
        del incumplimiento. Este flujo es <strong>simulado</strong>: no envía un reporte real al
        backend, pero forma parte de la experiencia de moderación del trabajo práctico.
      </p>
      <p>
        También podés comunicarte por nuestro{' '}
        <Link to="/contacto">formulario de contacto</Link> indicando el usuario o la publicación
        involucrada.
      </p>

      <h2 className="h5 mt-4">4. Propiedad intelectual</h2>
      <p>
        El diseño, código y marca del proyecto pertenecen al grupo Coronados Tech. El contenido
        generado por usuarios sigue siendo de quien lo publica, otorgando a la plataforma una
        licencia limitada para mostrarlo dentro del alcance académico del trabajo.
      </p>

      <h2 className="h5 mt-4">5. Disponibilidad</h2>
      <p>
        No garantizamos disponibilidad continua del servicio. La API y el frontend pueden
        modificarse, reiniciarse o eliminarse durante el desarrollo o la corrección del TP.
      </p>

      <h2 className="h5 mt-4">6. Limitación de responsabilidad</h2>
      <p>
        El servicio se ofrece &quot;tal cual&quot;, sin garantías. Los desarrolladores no serán
        responsables por pérdida de datos, interrupciones o uso indebido de la plataforma.
      </p>

      <h2 className="h5 mt-4">7. Modificaciones</h2>
      <p>
        Podemos actualizar estos términos en cualquier momento. Los cambios entrarán en vigor
        al publicarse en esta página.
      </p>

      <p className="text-muted small mt-4 mb-0">Última actualización: junio 2026</p>
    </LegalPage>
  );
}
