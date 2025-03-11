import { useEffect, useState } from "react";
import { InfoIcon, Fan, WormIcon, Thermometer } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface IndicadorProps {
  titulo: string;
  valor: number;
  icono?: React.ReactNode;
  info?: string;
}

const Indicador = ({ titulo, valor, icono, info }: IndicadorProps) => {
  const circumference = 2 * Math.PI * 40; // radio = 40
  const strokeDashoffset = circumference - (valor / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 relative">
      <div className="absolute top-4 right-4 flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <InfoIcon className="h-5 w-5 text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{info || `Información sobre ${titulo}`}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {icono && <div className="text-gray-400">{icono}</div>}
      </div>

      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="40" stroke="#E5E7EB" strokeWidth="8" fill="none" />
            <circle
              cx="64"
              cy="64"
              r="40"
              stroke="#10B981"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
                transition: "stroke-dashoffset 0.5s ease",
              }}
            />
          </svg>
          <span className="absolute text-4xl font-semibold">{valor}</span>
        </div>
        <h3 className="mt-4 text-gray-600 text-center">{titulo}</h3>
      </div>
    </div>
  );
};

interface IndicadoresProps {
  id?: string;
}

//const API_URL = process.env.REACT_APP_API_URL;

const Indicadores: React.FC<IndicadoresProps> = ({ id}) => {
  const [indicadores, setIndicadores] = useState([
    {
      key: "iaq",
      titulo: "Calidad de Aire Interior",
      valor: 100,
      info: "Índice de calidad del aire interior",
    },
    {
      key: "covid19",
      titulo: "Resistencia a Virus",
      valor: 74,
      icono: <WormIcon className="h-5 w-5" />,
      info: "Capacidad de resistencia contra virus en el ambiente",
    },
    {
      key: "ventilationIndicator",
      titulo: "Eficacia de Ventilación",
      valor: 85,
      icono: <Fan className="h-5 w-5" />,
      info: "Eficiencia del sistema de ventilación",
    },
    {
      key: "thermalIndicator",
      titulo: "Confort Térmico",
      valor: 100,
      icono: <Thermometer className="h-5 w-5" />,
      info: "Nivel de confort térmico en el ambiente",
    },
  ]);

  const [loading, setLoading] = useState(true);
  const [updateTime, setUpdateTime] = useState<string | null>(null);
  //const API_URL = import.meta.env.VITE_RUTA_API;
  useEffect(() => {
    if (!id) return;

    const fetchIndicadores = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/registro/get/${id}/last`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Error en la respuesta del servidor");

        const data = await response.json();

        // **Tomar el último registro del array
        const ultimoRegistro = data.at(-1);

        // Convertir updateTime en formato de fecha legible
        if (ultimoRegistro.updateTime && Array.isArray(ultimoRegistro.updateTime)) {
          const [year, month, day, hours, minutes, seconds] = ultimoRegistro.updateTime;
          setUpdateTime(new Date(year, month - 1, day, hours, minutes, seconds).toLocaleString());
        }

        // **Actualizar solo los valores sin modificar la estructura original**
        setIndicadores((prevIndicadores) =>
          prevIndicadores.map((indicador) => ({
            ...indicador,
            valor: ultimoRegistro[indicador.key] ?? indicador.valor,
          }))
        );
      } catch (error) {
        console.error("Error obteniendo los indicadores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIndicadores();
  }, [id]);

  return (
    <div className="bg-white rounded-lg">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
        {loading ? (
          <p className="text-center text-gray-500">Cargando datos...</p>
        ) : (
          indicadores.map((indicador, index) => (
            <Indicador
              key={index}
              titulo={indicador.titulo}
              valor={indicador.valor}
              icono={indicador.icono}
              info={indicador.info}
            />
          ))
        )}
      </div>
      <div className="flex justify-end p-6 pt-0">
        <span className="text-sm text-gray-500">
          Última actualización: {updateTime ? updateTime : "No disponible"}
        </span>
      </div>
    </div>
  );
};

export default Indicadores;
