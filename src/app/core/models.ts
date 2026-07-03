/**
 * Tipos compartidos del contrato con vektor-backend.
 * Deben mantenerse alineados con los schemas Pydantic del backend.
 */

export interface Brand {
  text: string;
}

export interface Item {
  id: number;
  name: string;
  description: string | null;
}

export interface ItemCreate {
  name: string;
  description?: string | null;
}
