import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertTitle, AlertDescription } from './alert';
import { AlertCircle, CheckCircle2 } from "lucide-react";

const meta : Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;


export const Default: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Atención</AlertTitle>
      <AlertDescription>
        Tienes órdenes pendientes de asignar.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive" className="w-[400px]">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        No se pudo guardar la orden. Por favor, intenta nuevamente.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <CheckCircle2 className="h-4 w-4" />
      <AlertTitle>Éxito</AlertTitle>
      <AlertDescription>
        La orden ha sido asignada correctamente al costurero.
      </AlertDescription>
    </Alert>
  ),
};

export const WithoutIcon: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <AlertTitle>Información</AlertTitle>
      <AlertDescription>
        Esta es una alerta sin icono.
      </AlertDescription>
    </Alert>
  ),
};

export const DescriptionOnly: Story = {
  render: () => (
    <Alert className="w-[400px]">
      <AlertDescription>
        Mensaje simple sin título.
      </AlertDescription>
    </Alert>
  ),
};