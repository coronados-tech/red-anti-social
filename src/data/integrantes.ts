import carlaFoto from '../assets/profile.images/carla.jpg';
import celesteFoto from '../assets/profile.images/celeste.jpeg';
import micaelaFoto from '../assets/profile.images/micaela.png';
import rafaelFoto from '../assets/profile.images/rafael.jpg';

export interface IntegranteRed {
  nombre: string;
  url: string;
}

export interface Integrante {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  aporte: string;
  foto?: string;
  fotoPosicion?: string;
  redes: IntegranteRed[];
}

const integrantesData: Integrante[] = [
  {
    id: 1,
    nombre: 'Carla Andrea',
    apellido: 'Perez',
    dni: '34.259.069',
    aporte: 'Registro, login, perfiles y sistema de seguidores.',
    foto: carlaFoto,
    fotoPosicion: 'center 18%',
    redes: [
      { nombre: 'LinkedIn', url: 'https://www.linkedin.com/in/carlaaperez/' },
      { nombre: 'GitHub', url: 'https://github.com/carlaprz' },
    ],
  },
  {
    id: 2,
    nombre: 'Malena Celeste',
    apellido: 'Fernandez Mansilla',
    dni: '34.101.003',
    aporte: 'Feed filtrable, componentes reutilizables y diseño visual.',
    foto: celesteFoto,
    redes: [{ nombre: 'GitHub', url: 'https://github.com/CelesteFernandez' }],
  },
  {
    id: 3,
    nombre: 'Micaela Natalia',
    apellido: 'Signorello',
    dni: '38.624.940',
    aporte: 'Comentarios, detalle de posts, tema claro/oscuro y contacto.',
    foto: micaelaFoto,
    redes: [
      {
        nombre: 'LinkedIn',
        url: 'https://www.linkedin.com/in/micaela-signorello-a2128a29b/',
      },
      { nombre: 'GitHub', url: 'https://github.com/MicaelaSignorello' },
    ],
  },
  {
    id: 4,
    nombre: 'Rafael Alberto',
    apellido: 'Barberi Salcedo',
    dni: '95.151.120',
    aporte: 'Cliente API, autenticación JWT y gestión de publicaciones con imágenes.',
    foto: rafaelFoto,
    redes: [
      {
        nombre: 'LinkedIn',
        url: 'https://www.linkedin.com/in/rafael-barberi-informatica/',
      },
      { nombre: 'GitHub', url: 'https://github.com/RafaelBarberiS' },
      { nombre: 'Instagram', url: 'https://www.instagram.com/raffa_beri/' },
    ],
  },
];

export const integrantes: Integrante[] = [...integrantesData].sort((a, b) =>
  a.apellido.localeCompare(b.apellido, 'es'),
);
