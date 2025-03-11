'use client';

import Indicadores from '../Indicadores/Indicadores';
import '../SubMenu/Submenu.css';
import Parametros from '../parametros/Parametros';
// import Grafica from '../grafica/Grafica';
import { Suspense, useState } from 'react';

interface SubmenuProps {
  id: string;
}

const items = [
  { name: 'Parámetros', path: 'parametros' },
  { name: 'Indicadores', path: 'indicadores' },
  // { name: 'Gráfica', path: 'grafica' },
];

const Submenu: React.FC<SubmenuProps> = ({ id }) => {
  const handleConstruccion = () => {
    alert("En construcción");
  };

  const [tag, setTag] = useState('parametros');

  const handleClick = (tag: string) => {
    setTag(tag);
    console.log('Tag seleccionado:', tag);
    console.log('ID recibido:', id);
  };
  const DefaultComponent = () => <h2>Selecciona una opción</h2>;
  // Selecciona el componente a renderizar según el tag seleccionado
  let ComponentToRender;
  if (tag === 'parametros') ComponentToRender = Parametros;
  else if (tag === 'indicadores') ComponentToRender = Indicadores;
  // else if (tag === 'grafica') ComponentToRender = Grafica;

  else ComponentToRender = DefaultComponent;

  return (
    <div>
      {/* Menú de navegación */}
      <div className="menu">
        {items.map((item) => (
          <button
            key={item.path}
            className={`menu-item ${item.path === tag ? 'active' : ''}`}
            onClick={() => handleClick(item.path)}
          >
            {item.name}
          </button>
        ))}
        <button className="menu-item" onClick={handleConstruccion}>
          Grafica
        </button>
      </div>

      {/* Renderiza el componente correspondiente pasando el id */}
      <Suspense fallback={<div>Cargando...</div>}>
        <ComponentToRender id={id} />
      </Suspense>
    </div>
  );
};

export default Submenu;
