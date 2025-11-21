# LE TICK E-commerce Backend API

Complete Node.js Express backend with Prisma ORM and PostgreSQL.

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── migrations/            # Database migrations
│   └── seed.js               # Sample data seeder
├── src/
│   ├── config/
│   │   ├── database.js       # Prisma client
│   │   └── env.js            # Environment config
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── order.controller.js
│   │   ├── cart.controller.js
│   │   ├── wishlist.controller.js
│   │   ├── review.controller.js
│   │   └── coupon.controller.js
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   ├── product.service.js
│   │   ├── category.service.js
│   │   ├── order.service.js
│   │   ├── cart.service.js
│   │   ├── wishlist.service.js
│   │   ├── review.service.js
│   │   └── coupon.service.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── product.routes.js
│   │   ├── category.routes.js
│   │   ├── order.routes.js
│   │   ├── cart.routes.js
│   │   ├── wishlist.routes.js
│   │   ├── review.routes.js
│   │   └── coupon.routes.js
│   ├── middleware/
│   │   ├── auth.js           # JWT authentication
│   │   ├── errorHandler.js   # Global error handler
│   │   ├── notFoundHandler.js
│   │   ├── requestLogger.js  # Request logging
│   │   ├── rateLimiter.js    # Rate limiting
│   │   └── validator.js      # Request validation
│   ├── utils/
│   │   ├── jwt.js            # JWT utilities
│   │   ├── password.js       # Password hashing
│   │   ├── slugify.js        # Slug generation
│   │   └── response.js       # Response helpers
│   └── server.js             # Entry point
├── .env.example              # Environment template
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/letick_db"
JWT_SECRET=your-secret-key-min-32-characters
PORT=3000
```

### 3. Setup Database

```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed database (optional)
npm run prisma:seed
```

### 4. Start Server

```bash
# Development
npm run dev

# Production
npm start
```

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Authentication
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login
GET    /api/auth/me            # Get current user
POST   /api/auth/logout        # Logout
```

### Users (Admin only)
```
GET    /api/users              # List all users
GET    /api/users/:id          # Get user by ID
PUT    /api/users/:id          # Update user
DELETE /api/users/:id          # Delete user
```

### Products
```
GET    /api/products           # List products
GET    /api/products/:id       # Get product
POST   /api/products           # Create (Admin)
PUT    /api/products/:id       # Update (Admin)
DELETE /api/products/:id       # Delete (Admin)
```

### Categories
```
GET    /api/categories         # List categories
GET    /api/categories/:id     # Get category
POST   /api/categories         # Create (Admin)
PUT    /api/categories/:id     # Update (Admin)
DELETE /api/categories/:id     # Delete (Admin)
```

### Orders
```
GET    /api/orders             # List user orders
GET    /api/orders/:id         # Get order
POST   /api/orders             # Create order
PUT    /api/orders/:id         # Update status (Admin)
```

### Cart
```
GET    /api/cart               # Get cart
POST   /api/cart               # Add to cart
PUT    /api/cart/:id           # Update cart item
DELETE /api/cart/:id           # Remove from cart
DELETE /api/cart               # Clear cart
```

### Wishlist
```
GET    /api/wishlist           # Get wishlist
POST   /api/wishlist           # Add to wishlist
DELETE /api/wishlist/:id       # Remove from wishlist
```

### Reviews
```
GET    /api/reviews/product/:id # Get product reviews
POST   /api/reviews             # Create review
PUT    /api/reviews/:id         # Update review
DELETE /api/reviews/:id         # Delete review
```

### Coupons (Admin)
```
GET    /api/coupons            # List coupons
POST   /api/coupons            # Create coupon
PUT    /api/coupons/:id        # Update coupon
DELETE /api/coupons/:id        # Delete coupon
POST   /api/coupons/validate   # Validate coupon
```

## 🔐 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

### Roles
- **CUSTOMER** - Regular users
- **MANAGER** - Store managers
- **ADMIN** - Full access

## 🛠️ Development

### Prisma Commands

```bash
# Generate Prisma Client
npm run prisma:generate

# Create migration
npm run prisma:migrate

# Deploy migrations (production)
npm run prisma:migrate:prod

# Open Prisma Studio
npm run prisma:studio

# Seed database
npm run prisma:seed

# Reset database
npm run prisma:reset
```

### Testing API

Use Postman, Insomnia, or curl:

```bash
# Health check
curl http://localhost:3000/health

# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123","first_name":"Test","last_name":"User"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test@123"}'
```

## 📦 Dependencies

### Production
- **express** - Web framework
- **@prisma/client** - Database ORM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - CORS middleware
- **helmet** - Security headers
- **express-validator** - Request validation
- **express-rate-limit** - Rate limiting
- **morgan** - HTTP logger
- **dotenv** - Environment variables

### Development
- **prisma** - Database toolkit
- **nodemon** - Auto-restart server

## 🔒 Security Features

- ✅ JWT authentication
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control
- ✅ Rate limiting
- ✅ CORS protection
- ✅ Helmet security headers
- ✅ Request validation
- ✅ SQL injection prevention (Prisma)
- ✅ XSS protection

## 🌍 Environment Variables

See `.env.example` for all available options.

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT (min 32 chars)

Optional:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGINS` - Allowed origins
- `BCRYPT_SALT_ROUNDS` - Bcrypt rounds (default: 10)

## 📝 Sample Data

Run seed script to populate database:

```bash
npm run prisma:seed
```

Creates:
- Admin user (admin@letick.com / Admin@123456)
- Sample categories
- Sample products
- Sample orders

## 🐛 Error Handling

All errors return consistent format:

```json
{
  "success": false,
  "message": "Error message",
  "errors": []
}
```

## 📊 Logging

Requests are logged to:
1. Console (development)
2. Database (`logs` table)

## 🚀 Deployment

### Heroku
```bash
heroku create letick-api
heroku config:set DATABASE_URL=your_db_url
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Railway
1. Connect GitHub repo
2. Add environment variables
3. Deploy

### Render
1. Create Web Service
2. Connect repo
3. Add environment variables
4. Deploy

## 📚 Additional Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Express Docs](https://expressjs.com)
- [JWT.io](https://jwt.io)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License

---

**Built with ❤️ for LE TICK E-commerce Platform**
