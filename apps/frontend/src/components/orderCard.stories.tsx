import type { Meta, StoryObj } from '@storybook/react';
import { OrderCard } from './orderCard';
import { Button } from './button';
import type { Order } from '../dtos';

const meta = {
  title: 'Components/OrderCard',
  component: OrderCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OrderCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleOrder: Order = {
    id: '1',
    clientName: 'Ana Martínez',
    status: 'pendiente',
    orderDetails: [],
    deliveryDate: '2025-01-02',
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
};

export const Pending: Story = {
  args: {
    order: sampleOrder,
  },
};

export const InProgress: Story = {
  args: {
    order: {
      ...sampleOrder,
      status: 'en-proceso',
      assignedTo: '2',
      assignedToName: 'María García',
    },
  },
};

export const Completed: Story = {
  args: {
    order: {
      ...sampleOrder,
      status: 'completada',
      assignedTo: '2',
      assignedToName: 'María García',
    },
  },
};

export const WithActions: Story = {
  args: {
    order: sampleOrder,
    actions: (
      <div className="flex gap-2">
        <Button size="sm">Asignar</Button>
        <Button size="sm" variant="outline">Ver detalles</Button>
      </div>
    ),
  },
};
