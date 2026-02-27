'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { CartItem } from '@/types';
import { Plus, Minus, Trash2 } from 'lucide-react';

interface CartItemsProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export function CartItems({ items, onUpdateQuantity, onRemoveItem }: CartItemsProps) {
  if (items.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No items in cart
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.product_id} className="p-3">
          <div className="flex gap-3">
            {item.image && (
              <div className="relative w-16 h-16 rounded overflow-hidden bg-muted">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm truncate">{item.name}</h4>
              <p className="text-xs text-muted-foreground">Rp {item.price.toLocaleString()}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                  className="h-7 w-7 p-0"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                
                <Input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => onUpdateQuantity(item.product_id, parseInt(e.target.value) || 1)}
                  className="h-7 w-12 text-center text-xs"
                  min="1"
                />
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                  className="h-7 w-7 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveItem(item.product_id)}
                  className="h-7 w-7 p-0 ml-auto text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="text-right">
              <p className="font-semibold text-sm">
                Rp {(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
