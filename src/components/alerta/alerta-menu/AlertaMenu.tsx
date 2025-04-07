"use client"

import "./Submenu.css"
import AlertaTable from "../verAlerta/AlertaTable"
import { useState } from "react"
import AlertaConf from "../alerta-conf/AlertaConf"
import { Hospital } from "@/actions/hospital/getHospital"
import { Salas } from "@/actions/hospital/sala/getSala"

interface AlertaMenuProps {
    userId: number;
    hospitales: Hospital[];
    salas: Salas[];
}

export default function AlertaMenu({ userId, hospitales, salas }: AlertaMenuProps) {
    // Definimos el array de pestañas con un identificador único

    const menuItems = [
        {
            id: 1,
            label: "Alertas",
            comp: <AlertaTable userId={userId} hospitales={hospitales} salas={salas} />,
        },
        {
            id: 2,
            label: "Gestión Alertas",
            comp: <AlertaConf userId={userId} hospitales={hospitales} salas={salas} />,
        },
    ]
    
    const [activeMenu, setActiveMenu] = useState(menuItems[0].id)

    // Buscamos el componente correspondiente al id activo
    const activeComponent = menuItems.find(item => item.id === activeMenu)?.comp || menuItems[0].comp

    return (
        <div>
            <div className="submenu-container">
                <nav className="menu">
                    {menuItems.map((item) => {
                        const isActive = activeMenu === item.id
                        return (
                            <button
                                key={item.id}
                                onClick={() => setActiveMenu(item.id)}
                                className={`menu-item ${isActive ? "active" : ""}`}
                            >
                                <span>{item.label}</span>
                            </button>
                        )
                    })}
                </nav>
            </div>
            {activeComponent}
        </div>
    )
}
