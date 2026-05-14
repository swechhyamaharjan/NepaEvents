# NepaEvents 

A full-stack event management platform — browse and book events, reserve venues, purchase tickets, and manage everything through a clean admin panel.

---

## Tech Stack

**Frontend:** React 18 + Vite, Tailwind CSS, React Router v7, Axios, Swiper, React Leaflet, Chart.js

**Backend:** Node.js + Express, MongoDB + Mongoose, JWT Auth, Stripe, Nodemailer, PDFKit, node-cron

---

## Features

- **Events** — Browse, filter, and purchase tickets with Stripe Checkout. Tickets are generated as branded PDFs with QR codes and emailed to the buyer.
- **Venues** — Search venues, check availability, and submit booking requests. Admin approves bookings before payment is processed.
- **Recommendations** — Hybrid recommendation engine combining content-based filtering (user interests/favorites) and collaborative filtering (similar users' purchases).
- **Authentication** — Email/password with JWT (httpOnly cookies), Google OAuth, and OTP-based password reset via email.
- **Notifications** — In-app notifications with a cron-scheduled last-day ticket sale reminder.
- **Admin Panel** — Manage events, venues, categories, users, and payments; view revenue dashboards with Chart.js.
- **Organizer Dashboard** — Organizers can track ticket sales and revenue per event.

---

## Project Structure

```
NepaEvents/
├── client/                  # React (Vite) frontend
│   └── src/
│       ├── App.jsx           # Router & layouts
│       ├── Context/          # Auth state (JWT + cookies)
│       ├── Middleware/       # Admin route guard
│       └── Components/
│           ├── Users/        # 18 user-facing components
│           └── Admin/        # 8 admin panel components
│
└── server/                  # Express API backend
    ├── server.js             # Entry point
    ├── controller/           # 9 controllers
    ├── models/               # 7 Mongoose models
    ├── routes/               # 10 route files
    ├── middleware/           # JWT + admin verification
    └── services/             # Recommendation engine (hybrid, content-based, collaborative)
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- A Stripe account
- A Gmail account (for Nodemailer)
- A Google Cloud project with OAuth 2.0 credentials

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/nepaevents.git
   cd nepaevents
   ```

2. **Install server dependencies**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**

   ```bash
   cd ../client
   npm install
   ```

4. **Configure environment variables** — see [Environment Variables](#environment-variables) below.

5. **Run the development servers**

   ```bash
   # In /server
   npm run dev

   # In /client
   npm run dev
   ```

   The API runs on `http://localhost:3000` and the client on `http://localhost:5173`.

---

## Environment Variables

### `server/.env`

```env
MONGO_URI=              # MongoDB connection string
JWT_SECRET=             # JWT signing secret
GOOGLE_CLIENT_ID=       # Google OAuth client ID
GOOGLE_CLIENT_SECRET=   # Google OAuth client secret
SESSION_SECRET=         # Session secret
STRIPE_SECRET_KEY=      # Stripe secret key
STRIPE_PUBLISHABLE_KEY= # Stripe publishable key
STRIPE_WEBHOOK_SECRET=  # Stripe webhook signing secret
EMAIL_USERNAME=         # Gmail address
EMAIL_PASSWORD=         # Gmail app password
```

### `client/.env`

```env
VITE_GOOGLE_CLIENT_ID=  # Google OAuth client ID
```

---

## API Overview

| Prefix | Description |
|---|---|
| `POST /register`, `POST /login` | Auth (local + Google OAuth) |
| `GET/POST /api/event` | Event CRUD, ticket purchase, favorites |
| `GET /api/event/recommendations` | Personalized event recommendations |
| `GET/POST /api/venue` | Venue CRUD, availability check, favorites |
| `POST /api/venue-bookings` | Venue booking requests + Stripe payment |
| `GET /api/notifications` | In-app notifications |
| `GET /api/admin/payment-revenue` | Admin revenue aggregation |
| `GET /api/tickets` | Ticket lookup by event or ID |
| `POST /api/contact` | Contact form email |

---

## Data Flows

### Venue Booking

1. User submits a booking request → status: `pending`
2. Admin approves the booking
3. User pays via Stripe Checkout
4. On successful payment: booking is marked paid, an Event document is auto-created, and a receipt PDF with QR code is emailed to the organizer

### Event Ticket Purchase

1. User selects ticket count (+ optional promo code) → Stripe Checkout
2. On success: a Ticket document is created, event totals are updated, a branded PDF ticket with QR code is generated and emailed to the buyer

---

## Models

| Model | Key Fields |
|---|---|
| **User** | `fullName`, `email`, `password`, `role`, `provider`, `favoriteEvents[]`, `purchasedTickets[]`, `interests[]` |
| **Event** | `title`, `date`, `price`, `image`, `venue`, `organizer`, `category`, `totalSold`, `totalRevenue` |
| **Venue** | `name`, `location`, `locationCoordinates`, `capacity`, `price`, `amenities[]`, `isBooked` |
| **VenueBooking** | `venue`, `organizer`, `eventDetails`, `status`, `paymentStatus`, `stripeSessionId` |
| **Ticket** | `event`, `user`, `quantity`, `ticketCodes[]`, `stripeSessionId` |
| **Category** | `name`, `image` |
| **Notification** | `user`, `title`, `message`, `type`, `isRead` |

---

## Known Issues

- `GET /api/users` (all users) has no authentication — admin middleware should be added
- Several admin-only routes (venue/category CRUD) are currently unauthenticated
- API base URL is hardcoded as `http://localhost:3000` throughout the client — should be moved to `VITE_API_URL`
- `isLoggedIn` state in `Event.jsx` and `BookVenue.jsx` is never updated, preventing favorites from loading

---

## License

MIT
