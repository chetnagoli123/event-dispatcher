# Event-Driven Notification Dispatcher

A lightweight asynchronous notification system built with **Node.js**, **Express.js**, and **SQLite**. The application accepts business events through a REST API, stores them in a SQLite database, queues notification tasks in memory, and processes them asynchronously in the background without blocking the client response.

---

## Project Overview

This project demonstrates an event-driven architecture where incoming business events are processed asynchronously. When a client submits an event, the API immediately acknowledges the request while a background worker handles notification processing independently.

The implementation focuses on:

- Asynchronous request handling
- Clean service-based architecture
- SQLite database persistence
- In-memory queue processing
- Separation of concerns
- Error handling and request validation

---

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite
- **SQLite Driver:** sqlite3
- **Queue:** Native JavaScript In-Memory Queue
- **Environment Variables:** dotenv

---

## Project Structure

```text
event-dispatcher/
│
├── src/
│   ├── app.js
│   ├── server.js
│   │
│   ├── controllers/
│   │   └── eventController.js
│   │
│   ├── services/
│   │   ├── eventService.js
│   │   ├── notificationService.js
│   │   └── queueWorker.js
│   │
│   ├── routes/
│   │   └── eventRoutes.js
│   │
│   ├── db/
│   │   ├── database.js
│   │   └── schema.sql
│   │
│   ├── queue/
│   │   └── queue.js
│   │
│   ├── middleware/
│   │   └── errorHandler.js
│   │
│   └── utils/
│       └── response.js
│
├── database.sqlite
├── package.json
├── README.md
└── .env.example
```

---

## Installation

Clone the repository:

```bash
git clone <your-github-repository-url>
```

Navigate to the project:

```bash
cd event-dispatcher
```

Install dependencies:

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=3000
```

---

## Running the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server starts on:

```
http://localhost:3000
```

During startup the application automatically:

- Creates the SQLite database (if it does not exist)
- Creates the required tables
- Starts the background queue worker

---

## Database Schema

### events

| Column | Type |
|---------|------|
| id | INTEGER |
| event_type | TEXT |
| payload | TEXT |
| created_at | DATETIME |

### notifications

| Column | Type |
|---------|------|
| id | INTEGER |
| event_id | INTEGER |
| recipient | TEXT |
| channel | TEXT |
| status | TEXT |
| retry_count | INTEGER |
| created_at | DATETIME |
| updated_at | DATETIME |

---

# API

## Create Event

**Endpoint**

```
POST /api/v1/events
```

### Request Body

```json
{
  "event_type": "order_placed",
  "recipient": "user@example.com",
  "data": {
    "order_id": 101
  }
}
```

---

### Success Response

**Status Code**

```
202 Accepted
```

```json
{
  "message": "Event accepted for processing",
  "tracking_id": 1,
  "notification_id": 1,
  "status": "pending"
}
```

The response is returned immediately while the notification is processed asynchronously in the background.

---

### Validation Error

**Status Code**

```
400 Bad Request
```

```json
{
  "error": "event_type and recipient are required"
}
```

---

### Server Error

**Status Code**

```
500 Internal Server Error
```

```json
{
  "error": "Internal server error"
}
```

---

# Asynchronous Queue Workflow

1. Client sends a business event.
2. Request is validated.
3. Event is stored in the `events` table.
4. Notification is created with `pending` status.
5. Notification is pushed into the in-memory queue.
6. API immediately returns **202 Accepted**.
7. Background worker picks the notification from the queue.
8. Notification sending is simulated using a random delay between **500–1000 ms**.
9. A 10% failure rate is simulated.
10. Notification status is updated to either:
    - `completed`
    - `failed`

---

# Notification Processing

Default notification channel:

```
email
```

Supported notification states:

- pending
- completed
- failed

On simulated failure:

- retry_count is incremented
- status is updated to `failed`

---

# Testing

Example request using curl:

```bash
curl -X POST http://localhost:3000/api/v1/events \
-H "Content-Type: application/json" \
-d '{
  "event_type":"order_placed",
  "recipient":"user@example.com",
  "data":{
    "order_id":101
  }
}'
```

Example response:

```json
{
  "message": "Event accepted for processing",
  "tracking_id": 1,
  "notification_id": 1,
  "status": "pending"
}
```

---

# Design Highlights

- Layered architecture
- Service-based design
- Separation of business logic
- Asynchronous processing
- SQLite persistence
- Modular code organization
- Request validation
- Error handling
- Non-blocking API responses

---

# Assumptions

- Email delivery is simulated using `setTimeout`.
- An in-memory queue is used as required by the assignment.
- Queue contents are not persisted after application shutdown.
- SQLite is used as the local persistent database.
- One notification is generated for each incoming event.

---

# Future Improvements

- Retry scheduling with exponential backoff
- Persistent queue implementation
- Multiple notification channels (SMS, Push, Webhooks)
- Authentication and authorization
- Docker support
- Unit and integration tests
- Logging and monitoring
- Queue metrics and dashboard

---

# Author

**Chetna Goli**

Backend Engineering Technical Assignment