# Secure E-Commerce Application

A full-stack e-commerce application built with the MERN stack (MongoDB, Express, React, Node.js), featuring secure user authentication, role-based authorization, and product management.

## Features

- **Strong Authentication**: Secure login/register with JWT and password hashing
- **Role-Based Authorization**: Admin and user roles with appropriate permissions
- **Product Management**: CRUD operations for products (Admin only)
- **Admin Panel**: Dashboard with drag-and-drop product management
- **Data Storage**: MongoDB with Mongoose ODM
- **Responsive UI**: Mobile-friendly design with Tailwind CSS

## Installation

### Prerequisites

- Node.js (v14+)
- MongoDB Atlas account

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables in `.env` file:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRY=7d
   FRONTEND_URL=http://localhost:5173
   ```

4. Start the server:
   ```
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

## Project Structure

```
.
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Auth middleware, error handlers
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── server.js       # Entry point
├── frontend/
│   ├── public/         # Static files
│   └── src/
│       ├── components/ # React components
│       ├── context/    # Context providers
│       ├── hooks/      # Custom hooks
│       ├── pages/      # Page components
│       ├── utils/      # Utility functions
│       ├── App.jsx     # Main app component
│       └── main.jsx    # Entry point
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Authenticate user

### Users
- `GET /api/users/profile` - Get user profile (Protected)
- `PUT /api/users/profile` - Update user profile (Protected)
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders` - Get all orders (Admin only)
- `GET /api/orders/myorders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get order by ID (Protected)
- `PUT /api/orders/:id/pay` - Update order to paid (Protected)
- `PUT /api/orders/:id/deliver` - Update order to delivered (Admin only)

## Security Measures

- Password hashing with bcrypt
- JWT authentication
- Input validation with express-validator
- Protected routes with middleware
- CORS configuration
- Secure HTTP headers with helmet
- No plain-text password storage
- Role-based access control

## License

MIT 