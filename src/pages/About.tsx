import PageContainer from '../components/PageContainer';
import { integrantes, type Integrante } from '../data/integrantes';

const BENEFICIOS = [
  {
    titulo: 'Comentarios con antigüedad',
    texto: 'Solo se muestran comentarios que cumplen el filtro por meses, al estilo anti-social.',
  },
  {
    titulo: 'Feed filtrable',
    texto: 'Buscá publicaciones por texto, etiquetas, fechas o usuario sin perder el contexto.',
  },
  {
    titulo: 'Perfiles y seguimiento',
    texto: 'Explorá perfiles públicos, seguí a otros usuarios y gestioná tu red académica.',
  },
  {
    titulo: 'Stack full stack',
    texto: 'Frontend en React + TypeScript conectado a nuestra API de Estrategia de Persistencia.',
  },
];

function getInitials(integrante: Integrante) {
  return `${integrante.nombre.charAt(0)}${integrante.apellido.charAt(0)}`.toUpperCase();
}

function CardIntegrante({ integrante }: { integrante: Integrante }) {
  return (
    <article className="about-team-card" aria-labelledby={`integrante-${integrante.id}`}>
      <div className="about-team-card-header">
        <div className="about-team-avatar">
          {integrante.foto ? (
            <img
              src={integrante.foto}
              alt={`${integrante.nombre} ${integrante.apellido}`}
              style={{ objectPosition: integrante.fotoPosicion ?? 'center center' }}
            />
          ) : (
            <span className="about-team-avatar-initials" aria-hidden="true">
              {getInitials(integrante)}
            </span>
          )}
        </div>

        <div className="about-team-info">
          <h3 className="about-team-name" id={`integrante-${integrante.id}`}>
            {integrante.nombre} {integrante.apellido}
          </h3>
          <p className="about-team-dni">DNI {integrante.dni}</p>
          <p className="about-team-aporte">{integrante.aporte}</p>
        </div>
      </div>

      {integrante.redes.length > 0 && (
        <div className="about-team-socials">
          {integrante.redes.map((red) => (
            <a
              key={red.nombre}
              href={red.url}
              target="_blank"
              rel="noopener noreferrer"
              className="about-team-social-link"
            >
              {red.nombre}
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

export default function About() {
  return (
    <PageContainer fill className="about-page">
      <header className="about-hero">
        <h1 className="about-hero-title">Sobre UnaHur Anti-Social Net</h1>
        <p className="about-hero-text">
          Somos el grupo <strong>Coronados Tech</strong>. Desarrollamos esta red social académica en
          React + TypeScript para la materia CIU, conectada a nuestra API de Estrategia de
          Persistencia.
        </p>
      </header>

      <div className="about-grid">
        <div className="about-main">
          <section className="about-section about-pillars" aria-labelledby="about-pillars-title">
            <h2 className="about-section-title" id="about-pillars-title">
              Propósito
            </h2>
            <div className="about-pillars-cards">
              <div className="about-pillar-card">
                <span className="about-pillar-label">Misión</span>
                <p className="about-pillar-text mb-0">
                  Crear una plataforma donde compartir lo mínimo indispensable y leer interacciones
                  filtradas por antigüedad, demostrando buenas prácticas de interfaces y persistencia
                  de datos.
                </p>
              </div>
              <div className="about-pillar-card">
                <span className="about-pillar-label">Visión</span>
                <p className="about-pillar-text mb-0">
                  Entregar un trabajo integrador que combine frontend moderno, autenticación segura y
                  una experiencia coherente para la comunidad académica de la UNaHur.
                </p>
              </div>
            </div>
          </section>

          <section className="about-section about-team" aria-labelledby="about-team-title">
            <h2 className="about-section-title" id="about-team-title">
              Equipo
            </h2>
            <p className="about-section-subtitle">Las personas detrás de Anti-Social Net.</p>
            <div className="about-team-grid">
              {integrantes.map((integrante) => (
                <CardIntegrante key={integrante.id} integrante={integrante} />
              ))}
            </div>
          </section>
        </div>

        <section className="about-section about-benefits" aria-labelledby="about-benefits-title">
          <h2 className="about-section-title" id="about-benefits-title">
            ¿Qué ofrece la plataforma?
          </h2>
          <p className="about-section-subtitle">
            Funcionalidades clave del proyecto para la materia CIU.
          </p>
          <div className="about-benefits-list">
            {BENEFICIOS.map((beneficio) => (
              <div key={beneficio.titulo} className="about-benefit-item">
                <h3 className="about-benefit-title">{beneficio.titulo}</h3>
                <p className="about-benefit-text mb-0">{beneficio.texto}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageContainer>
  );
}
