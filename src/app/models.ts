
export interface Comida {
    nombre_pla: string;
    precio_pla: number;
    descrp_pla: string;
    ubicacion: string;
    foto: string;
    id: string;
    fecha: Date;
}

export interface IGenericAddress {
    casa?: string;
    codigo_postal?: string;
    calle?: string;
    region?: string;
    ciudad?: string;
    Pais?: string
    lat?: number;
    lng?: number;
    direccion_formateda?: string;
}

export interface IGenericUser {
    nombre?: string;
    email?: string;
    password?: string;
    id?: string;
}