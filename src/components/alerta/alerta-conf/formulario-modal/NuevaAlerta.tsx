"use client";

import { updateCrearAlerta } from "@/actions/alerta/formAlerta";
import { ConfAlerta } from "@/actions/alerta/getAlertaConf";
import { Hospital } from "@/actions/hospital/getHospital";
import { Salas } from "@/actions/hospital/sala/getSala";
import { Clock, Home, MapPin, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";


interface ConfAlertProps {
    confAlerta: ConfAlerta;
    id_usuario: number;
    hospitales: Hospital[];
    salas: Salas[];
    refreshAlertas: () => void;  // Nueva prop para refrescar alertas
}

export default function NuevaAlerta({ id_usuario, confAlerta, hospitales, salas,refreshAlertas }: ConfAlertProps) {

    const router = useRouter();

    const [formData, setFormData] = useState({
        id: confAlerta.id,
        sala_id: confAlerta.sala_id || 0,
        n_sala: confAlerta.n_sala || "",
        hospital_id: confAlerta.hospital_id || confAlerta.referencia || 0,
        hospital: confAlerta.hospital || confAlerta.api_key_inbiot || "",
        usuario_id: id_usuario,
        hora_min: confAlerta.hora_min || 0,
        hora_max: confAlerta.hora_max || 24,
    })

    const [isOpen, setIsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [filteredSalas, setFilteredSalas] = useState<Salas[]>([])

    const modalRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLFormElement>(null)

    // Detectar si es dispositivo móvil
    useEffect(() => {
        const checkIfMobile = (): void => {
            setIsMobile(window.innerWidth < 768)
        }

        checkIfMobile()
        window.addEventListener("resize", checkIfMobile)
        return () => {
            window.removeEventListener("resize", checkIfMobile)
        }
    }, [])

    // Filtrar salas según el hospital seleccionado
    useEffect(() => {
        if (formData.hospital_id) {
            setFilteredSalas(salas.filter((sala) => sala.hospital === formData.hospital_id))
        } else {
            setFilteredSalas([])
        }
    }, [formData.hospital_id, salas])

    // Cerrar modal al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target

        if (name === "hora_min" || name === "hora_max") {
            // Convertir a número y validar rango (0-24)
            const hourValue = Number.parseInt(value, 10)

            if (isNaN(hourValue)) {
                setFormData((prev) => ({
                    ...prev,
                    [name]: 0,
                }))
            } else {
                // Limitar el valor entre 0 y 24
                const validHour = Math.min(Math.max(hourValue, 0), 24)
                setFormData((prev) => ({
                    ...prev,
                    [name]: validHour,
                }))
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: name === "hospital_id" || name === "sala_id" ? Number(value) : value,
            }))
        }

        // Limpiar error del campo
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[name]
                return newErrors
            })
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.hospital_id) {
            newErrors.hospital_id = "Selecciona un hospital"
        }

        if (!formData.sala_id) {
            newErrors.sala_id = "Selecciona una sala"
        }

        if (formData.hora_min === undefined || formData.hora_min === null) {
            newErrors.hora_min = "La hora de inicio es obligatoria"
        }

        if (formData.hora_max === undefined || formData.hora_max === null) {
            newErrors.hora_max = "La hora de fin es obligatoria"
        }

        if (formData.hora_min >= formData.hora_max) {
            newErrors.hora_max = "La hora de fin debe ser posterior a la hora de inicio"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            if (formRef.current) {
                const formData = new FormData(formRef.current)
                // Aquí llamarías a la función para actualizar la sala, por ejemplo:
                const result = await updateCrearAlerta(formData);

                if(result.ok===1){
                    setIsOpen(false)
                    toast.success(result.mensaje)
                    router.refresh();
                    refreshAlertas();
                }

            }
        } catch (error) {
            console.error("Error al guardar la alerta:", error)
            toast.error("Error al guardar la alerta. Inténtelo de nuevo.")
        }
    }

    return (
        <>
            {confAlerta.id !== 0 ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-amber-300 text-sm font-medium rounded-full text-amber-700 bg-white hover:bg-amber-50 transition-colors"
                >
                    Editar
                </button>
            ) : (
                <button
                    onClick={() => setIsOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Nueva Alerta
                </button>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
                    role="dialog"
                    aria-modal="true"
                >
                    <div
                        ref={modalRef}
                        className={`bg-white rounded-2xl shadow-xl ${isMobile ? "w-full" : "w-[450px]"} max-h-[90vh] overflow-y-auto`}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-medium text-gray-800">
                                {confAlerta.id !== 0 ? "Editar Alerta" : "Nueva Alerta"}
                            </h2>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-500 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form ref={formRef} onSubmit={handleSubmit} className="p-6">
                            <input type="hidden" name="id" value={formData.id} />
                            <input type="hidden" name="usuario_id" value={formData.usuario_id} />

                            <div className="space-y-5">
                                {/* Hospital */}
                                <div>
                                    <label htmlFor="hospital_id" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <Home className="h-4 w-4 mr-1 text-gray-400" />
                                        Hospital
                                    </label>
                                    <select
                                        id="hospital_id"
                                        name="hospital_id"
                                        value={formData.hospital_id || ""}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-2.5 border rounded-full text-sm ${errors.hospital_id ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"
                                            } focus:outline-none focus:ring-2 focus:border-transparent`}
                                    >
                                        <option value="">Selecciona un hospital</option>
                                        {hospitales.map((hospital) => (
                                            <option key={hospital.id} value={hospital.id}>
                                                {hospital.hospital}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.hospital_id && <p className="mt-1 text-sm text-red-600">{errors.hospital_id}</p>}
                                </div>

                                {/* Sala */}
                                <div>
                                    <label htmlFor="sala_id" className="flex items-center text-sm font-medium text-gray-700 mb-1">
                                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                                        Sala
                                    </label>
                                    <select
                                        id="sala_id"
                                        name="sala_id"
                                        value={formData.sala_id || ""}
                                        onChange={handleChange}
                                        disabled={!formData.hospital_id}
                                        className={`w-full px-4 py-2.5 border rounded-full text-sm ${errors.sala_id ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-blue-500"
                                            } focus:outline-none focus:ring-2 focus:border-transparent ${!formData.hospital_id ? "bg-gray-100 cursor-not-allowed" : ""
                                            }`}
                                    >
                                        <option value="">Selecciona una sala</option>
                                        {filteredSalas.map((sala) => (
                                            <option key={sala.id} value={sala.id}>
                                                {sala.n_sala}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.sala_id && <p className="mt-1 text-sm text-red-600">{errors.sala_id}</p>}
                                    {!formData.hospital_id && !errors.sala_id && (
                                        <p className="mt-1 text-sm text-gray-500">Primero selecciona un hospital</p>
                                    )}
                                </div>

                                {/* Horario */}
                                <div className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                                    <h3 className="flex items-center text-sm font-medium text-gray-700 mb-3">
                                        <Clock className="h-4 w-4 mr-1 text-gray-400" />
                                        Horario de Monitoreo (Horas)
                                    </h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Hora mínima */}
                                        <div>
                                            <label htmlFor="hora_min" className="block text-sm font-medium text-gray-700 mb-1">
                                                Desde
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    id="hora_min"
                                                    name="hora_min"
                                                    min="0"
                                                    max="24"
                                                    value={formData.hora_min}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-2 border rounded-full text-sm ${errors.hora_min
                                                            ? "border-red-500 focus:ring-red-500"
                                                            : "border-gray-200 focus:ring-blue-500"
                                                        } focus:outline-none focus:ring-2 focus:border-transparent`}
                                                />
                                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm mr-4">
                                                    h
                                                </span>
                                            </div>
                                            {errors.hora_min && <p className="mt-1 text-sm text-red-600">{errors.hora_min}</p>}
                                        </div>

                                        {/* Hora máxima */}
                                        <div>
                                            <label htmlFor="hora_max" className="block text-sm font-medium text-gray-700 mb-1">
                                                Hasta
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    id="hora_max"
                                                    name="hora_max"
                                                    min="0"
                                                    max="24"
                                                    value={formData.hora_max}
                                                    onChange={handleChange}
                                                    className={`w-full px-4 py-2 border rounded-full text-sm ${errors.hora_max
                                                            ? "border-red-500 focus:ring-red-500"
                                                            : "border-gray-200 focus:ring-blue-500"
                                                        } focus:outline-none focus:ring-2 focus:border-transparent`}
                                                />
                                                <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm mr-4">
                                                    h
                                                </span>
                                            </div>
                                            {errors.hora_max && <p className="mt-1 text-sm text-red-600">{errors.hora_max}</p>}
                                        </div>
                                    </div>
                                </div>

                                {/* Botones */}
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                                    >
                                        {confAlerta.id !== 0 ? "Actualizar" : "Guardar"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}