# Laravel API Setup Guide for BeanStock Frontend

## Overview
This frontend is built to integrate with a Laravel REST API backend. Follow this guide to properly setup the connection.

## Environment Configuration

### 1. Create `.env.local` file
Copy the `.env.example` to `.env.local` and configure:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Change `localhost:8000` to your Laravel backend URL.

## API Endpoints Required

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get single product
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}/products` - Get products by category
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/{id}` - Update product (Admin only)
- `DELETE /api/products/{id}` - Delete product (Admin only)

### Transactions (POS)
- `POST /api/transactions` - Create transaction
- `GET /api/transactions` - Get all transactions (Admin only)
- `GET /api/transactions/{id}` - Get single transaction
- `GET /api/transactions/report` - Get transaction report (Admin only)
- `GET /api/transactions/daily-revenue` - Get daily revenue (Admin only)

## API Response Format

All endpoints should return responses in this format:

### Success Response
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": { /* actual data */ }
}
```

### List Response with Pagination
```json
{
  "status": "success",
  "data": [ /* array of items */ ],
  "pagination": {
    "total": 100,
    "per_page": 10,
    "current_page": 1,
    "last_page": 10
  }
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error message",
  "errors": { /* validation errors if any */ }
}
```

## Request/Response Examples

### Login
**Request:**
```json
POST /api/auth/login
{
  "email": "admin@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "name": "Admin",
      "email": "admin@example.com",
      "role": "admin"
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

### Get Products
**Request:**
```
GET /api/products
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "category_id": 1,
      "name": "Espresso",
      "price": 25000,
      "stock": 50,
      "image": "https://example.com/images/espresso.jpg",
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### Create Transaction
**Request:**
```json
POST /api/transactions
{
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 25000
    }
  ],
  "payment_method": "cash",
  "paid_amount": 100000
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "transaction_number": "TRX-20240101-001",
    "items": [ /* items array */ ],
    "subtotal": 50000,
    "tax": 5000,
    "total": 55000,
    "payment_method": "cash",
    "paid_amount": 100000,
    "change": 45000,
    "status": "completed",
    "created_at": "2024-01-01T10:00:00Z"
  }
}
```

## Service Files Structure

The frontend uses service files located in `/services/` folder:

### `/services/api.ts`
Base Axios configuration with interceptors for:
- Request headers with authentication token
- Response error handling
- Auto-logout on 401 Unauthorized

### `/services/auth.ts`
Authentication service with methods:
- `login(email, password)` - User login
- `logout()` - User logout
- `getCurrentUser()` - Fetch current user
- `getStoredUser()` - Get user from localStorage
- `isAuthenticated()` - Check auth status
- `hasRole(role)` - Check user role

### `/services/products.ts`
Product management service with methods:
- `getProducts()` - Fetch all products
- `getProduct(id)` - Fetch single product
- `getProductsByCategory(categoryId)` - Filter by category
- `getCategories()` - Fetch all categories
- `createProduct(data)` - Create new product
- `updateProduct(id, data)` - Update product
- `deleteProduct(id)` - Delete product

### `/services/transactions.ts`
Transaction management service with methods:
- `createTransaction(data)` - Create POS transaction
- `getTransactions(page, limit)` - Fetch transactions
- `getTransaction(id)` - Fetch single transaction
- `getTransactionsByDateRange(start, end)` - Filter by date
- `getDailyRevenue(date)` - Get daily revenue

## Usage Examples

### In Components

**Fetch products in a component:**
```typescript
import { useEffect, useState } from 'react';
import { productService } from '@/services/products';

export function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getProducts()
      .then(response => setProducts(response.data))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

**Create transaction:**
```typescript
import { transactionService } from '@/services/transactions';

async function handleCheckout(items, paymentMethod, paidAmount) {
  try {
    const response = await transactionService.createTransaction({
      items,
      payment_method: paymentMethod,
      paid_amount: paidAmount,
    });
    console.log('Transaction created:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## CORS Configuration (Laravel)

Make sure your Laravel backend allows requests from your frontend:

**`config/cors.php`:**
```php
'allowed_origins' => [
    'http://localhost:3000',
    'http://localhost:3001',
    // Add your production URL here
],
```

## Authentication Token Storage

The frontend stores JWT token in `localStorage` with key `auth_token`. Make sure your Laravel API:
1. Returns JWT token in login response
2. Validates token in requests with `Authorization: Bearer {token}` header
3. Returns 401 status for expired/invalid tokens

## Testing API Connection

Once you setup the Laravel API, test the connection:

1. Start both frontend and backend
2. Go to browser DevTools → Network tab
3. Try login in the frontend
4. Check API requests in Network tab
5. Verify responses match expected format

## Troubleshooting

### CORS Errors
- Check Laravel CORS configuration
- Ensure frontend URL is in `allowed_origins`
- Verify request headers are correct

### 401 Unauthorized
- Check if token is being sent in headers
- Verify token is valid and not expired
- Check authentication middleware in Laravel

### Network Errors
- Verify Laravel server is running
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify no firewall blocking requests

## Next Steps

1. Update `.env.local` with your Laravel API URL
2. Implement the required API endpoints in Laravel
3. Test each endpoint manually with Postman/Insomnia
4. Test frontend-backend integration
5. Handle edge cases and errors

For more details on the services, check the service files in `/services/` folder.
