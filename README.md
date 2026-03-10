# Auth App

A React Native authentication app built with Expo, featuring Login and Signup flows with persistent session management.

## Branch Note

This branch enables the **React 19 Compiler**. React Compiler auto-memoizes, so I don't explicitly add `useMemo`, `memo`, or `useCallback`.
Use the `main` branch for the non-compiler version: `git switch main`.

## Getting Started

### Prerequisites

- Node.js
- Yarn
- Xcode (for iOS) or Android Studio (for Android)

### Installation

```sh
yarn install
```

### Running the App

```sh
# iOS
yarn ios

# Android
yarn android
```

## Features

### Authentication Context and Route Gating

- Uses `AuthContext` as the source of truth for `user`, `isAuthenticated`, `isInitializing`, `isLoading`, and auth actions (`login`, `signup`, `logout`, `clearAuthError`).
- Uses route gating in `RootNavigator` to show `AuthStack` (Login/Signup) when logged out and `AppStack` (Home) when logged in.

### Login Flow

- Login screen uses React Hook Form + Zod (`loginSchema`) to validate email format and required password.
- On submit, the app reads `auth:user:<email>` from AsyncStorage, verifies the password hash, and stores `auth:session-email` on success.
- Shows inline field validation errors and auth-level incorrect-credentials errors.

### Signup Flow

- Signup screen uses React Hook Form + Zod (`signupSchema`) for required name, valid email, and minimum password length.
- Prevents duplicate emails by checking existing `auth:user:<email>` records before saving.
- On success, creates the user, hashes password via `expo-crypto`, saves the user record, and starts a session.

### Storage and Session Persistence

- Persists each account as `auth:user:<email>` with `{ name, email, password }`.
- Persists active session as `auth:session-email`.
- On app launch, restores session by loading `auth:session-email` and hydrating the matching user.
- On logout, clears only `auth:session-email` and returns to auth screens.

### Crypto and Password Handling

- Passwords are not stored in plain text.
- `src/lib/crypto.ts` generates a random salt and hashes `salt + password` with SHA-256 using `expo-crypto`.
- Stored format is `salt$hash`, and login re-hashes input password with the same salt for comparison.

### UI and Bonus

- Includes Login, Signup, and Home screens with reusable input/button components and consistent styling.
- Includes password visibility toggle on auth forms.

## Tech Stack

- **Framework:** React Native with Expo (SDK 54)
- **React Compiler:** Enabled (React 19 Compiler)
- **Navigation:** React Navigation (Native Stack)
- **State Management:** React Context API + TanStack React Query
- **Form Handling:** React Hook Form + Zod validation
- **Storage:** AsyncStorage
- **Crypto:** expo-crypto (SHA-256 password hashing)
- **Linting:** Biome

## Demo Flow (Maestro)

A [Maestro](https://maestro.mobile.dev/) E2E flow is included to automate the full app walkthrough. Screenshots can be found in `screenshots/`.

Play at x2 speed.

https://github.com/user-attachments/assets/95858fb4-f556-4532-80c2-1ff7a715fa1d



It covers:

1. Password show/hide toggle
2. Login with empty fields (validation errors)
3. Login with invalid email format
4. Login with incorrect credentials
5. Navigate to Signup
6. Signup with empty fields (all validation errors)
7. Signup with invalid email and short password
8. Successful signup and redirect to Home
9. Home screen showing user info
10. Logout and attempt signup with already registered email
11. Successful login with the created account
12. Session persistence (quit and reopen app)


### Running the flow

```sh
# Install Maestro (one-time)
curl -Ls "https://get.maestro.mobile.dev" | bash

# Make sure the app is running on a simulator
yarn ios
# or
yarn android

# Run the demo flow
maestro test maestro/demo-flow.yaml
```

## Project Structure

```
src/
├── app.tsx                        # App entry point
├── features/
│   ├── auth/
│   │   ├── components/            # Auth UI components
│   │   ├── context/               # AuthContext and AuthProvider
│   │   ├── hooks/                 # useAuth hook
│   │   ├── screens/               # Login and Signup screens
│   │   ├── services/              # Auth storage service (AsyncStorage)
│   │   ├── types.ts               # Auth types
│   │   └── validation/            # Zod schemas for form validation
│   └── home/
│       └── screens/               # Home screen
├── lib/
│   └── crypto.ts                  # Password hashing and verification (expo-crypto)
├── navigation/                    # Stack navigators and route types
├── providers/                     # App-level providers
└── shared/
    ├── components/                # Shared UI components
    ├── theme/                     # Colors and theming
    └── utils/                     # Utility
```
