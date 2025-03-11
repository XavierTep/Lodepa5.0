
import { InfoIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"


interface ProgressCircleProps {
    valor: string | number
    unidad: string
    nombre: string
    color?: "success" | "warning" | "verydangerous"
    info?: string
  }
  
  const ProgressCircle = ({ valor, unidad, nombre, color = "success", info }: ProgressCircleProps) => {
    return (
      <div className="flex flex-col items-center">
        <div
          className={`relative w-24 h-24 flex items-center justify-center rounded-full
          ${color === "success" ? "border-emerald-500" : "border-amber-500" } border-2`}
        >
          <div className="flex flex-col items-center justify-center">
            <span className="text-2xl font-semibold">{valor}</span>
            <span className="text-xs text-gray-500">{unidad}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 mt-2">
          <span className="text-sm font-medium text-gray-700">{nombre}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="h-4 w-4 text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{info || `Información sobre ${nombre}`}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    )
  }
  
  export default ProgressCircle

