import type { Meta, StoryObj } from "@storybook/react";
import EncuestaCard from "./EncuestaCard";
import { View } from "react-native";

const meta = {
  title: "Components/EncuestaCard", // Storybook lo usa para organizar las historias
  component: EncuestaCard,
  tags: ["autodocs"], // Genera documentación automáticamente

  /* Configuración de los argumentos (props) que recibe el componente
    Sirve para decirle a cómo quiero controlar las props desde la interfaz web.
    Por ejemplo, en lugar de poner el texto a mano en el código, podemos usar un input en la interfaz web para cambiarlo.
  */
  argTypes: {
    titulo: { control: "text" }, // Control de UI para el título
    descripcion: { control: "text" }, // Control de UI para la descripción
    pago: { control: "number" }, // Control de UI para el pago
  },

  /* Decorators: Son funciones, que solo son visibles en Storybook, que envuelven a la historia.
    En este caso, con estos se envuelve cada historia con una View que tiene padding y un fondo gris.
    Esto ayuda a que todas las historias se vean igual y no tengamos que repetir el código en cada una.
  */
  decorators: [
    (Story) => (
      <View style={{ padding: 16, backgroundColor: "#f5f5f5", flex: 1 }}>
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EncuestaCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Historia 1: Caso más común
export const Default: Story = {
  args: {
    titulo: "Encuesta de Satisfacción",
    descripcion: "Evalúa nuestro servicio al cliente en menos de 5 minutos.",
    pago: 50,
  },
};

// Historia 2: Encuesta sin pago (Voluntaria) -> Probamos el caso nulo
export const SinPago: Story = {
  args: {
    titulo: "Encuesta Voluntaria",
    descripcion: "Ayúdanos a mejorar sin recibir compensación económica.",
    pago: null,
  },
};

// Historia 3: Título y descripción muy largos (Test de UI)
export const TextoLargo: Story = {
  args: {
    titulo:
      "Estudio de mercado sobre hábitos de consumo en la era digital y post-pandemia de 2024",
    descripcion:
      "Esta encuesta tiene como objetivo analizar en profundidad cómo han cambiado los patrones de compra de los usuarios después de los eventos globales recientes. Por favor, tómese su tiempo para responder con detalle.",
    pago: 1500,
  },
};

// Historia 4: Pago alto (Verificar formato)
export const PagoVIP: Story = {
  args: {
    titulo: "Encuesta Ejecutiva",
    descripcion: "Solo para directivos.",
    pago: 10000,
  },
};
