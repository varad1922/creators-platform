## Automated API Testing with Jest & Supertest

### Changes Made
- ✅ Installed and configured Jest & Supertest
- ✅ Refactored server execution flow (separated `app.js` and `server.js`)
- ✅ Implemented test database configuration (`MONGODB_URI_TEST`)
- ✅ Added integration tests for Authentication routes (`/api/auth/register` and `/api/auth/login`):
  - Register with valid data
  - Register with existing email
  - Register with missing fields
  - Login with correct credentials
  - Login with wrong password
- ✅ Added lifecycle hooks (`beforeAll`, `afterEach`, `afterAll`) for DB teardown and setup
- ✅ Fixed `/api/users/register` to issue JWT tokens upon registration to align with test assumptions.
- ✅ All 5 tests passing

### Video Explanation
[Link to Video]
