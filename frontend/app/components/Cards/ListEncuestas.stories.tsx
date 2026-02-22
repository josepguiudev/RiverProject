import type { Meta, StoryObj } from "@storybook/react";
import ListaEncuestas, { Encuesta } from "./ListEncuestas";

/*
Storybook es capaz de leer tus comentarios de JSDoc y las interfaces de 
TypeScript automáticamente para generar la documentación visual.
La documentación se verá en una pestaña llamada Docs.

Se importa: import type { Meta, StoryObj } from '@storybook/react';
y también en este caso el componente: import ListaEncuestas from './ListaEncuestas';

meta: Le dice a StoryBook lo que documenta y cómo agruparlo.
tags['autodocs']: Importante, crea automáticamente la generación de la pestaña Docs
satisfies Meta<typeof Componente>: 
  --> typeof Components: Está para que StoryBook sepa qué tipo de componente está documentando
  --> Meta<...>: Molde que Storybook nos da para asegurar que no olvidemos ninguna configuración importante.
  --> satisfies: Es un verificador que mira si el objeto cumple con lo que Meta necesita y mantiene toda la información específica del componente.

  COSAS A TENER EN CUENTA (DOCS ADICIONAL):
  - El componente `ListaEncuestas` es "inteligente" (hace fetch de datos por su cuenta).
  - Para poder testear visualmente estados específicos (VACÍO, ERROR, MUCHOS DATOS), hemos añadido la prop `dataTest`. Permite que nosotros de forma manual podamos inyectar datos para simular diferentes comportamientos del componente. 
  - Esta prop es opcional y solo se usa en desarrollo/tests!!!
*/
const meta = {
  title: "Screens/ListaEncuestas", // Es un componente pero para la visualización la considero como una pantalla porque ocupa casi toda la pantalla.
  component: ListaEncuestas,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta<typeof ListaEncuestas>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Historia por defecto.
 * El componente no recibe props y ejecuta su lógica interna de carga de datos (fetch simulado).
 */
export const Default: Story = {};

/**
 * Historia para visualizar una lista vacía.
 * Inyectamos un array vacío a través de `dataTest` para forzar este estado sin modificar el componente.
 */
export const ListaVacia: Story = {
  args: {
    dataTest: [],
  },
};

// Datos para la simulación personalizada
const datosPrueba: Encuesta[] = [
  {
    id: 100,
    titulo: "Encuesta Premium",
    descripcion: "Esta paga mucho",
    pago: 500,
  },
  { id: 101, titulo: "Encuesta Rápida", descripcion: "Solo 1 minuto", pago: 5 },
  {
    id: 102,
    titulo: "Encuesta Sin Pago",
    descripcion: "Voluntariado",
    pago: null,
  },
];

/**
 * Historia con datos personalizados.
 * Inyectamos un set de datos específico para ver cómo renderiza diferentes tipos de encuestas.
 */
export const ConDatosPersonalizados: Story = {
  args: {
    dataTest: datosPrueba,
  },
};
