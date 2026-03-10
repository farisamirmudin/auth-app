# Auth App

A React Native authentication app built with Expo, featuring Login and Signup flows with persistent session management.

## Features

### Authentication Context

- [x] `AuthContext` using React's Context API to manage global authentication state
- [x] `login` function to log in a user
- [x] `signup` function to create a new user
- [x] `logout` function to log out the user
- [x] `user` state to store the currently logged-in user's information

### Screens

#### Login Screen

- [x] Email input field
- [x] Password input field
- [x] "Login" button that triggers the login function from the AuthContext
- [x] Error message for invalid email/password format
- [x] Error message for incorrect credentials
- [x] "Go to Signup" button to navigate to the Signup screen

#### Signup Screen

- [x] Name input field
- [x] Email input field
- [x] Password input field
- [x] "Signup" button that triggers the signup function from the AuthContext
- [x] Error message for missing fields
- [x] Error message for invalid email format
- [x] Error message for password length less than 6 characters
- [x] "Go to Login" button to navigate back to the Login screen

#### Home Screen

- [x] Display the currently logged-in user's name and email
- [x] "Logout" button to log out the user and return to the Login screen

### Persist Authentication

- [x] Uses AsyncStorage to persist authentication state across app restarts

### Navigation

- [x] React Navigation managing Login, Signup, and Home screens
- [x] Auth stack (Login/Signup) and App stack (Home) separated based on auth state

### UI Design

- [x] Clean with intuitive navigation
- [x] Styled input fields, buttons, and error messages

### Bonus

- [x] Password visibility toggle with eye icon

## Tech Stack

- **Framework:** React Native with Expo (SDK 54)
- **Navigation:** React Navigation (Native Stack)
- **State Management:** React Context API + TanStack React Query
- **Form Handling:** React Hook Form + Zod validation
- **Storage:** AsyncStorage
- **Crypto:** expo-crypto (SHA-256 password hashing)
- **Linting:** Biome

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

## Demo Flow (Maestro)

A [Maestro](https://maestro.mobile.dev/) E2E flow is included to automate the full app walkthrough. Screenshots can be found in `screenshots/`.

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

### iOS
https://github.com/user-attachments/assets/15d1627c-eea6-4ed8-b82f-cf504ba6fcb3


### Android
https://github.com/user-attachments/assets/dcba5942-787e-4550-a74e-3b17af20ef91


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
