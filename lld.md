# Low-Level Design (LLD)

## 1. Directory Structure & Code Organization
- **/client**: Contains the React frontend application.
- **/server**: Contains the Node.js API server.
- **/docs**: Documentation files.

## 2. API Design & Endpoints
Endpoints are built using Express routers. Controllers are used to handle business logic.

## 3. Database Schema (MongoDB)
Data models use Mongoose to define the schema structure.
- **Pending Optimization:** Review existing schemas to decide between embedding vs referencing relationships based on query access patterns.

## 4. Pending Implementations & Best Practices
The following technical requirements are identified for implementation at the code level:

### Core JavaScript Refinements
- **Event loop, Closures & Hoisting:** Audit code to ensure functions avoid unintended hoisting side effects, correctly utilize closures for privacy, and avoid blocking the event loop.
- **Async/Await & Promises:** Ensure consistent use of Promises and `async/await` throughout the server controllers and client data fetching logic instead of legacy callbacks.

### Security Enhancements
- **JWT Handling:** Implement standard JSON Web Token issuance upon login and middleware for verification on protected routes.
- **Input Sanitization:** Apply sanitization middleware (e.g., `express-validator`, `xss-clean`) to all incoming request bodies to prevent injection attacks.
- **Secrets Management:** Ensure `.env` is strictly used for sensitive data and handled properly.

### Advanced Features
- **Redis Integration:** Setup caching mechanisms for heavy read operations.
- **Server-Side Rendering (SSR):** Evaluate options (e.g., Next.js) or implement basic SSR for critical routes.
- **WebSockets:** Add Socket.io for managing real-time data flow.
- **Payment API:** Integrate specific Stripe/PayPal SDK functions in the backend.
