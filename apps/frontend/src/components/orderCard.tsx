import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import type { Order, OrderStatus } from '../dtos';
import { Calendar, User } from 'lucide-react';

interface OrderCardProps {
  order: Order;
  actions?: React.ReactNode;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  'pendiente': {
    label: 'Pendiente',
    className: 'bg-status-pending text-status-pending-foreground'
  },
  'en-proceso': {
    label: 'En Proceso',
    className: 'bg-status-in-progress text-status-in-progress-foreground'
  },
  'completada': {
    label: 'Completada',
    className: 'bg-status-completed text-status-completed-foreground'
  }
};

export const OrderCard = ({ order, actions }: OrderCardProps) => {
  const status = statusConfig[order.status];
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle>{order.clientName}</CardTitle>
            <CardDescription className="line-clamp-2">
              {order.orderDetails.map((detail, index) => (
                <div key={`${detail.id}-${index}`}>
                  {detail.quantity}x {detail.name}
                </div>
              ))}
            </CardDescription>
          </div>
          <Badge className={status.className}>
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Entrega: {new Date(order.deliveryDate).toLocaleDateString('es-ES')}</span>
        </div>
        
        {order.assignedToName && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Asignado a: {order.assignedToName}</span>
          </div>
        )}
        
        {actions && <div className="pt-2">{actions}</div>}
      </CardContent>
    </Card>
  );
};
