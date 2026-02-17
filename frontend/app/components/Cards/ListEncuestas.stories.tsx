import type { Meta, StoryObj } from '@storybook/react';
import ListaEncuestas from './ListaEncuestas';

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
*/
const meta = {
  title: 'Screens/ListaEncuestas',
  component: ListaEncuestas,
  tags: ['autodocs'], 
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof ListaEncuestas>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};