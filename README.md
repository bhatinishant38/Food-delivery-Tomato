# Food Delivery Platform

A full-stack food ordering application built as a small monorepo with a customer-facing React app, an administration dashboard, and an Express/MongoDB API.

## Features

- Browse food items by category
- Add and remove items from a cart
- Register and sign in with JWT authentication
- Submit delivery details and pay through Stripe Checkout
- View previous orders and order status
- Admin dashboard for adding, listing, and removing food items
- Admin order management with status updates
- Uploaded food images served by the API

## Project Structure

```text
food-delivery/
├── admin/       # React + Vite administration dashboard
├── backend/     # Express API, MongoDB models, authentication, uploads
├── frontend/    # React + Vite customer application
└── README.md
```

## Technology Stack

- **Frontend:** React 19, React Router, Axios, Vite
- **Admin:** React 19, React Router, Axios, React Toastify, Vite
- **Backend:** Node.js, Express, Mongoose, JWT, bcryptjs, Multer, Stripe
- **Database:** MongoDB
- **Payments:** Stripe Checkout

## Prerequisites

Install the following before starting:

- Node.js 18 or newer
- npm
- A MongoDB database
- A Stripe account and secret key for checkout

## Configuration

The backend reads these variables from `backend/.env`:

```env
JWT_SECRET=replace-with-a-long-random-secret
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

The current MongoDB connection string is defined directly in `backend/config/db.js`. Before using this project, replace it with your own MongoDB connection string and remove any exposed credentials from source control. A production deployment should move the MongoDB URI into an environment variable as well.

The frontend and admin app currently use the API at `http://localhost:5009`:

- `frontend/src/context/storeContext.jsx`
- `admin/src/App.jsx`

Keep the backend on port `5009` unless you update those URLs. Stripe redirects back to the frontend at `http://localhost:5173`.

## Installation

Install dependencies separately for each application:

```bash
cd backend
npm install

cd ../frontend
npm install

cd ../admin
npm install
```

## Running Locally

Start the backend first:

```bash
cd backend
npm start
```

In a second terminal, start the customer application:

```bash
cd frontend
npm run dev
```

In a third terminal, start the admin dashboard:

```bash
cd admin
npm run dev
```

Open these URLs in your browser:

- Customer app: http://localhost:5173
- Admin dashboard: http://localhost:5174
- API health check: http://localhost:5009/

The backend uses Nodemon, so it restarts automatically when server files change. The Vite applications support hot module replacement.

## API Routes

All API routes are served from `http://localhost:5009`.

### Food

| Method | Endpoint           | Description                                |
| ------ | ------------------ | ------------------------------------------ |
| `POST` | `/api/food/add`    | Add a food item with an `image` upload     |
| `GET`  | `/api/food/list`   | List all food items                        |
| `POST` | `/api/food/remove` | Remove a food item using `{ "id": "..." }` |

### Users

| Method | Endpoint             | Description               |
| ------ | -------------------- | ------------------------- |
| `POST` | `/api/user/register` | Register a user           |
| `POST` | `/api/user/login`    | Sign in and receive a JWT |

### Cart

Cart endpoints require the JWT in the `token` request header.

| Method | Endpoint           | Description                                 |
| ------ | ------------------ | ------------------------------------------- |
| `POST` | `/api/cart/add`    | Add one item using `{ "itemId": "..." }`    |
| `POST` | `/api/cart/remove` | Remove one item using `{ "itemId": "..." }` |
| `POST` | `/api/cart/fetch`  | Fetch the signed-in user's cart             |

### Orders

User order endpoints require the JWT in the `token` request header.

| Method | Endpoint                | Description                                 |
| ------ | ----------------------- | ------------------------------------------- |
| `POST` | `/api/order/place`      | Create an order and Stripe Checkout session |
| `POST` | `/api/order/verify`     | Verify or delete an order after payment     |
| `POST` | `/api/order/userorders` | List the signed-in user's orders            |
| `GET`  | `/api/order/list`       | List all orders for the admin dashboard     |
| `POST` | `/api/order/status`     | Update an order status                      |

Uploaded images are available at `/images/<filename>`.

## Available Scripts

Run these commands inside the relevant directory.

### Frontend and Admin

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build
npm run lint     # Run Oxlint
npm run preview  # Preview a production build
```

### Backend

```bash
npm start        # Start the API with Nodemon
```

The backend does not currently include automated tests.

## Typical Development Flow

1. Start MongoDB access and configure `backend/.env`.
2. Start the backend on port `5009`.
3. Open the admin dashboard and add food items with images.
4. Open the customer app, register or sign in, and add food to the cart.
5. Complete checkout through Stripe test mode.
6. Use the admin dashboard to update order status.

## Security Notes

- Never commit real MongoDB, JWT, or Stripe credentials.
- Use Stripe test keys during local development.
- Restrict CORS and add authorization for admin-only routes before production deployment; the current admin food and order routes are publicly callable by the API.
- Validate uploaded files and request payloads before exposing the application publicly.
