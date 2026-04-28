# MoversPadi — Backend API Routes Specification

**Base URL:** `https://moverspadi.onrender.com/api`  
**Protocol:** HTTPS only  
**Format:** JSON (`Content-Type: application/json`)  
**Auth:** Bearer token in `Authorization` header — `Authorization: Bearer <token>`

> The frontend proxies all requests through `/backend/*` → `/api/*` on the Laravel backend.  
> All routes below are relative to `/api`. Prefix every path with `/api` on the server.

---

## Authentication Status

| Symbol | Meaning |
|--------|---------|
| 🔓 | Public — no token required |
| 🔐 | Authenticated — Bearer token required |
| 🛡️ | Admin only |

---

## 1. AUTH — `/auth`

### POST `/auth/signup` 🔓
Register a new user. Sends a signup OTP to the email.

**Request body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "password": "string",
  "confirmPassword": "string",
  "role": "customer | mover | provider | company"
}
```
**Response:** `204 No Content`

---

### POST `/auth/verify-otp` 🔓
Confirm the OTP sent after signup. Returns a session on success.

**Request body:**
```json
{
  "email": "string",
  "code": "string"
}
```
**Response:**
```json
{
  "user": { "id": "string", "name": "string", "email": "string", "phone": "string", "avatarUrl": "string | null" },
  "role": "customer | mover | provider | company | admin",
  "token": "string",
  "verificationStatus": "pending | approved | rejected | resubmission_required | suspended"
}
```

---

### POST `/auth/login` 🔓
Authenticate and trigger a login OTP. Supply email+password for standard login, or companyId+accessKey for company key-based login.

**Request body (standard):**
```json
{
  "email": "string",
  "password": "string",
  "role": "customer | mover | provider | company | admin"
}
```
**Request body (company key):**
```json
{
  "companyId": "string",
  "accessKey": "string",
  "role": "company"
}
```
**Response:** Same shape as `verify-otp`, or `null` if OTP is required before session is issued.

---

### POST `/auth/verify-login-otp` 🔓
Confirm the OTP sent after login.

**Request body:**
```json
{
  "email": "string",
  "code": "string"
}
```
**Response:** Same shape as `verify-otp`.

---

### POST `/auth/forgot-password` 🔓
Send a password-reset link to the given email.

**Request body:**
```json
{ "email": "string" }
```
**Response:** `204 No Content`

---

### POST `/auth/reset-password/:token` 🔓
Set a new password using the reset token from the email link.

**Path param:** `token` — the reset token from the email URL  
**Request body:**
```json
{
  "password": "string",
  "confirmPassword": "string"
}
```
**Response:** `204 No Content`

---

### POST `/auth/logout` 🔐
Invalidate the current session token server-side.

**Response:** `204 No Content`

---

## 2. PROFILE — `/profile`

### GET `/profile/me` 🔐
Fetch the authenticated user's profile.

**Response:**
```json
{
  "id": "string",
  "fullName": "string",
  "email": "string",
  "phone": "string",
  "gender": "string | null",
  "dateOfBirth": "YYYY-MM-DD | null",
  "address": "string | null",
  "city": "string | null",
  "state": "string | null",
  "country": "string | null",
  "avatarUrl": "string | null",
  "meansOfIdType": "string | null",
  "meansOfIdNumber": "string | null",
  "socialMediaLinks": { "facebook": "string", "instagram": "string", "twitter": "string" }
}
```

---

### PUT `/profile/complete` 🔐
Submit onboarding profile completion data (called once after wizard).

**Request body** (all fields optional — send only what applies to the role):
```json
{
  "role": "string",
  "gender": "string",
  "dob": "YYYY-MM-DD",
  "address": "string",
  "emergencyContact": "string",
  "nextOfKinName": "string",
  "nextOfKinPhone": "string",
  "nextOfKinRelationship": "string",
  "guarantorName": "string",
  "guarantorPhone": "string",
  "vehicleType": "motorcycle | van | truck | tow_truck | private_car | bus",
  "plateNumber": "string",
  "vehicleBrand": "string",
  "vehicleModel": "string",
  "vehicleColor": "string",
  "yearsOfExperience": "string",
  "coverageArea": "string",
  "bankName": "string",
  "accountName": "string",
  "accountNumber": "string",
  "facebookUrl": "string",
  "instagramUrl": "string",
  "twitterUrl": "string",
  "documents": { "driverLicense": true, "vehicleRegistration": true, "insurance": false }
}
```
**Response:** `204 No Content`

---

### PUT `/profile` 🔐
Update editable profile fields.

**Request body** (partial update — send only fields to change):
```json
{
  "fullName": "string",
  "phone": "string",
  "gender": "string",
  "address": "string",
  "avatarUrl": "string"
}
```
**Response:** Updated `UserProfile` object (same shape as `GET /profile/me`).

---

## 3. MOVER — `/mover`

All mover routes require a Bearer token for a user with `role = mover` or `role = provider`.

### GET `/mover/stats` 🔐
Fetch earnings and performance metrics.

**Response:**
```json
{
  "earningsToday": 14500,
  "earningsWeek": 68200,
  "earningsMonth": 241800,
  "tripsCompleted": 142,
  "rating": 4.8,
  "acceptanceRate": 94
}
```

---

### GET `/mover/trips?limit=10&page=1` 🔐
Fetch recent trip history.

**Query params:** `limit` (default 10), `page` (default 1)  
**Response:**
```json
[
  {
    "id": "string",
    "from": "string",
    "to": "string",
    "amount": 4200,
    "time": "2 hrs ago",
    "date": "Today",
    "status": "completed | cancelled | in_progress",
    "serviceType": "dispatch | haulage | tow | transport",
    "distance": "14.2 km"
  }
]
```

---

### POST `/mover/requests/:id/accept` 🔐
Accept an incoming job request.

**Path param:** `id` — the request ID  
**Request body:** `{}` (empty)  
**Response:** `204 No Content`

---

### POST `/mover/requests/:id/decline` 🔐
Decline an incoming job request.

**Path param:** `id` — the request ID  
**Request body:** `{}` (empty)  
**Response:** `204 No Content`

---

### PUT `/mover/status` 🔐
Toggle the mover's online/offline availability.

**Request body:**
```json
{ "online": true }
```
**Response:** `204 No Content`

---

### GET `/mover/wallet` 🔐
Fetch wallet balance and transaction history.

**Response:**
```json
{
  "balance": 38450,
  "pendingPayout": 12800,
  "totalEarned": 241800,
  "transactions": [
    {
      "id": "string",
      "type": "credit | debit | payout",
      "amount": 4200,
      "description": "string",
      "date": "string",
      "status": "successful | pending | failed | processing"
    }
  ]
}
```

---

### GET `/mover/earnings/breakdown` 🔐
Fetch earnings breakdown by day and service type.

**Response:**
```json
{
  "daily": [
    { "day": "Mon", "amount": 9100 }
  ],
  "byService": [
    { "service": "dispatch", "amount": 87400, "count": 58 }
  ]
}
```

---

### POST `/mover/wallet/payout` 🔐
Request a payout to the mover's registered bank account.

**Request body:**
```json
{ "amount": 25000 }
```
**Response:** `204 No Content`

---

### POST `/mover/wallet/withdraw` 🔐
Withdraw to a specified bank account (may differ from registered account).

**Request body:**
```json
{
  "bankName": "string",
  "accountNumber": "string",
  "amount": 25000
}
```
**Response:**
```json
{ "reference": "string", "status": "processing" }
```

---

### PUT `/mover/profile` 🔐
Update mover profile fields (name, phone, vehicle info).

**Request body:**
```json
{
  "name": "string",
  "phone": "string",
  "vehicle": "string"
}
```
**Response:** `204 No Content`

---

### POST `/mover/documents/:type/upload` 🔐
Upload a verification document. Multipart form data.

**Path param:** `type` — `driver_license | vehicle_registration | insurance | roadworthiness`  
**Request:** `multipart/form-data` with field `file` (PDF, JPG, PNG — max 5 MB)  
**Response:**
```json
{ "documentType": "string", "status": "under_review", "uploadedAt": "ISO8601" }
```

---

### GET `/mover/settings` 🔐
Fetch mover notification and privacy settings.

**Response:**
```json
{
  "newJobAlerts": true,
  "payoutConfirm": true,
  "appUpdates": false,
  "twoFactor": false,
  "locationSharing": true,
  "profileVisibility": true,
  "offlineByDefault": false,
  "soundAlerts": true
}
```

---

### PUT `/mover/settings` 🔐
Save mover settings.

**Request body** (send only changed keys):
```json
{
  "newJobAlerts": true,
  "twoFactor": true
}
```
**Response:** `204 No Content`

---

## 4. BOOKINGS — `/bookings`

### POST `/bookings` 🔐
Create a new service booking.

**Request body:**
```json
{
  "serviceType": "dispatch | haulage | tow | transport",
  "pickup": "string",
  "pickupCoords": { "lat": 6.5244, "lng": 3.3792 },
  "dropoff": "string",
  "dropoffCoords": { "lat": 6.4281, "lng": 3.4219 },
  "vehicleType": "motorcycle | van | truck | tow_truck | private_car | bus",
  "vehicleDescription": "string",
  "passengers": "string",
  "items": [{ "name": "string", "qty": 1, "weight": "5kg" }],
  "scheduleDate": "YYYY-MM-DD",
  "scheduleTime": "HH:MM"
}
```
**Response:**
```json
{
  "service": "string",
  "pickup": "string",
  "dropoff": "string",
  "price": 5000,
  "status": "pending"
}
```

---

### GET `/bookings/:id` 🔐
Fetch a booking by ID.

**Response:** Same shape as POST `/bookings` response.

---

### DELETE `/bookings/:id` 🔐
Cancel a booking.

**Response:** `204 No Content`

---

### GET `/bookings/quote?serviceType=dispatch&pickup=...&dropoff=...` 🔐
Get a real-time price estimate before booking.

**Query params:** `serviceType`, `pickup` (address string), `dropoff` (address string)  
**Response:**
```json
{ "estimate": 5000, "currency": "NGN", "breakdown": { "base": 3000, "distance": 1500, "surge": 500 } }
```

---

## 5. CUSTOMER — `/customer`

### GET `/customer/wallet` 🔐
Fetch customer wallet balance and transaction history.

**Response:**
```json
{
  "balance": 21850,
  "transactions": [
    {
      "id": "TRX-8821",
      "label": "Dispatch — Surulere → Lekki",
      "date": "Today, 2:14 PM",
      "amount": -3500,
      "type": "debit | credit"
    }
  ]
}
```

---

### POST `/customer/wallet/topup` 🔐
Initiate a wallet top-up.

**Request body:**
```json
{ "amount": 50000, "paymentMethod": "card | bank_transfer" }
```
**Response:**
```json
{ "reference": "string", "paymentUrl": "string | null", "status": "pending" }
```

---

### POST `/customer/wallet/transfer` 🔐
Transfer funds to another user by phone or account number.

**Request body:**
```json
{
  "recipient": "+2348001234567",
  "amount": 5000
}
```
**Response:**
```json
{ "reference": "string", "status": "successful" }
```

---

### GET `/customer/orders` 🔐
List the customer's order history.

**Query params:** `page` (default 1), `limit` (default 10)  
**Response:**
```json
[
  {
    "id": "string",
    "serviceType": "string",
    "pickup": "string",
    "dropoff": "string",
    "price": 5000,
    "status": "pending | matched | accepted | in_progress | completed | cancelled | failed",
    "createdAt": "ISO8601"
  }
]
```

---

### GET `/customer/orders/:id` 🔐
Fetch a single order with full detail including mover info.

**Response:** Same as above, plus:
```json
{
  "mover": {
    "id": "string",
    "name": "string",
    "phone": "string",
    "rating": 4.8,
    "vehicle": "string",
    "plate": "string",
    "eta": "string",
    "avatar": "string | null"
  }
}
```

---

### GET `/customer/places` 🔐
Fetch the customer's saved places.

**Response:**
```json
[
  { "id": "string", "label": "Home", "address": "14 Bode Thomas St, Surulere, Lagos" }
]
```

---

### POST `/customer/places` 🔐
Add a new saved place.

**Request body:**
```json
{ "label": "string", "address": "string" }
```
**Response:**
```json
{ "id": "string", "label": "string", "address": "string" }
```

---

### PUT `/customer/places/:id` 🔐
Update a saved place.

**Path param:** `id`  
**Request body:**
```json
{ "label": "string", "address": "string" }
```
**Response:** `204 No Content`

---

### DELETE `/customer/places/:id` 🔐
Remove a saved place.

**Response:** `204 No Content`

---

### GET `/customer/notifications` 🔐
Fetch notifications for the customer.

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "body": "string",
    "read": false,
    "type": "order_update | promo | system",
    "createdAt": "ISO8601"
  }
]
```

---

### PUT `/customer/notifications/:id/read` 🔐
Mark a notification as read.

**Response:** `204 No Content`

---

### PUT `/customer/notifications/read-all` 🔐
Mark all notifications as read.

**Response:** `204 No Content`

---

## 6. COMPANY — `/company`

All company routes require `role = company`.

### GET `/company/stats` 🔐
Fetch company performance metrics.

**Response:**
```json
{
  "revenueMonth": 4200000,
  "activeVehicles": 3,
  "totalVehicles": 5,
  "ordersMonth": 142,
  "avgRating": 4.7
}
```

---

### GET `/company/fleet` 🔐
List all company vehicles.

**Response:**
```json
[
  {
    "id": "string",
    "driver": "string",
    "plate": "string",
    "type": "motorcycle | van | truck | tow_truck | private_car | bus",
    "status": "active | idle | maintenance",
    "route": "string",
    "load": "82%"
  }
]
```

---

### POST `/company/fleet` 🔐
Add a new vehicle to the fleet.

**Request body:**
```json
{
  "plate": "string",
  "type": "van | truck | bike | bus | pickup",
  "driver": "string",
  "status": "active | idle | maintenance"
}
```
**Response:** Created `Vehicle` object with `id`.

---

### PUT `/company/fleet/:id` 🔐
Update a vehicle's details or status.

**Path param:** `id`  
**Request body** (partial):
```json
{
  "driver": "string",
  "status": "active | idle | maintenance",
  "load": "75%"
}
```
**Response:** `204 No Content`

---

### DELETE `/company/fleet/:id` 🔐
Remove a vehicle from the fleet.

**Response:** `204 No Content`

---

### GET `/company/orders?page=1` 🔐
List company shipment orders.

**Response:**
```json
[
  {
    "id": "string",
    "client": "string",
    "pickup": "string",
    "dropoff": "string",
    "value": "₦480k",
    "status": "pending | in-transit | completed | cancelled",
    "paymentStatus": "pending | successful | failed",
    "driver": "string"
  }
]
```

---

### GET `/company/drivers` 🔐
List company drivers.

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "phone": "string",
    "vehicleId": "string | null",
    "status": "active | idle | on-leave | offline"
  }
]
```

---

### POST `/company/assign` 🔐
Assign a driver to a vehicle.

**Request body:**
```json
{ "driverId": "string", "vehicleId": "string" }
```
**Response:** `204 No Content`

---

### POST `/company/drivers/invite` 🔐
Invite a driver to join the company.

**Request body:**
```json
{ "phone": "string", "name": "string" }
```
**Response:**
```json
{ "inviteId": "string", "status": "sent" }
```

---

### GET `/company/profile` 🔐
Fetch company profile details.

**Response:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "rcNumber": "string",
  "address": "string | null"
}
```

---

### PUT `/company/profile` 🔐
Update company profile.

**Request body** (partial):
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "rcNumber": "string"
}
```
**Response:** `204 No Content`

---

### PUT `/company/billing/payment-method` 🔐
Update the company's payout bank account.

**Request body:**
```json
{
  "bankName": "string",
  "accountNumber": "string"
}
```
**Response:**
```json
{ "status": "updated", "maskedAccount": "****4521" }
```

---

## 7. ADMIN — `/admin`

All admin routes require `role = admin`. 🛡️

### GET `/admin/stats` 🛡️
Platform-wide metrics.

**Response:**
```json
{
  "totalUsers": 12481,
  "activeMovers": 892,
  "ordersToday": 341,
  "platformRevenue": 4200000,
  "revenueChange": 18.4
}
```

---

### GET `/admin/users?page=1` 🛡️
List all users with pagination.

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "role": "customer | mover | provider | company | admin",
    "email": "string",
    "joined": "ISO8601",
    "status": "pending | active | suspended | rejected"
  }
]
```

---

### POST `/admin/users/:id/suspend` 🛡️
Suspend a user account.

**Path param:** `id`  
**Request body:**
```json
{ "reason": "string" }
```
**Response:** `204 No Content`

---

### POST `/admin/users/:id/activate` 🛡️
Re-activate a suspended user.

**Response:** `204 No Content`

---

### POST `/admin/users/invite` 🛡️
Invite a new admin or staff member.

**Request body:**
```json
{
  "email": "string",
  "role": "admin | mover | company | customer"
}
```
**Response:**
```json
{ "inviteId": "string", "status": "sent" }
```

---

### GET `/admin/orders?page=1` 🛡️
List all platform orders.

**Response:**
```json
[
  {
    "id": "string",
    "customer": "string",
    "mover": "string",
    "route": "string",
    "value": "string",
    "status": "pending | matched | accepted | in_progress | completed | cancelled | failed",
    "paymentStatus": "pending | successful | failed | refunded",
    "serviceType": "dispatch | haulage | tow | transport"
  }
]
```

---

### GET `/admin/verifications` 🛡️
List pending verification submissions.

**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "role": "mover | provider | company",
    "submittedAt": "ISO8601",
    "status": "pending | approved | rejected | resubmission_required"
  }
]
```

---

### POST `/admin/verifications/:id/approve` 🛡️
Approve a verification submission.

**Response:** `204 No Content`

---

### POST `/admin/verifications/:id/reject` 🛡️
Reject a verification submission.

**Request body:**
```json
{ "reason": "string" }
```
**Response:** `204 No Content`

---

### POST `/admin/verifications/:id/resubmit` 🛡️
Request resubmission of documents.

**Request body:**
```json
{ "reason": "string" }
```
**Response:** `204 No Content`

---

### GET `/admin/commission-rules` 🛡️
List commission rules per service type.

**Response:**
```json
[
  {
    "id": "string",
    "rate": 0.20,
    "serviceType": "dispatch | haulage | tow | transport",
    "active": true,
    "createdAt": "ISO8601"
  }
]
```

---

### POST `/admin/commission-rules` 🛡️
Create or update a commission rule.

**Request body:**
```json
{
  "rate": 0.12,
  "serviceType": "dispatch | haulage | tow | transport",
  "active": true
}
```
**Response:** Created `CommissionRule` object with `id`.

---

### GET `/admin/payouts?page=1` 🛡️
List all platform payouts.

**Response:**
```json
[
  {
    "id": "string",
    "recipientId": "string",
    "recipientRole": "mover | company",
    "grossAmount": 50000,
    "commissionAmount": 6000,
    "netAmount": 44000,
    "status": "pending | processing | successful | failed",
    "createdAt": "ISO8601"
  }
]
```

---

### GET `/admin/revenue?period=month` 🛡️
Revenue breakdown by period.

**Query param:** `period` = `day | week | month`  
**Response:**
```json
[
  { "period": "2026-04", "gross": 4200000, "commission": 504000, "payouts": 3696000 }
]
```

---

### GET `/admin/alerts` 🛡️
Fetch system alerts.

**Response:**
```json
[
  {
    "id": "string",
    "type": "error | warning | info | success",
    "title": "string",
    "description": "string",
    "read": false,
    "createdAt": "ISO8601"
  }
]
```

---

### PUT `/admin/alerts/:id/read` 🛡️
Mark a single alert as read.

**Response:** `204 No Content`

---

### PUT `/admin/alerts/read-all` 🛡️
Mark all alerts as read.

**Response:** `204 No Content`

---

### GET `/admin/config` 🛡️
Fetch platform configuration toggles.

**Response:**
```json
{
  "maintenanceMode": false,
  "newRegistrations": true,
  "orderProcessing": true,
  "autoPayout": true,
  "emailAlerts": true,
  "smsNotifications": false,
  "pushNotifications": true
}
```

---

### PUT `/admin/config` 🛡️
Update one or more platform config toggles.

**Request body** (send only changed keys):
```json
{
  "maintenanceMode": true,
  "smsNotifications": true
}
```
**Response:** `204 No Content`

---

## Error Responses

All endpoints return standard error shapes:

```json
{
  "message": "Human-readable error description",
  "errors": {
    "field": ["Validation message"]
  }
}
```

| HTTP Status | Meaning |
|-------------|---------|
| `400` | Bad request / validation failed |
| `401` | Missing or invalid Bearer token |
| `403` | Forbidden — wrong role |
| `404` | Resource not found |
| `409` | Conflict (e.g. email already registered) |
| `422` | Unprocessable entity (business rule violation) |
| `429` | Rate limited |
| `500` | Internal server error |

---

## Environment Variables Required

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | Laravel backend base URL, e.g. `https://moverspadi.onrender.com` |

The Next.js rewrite maps `/backend/:path*` → `${NEXT_PUBLIC_API_URL}/api/:path*`.  
Without this variable set, all API calls fall back to bundled dummy data for development.

---

## Websocket / Real-time (Future)

The following features will eventually require WebSocket or Server-Sent Events (SSE):

- **Mover incoming requests** — currently polled via localStorage; should be pushed via WS
- **Booking status updates** — customer needs live status without polling
- **System alerts** — admin should receive new alerts in real time

Suggested channel names (e.g. Laravel Echo / Pusher):

| Channel | Event |
|---------|-------|
| `mover.{moverId}` | `IncomingRequest`, `BookingCancelled` |
| `booking.{bookingId}` | `StatusChanged`, `MoverAssigned` |
| `admin` | `NewAlert`, `NewVerification`, `NewOrder` |
