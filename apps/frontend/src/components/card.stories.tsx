import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "./card";
import { Button } from './button';
import { Badge } from "./badge";

const meta: Meta<typeof Card> = {
    title: 'Components/Card',
    component: Card,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the card content area.</p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Orden #1234</CardTitle>
        <CardDescription>Cliente: María González</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm">Order Detail</p>
        <p className="text-sm text-muted-foreground mt-2">Fecha de entrega: 25/11/2025</p>
      </CardContent>
      <CardFooter className="justify-between">
        <Badge variant="secondary">En Proceso</Badge>
        <Button size="sm">Ver Detalles</Button>
      </CardFooter>
    </Card>
  ),
};

export const Simple: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p>A simple card with just content.</p>
      </CardContent>
    </Card>
  ),
};

export const HeaderOnly: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Dashboard</CardTitle>
        <CardDescription>Resumen de actividad</CardDescription>
      </CardHeader>
    </Card>
  ),
};
