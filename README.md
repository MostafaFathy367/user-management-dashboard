# User Management Dashboard

## Setup
1. Clone the repository
2. Run `npm install`
3. Run `npm run dev`

## Features
- User List with pagination, search, filtering, and sorting
- User Detail with edit form and validation
- Role-based authorization
- Multi-language support (English/Arabic)

## Architecture Answers
1. **API Optimization**: Use debounced search and caching with Pinia persisted state.
2. **Shared Logic**: Custom composables like `useDebounce`.
3. **Caching**: Pinia with persisted state plugin.
4. **Scaling Permissions**: Role-based access control with dynamic permission checks.
5. **Testing**: Unit tests for stores, E2E for workflows.
6. **Offline**: Service workers and local storage with Pinia.

## Run Tests
- Unit: `npm run test:unit`
- E2E: `npm run test:e2e`