## Kloudius Auth

Kloudius Auth is a React Native application that provides authentication interface to Kloudius users.

## Features

- Login
- Sign Up
- Home

## Tech Stack

- React Native
- React Navigation
- React Native Screens
- React Native Sensitive Info (decided to not use AsyncStorage due to security concerns)
- React Context API (for global state management)

## Setup

- Install dependencies
- Run `npx pod-install`
- Run `npx react-native run-ios` or `npx react-native run-android`

## How this app works

- The app has three screens: Login, Sign Up, and Home.
- The Login screen has a form with email and password fields.
- The Sign Up screen has a form with email, password, and name fields.
- The Home screen has a welcome message and a logout button.
- You can login using the credentials in the `users.json` file.
- You can sign up using a new email and password.
- The new credentials will be added to the `users.json` file.
- You don't need to login to the app again, as the app will remember your last login.
- You will only need to re-login if you clear the app data or if you log out of the app.
- Once a new user data is added, you cannot register with the same email again.
- During testing, you can start with an empty `users.json` file.
- You can logout using the logout button, and you will be redirected to the Login screen.
