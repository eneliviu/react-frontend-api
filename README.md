# ***<center><font color="red"> LovinEscapades-API</font>***: The Ultimate Trip Tracking Tool!</center>
## <center> A Django web app </center>


The React app project contains the 'auth' folder with SigninForm.js and SignUpForm.js. 
Please summarize their functionalities in the appropriate sections of the README file:



### **Table of content:**
- [Overview](#overview)
- [Application Development](#application-development)
- [Main Features](#main-features)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Accessibility and Design](#accessibility-and-design)
- [Usage and Screenshots](#usage-and-screenshots)
- [Database Schema](#database-schema)
- [Online Validators](#online-validators)
- [Unit Testing](#unit-testing)
- [Manual Testing](#manual-testing)
- [Heroku Deployment](#heroku-deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Documentation version](#documentation-version)

## Overview
This React application serves as the frontend for the LovinEscapades project and draws inspiration from the Moments walkthrough project by Code Institute, as well as the "LovinEscapades" project from Milestone Project 4. While these earlier works influenced the core concepts and design, substantial upgrades and refactoring were implemented to address and resolve conflicts resulting from the deprecation of Create React App (CRA). Additionally, generative AI tools, including OpenAI's GPT-4 model, were leveraged for debugging and updating deprecated libraries throughout the Code Institute walkthrough projects.

## Installation and Setup
Step-by-step instructions on how to set up and run the project locally. Include prerequisites and how to install dependencies.


[*Back to top*](#)

## Features

### Authentication
The React application includes robust authentication features for managing user sessions.
Below are summaries of the key components responsible for authentication:

- **SignInForm.js**:
  - Handles user login by capturing username and password input.
  - Performs authentication by sending a POST request to the `/api-auth/token/` endpoint to obtain access and refresh tokens.
  - Stores the tokens in local storage and updates the current user context with fetched user information.
  - Implements error handling for login failures, providing user feedback through form validation alerts.
  - Redirects authenticated users to the home page or previous location using the `useNavigate` hook.
  - Uses custom hooks like `useSetCurrentUser` to update user state and `useRedirect` to manage redirects based on user authentication status.
  - Incorporates responsive design via Bootstrap components to ensure a cohesive user experience across devices.

- **SignUpForm.js**:
  - Facilitates new user registration through a form capturing username, password, and confirmation of password.
  - Sends a POST request to the `/dj-rest-auth/registration/` endpoint for user account creation.
  - On successful registration, navigates the user to the sign-in page to allow login.
  - Provides feedback on form submissions with detailed error alerts for validation issues such as mismatched passwords or duplicate usernames.
  - Uses the `useRedirect` custom hook to prevent access to the signup page when a user is already authenticated.
  - Employs Bootstrap components for form structuring and styling, supporting an engaging and accessible registration process.


### Mapping and geolocation services
* Easy navigation from the map markers and profile, add/edit trip images

### Image gallery for site visitiors
* Privacy (display only shared trips and images)
* Private info is available only to the user, on its profile page

### Custom hooks
The application incorporates custom React hooks to streamline functionality and improve user interactions:

- **useRedirect.js**:
  - This hook manages navigation based on the user's authentication status.
  - It utilizes `react-router-dom`'s `useNavigate` hook to redirect users dynamically.
  - When executed, it checks whether a user is logged in via an API request to `/dj-rest-auth/user/`.
    - If the `userAuthStatus` is "loggedIn" and the user is authenticated, the hook navigates to the homepage.
    - If the `userAuthStatus` is "loggedOut" and the user is not authenticated, it also redirects to the homepage.

- **useClickOutsideToggle.js**:
  - This utility hook is designed to manage UI elements that expand and collapse based on click events outside of a targeted component.
  - It maintains state (`expanded`) to track whether the element is expanded and uses a `ref` to reference the targeted element.
  - The hook listens for mouseup events and sets the expanded state to false if a click is detected outside the referenced element.

### Infinite scrolling
* Trips and image lists

### Styling
React Bootstrap library responsive design and styling the React components.
Most components have their associated CSS modules for styling.

[*Back to top*](#)


## Project Structure
The `index.js` and `App.js` files are key components of the React application:

- **`index.js`**: This file is the entry point of the React application. It sets up the React application to render within the HTML root element. The application is wrapped with several key providers and routing functionality:
  - **`Router`** from `react-router-dom` is utilized to manage navigation throughout the app.
  - **`CurrentUserProvider`** and **`ProfileDataProvider`** are context providers employed to manage global state concerning user information and profile data, improving state management across different components.
  - The application is ultimately rendered with the `<App />` component encapsulating it.

[*Back to top*](#)



## Available Scripts

Describe the various npm scripts that can be run, for example:
- `npm start` – Runs the app in development mode.
- `npm test` – Launches the test runner.

[*Back to top*](#)

## State Management

### CurrentUserContext
- **`CurrentUserContext.js`**: Manages state and operations related to the current authenticated user.
  - Provides `CurrentUserContext` and `SetCurrentUserContext` to manage and update the user's session state.
  - Fetches user data from the server and keeps track of login status. Automatically refreshes tokens and handles logout.
  - Includes hooks `useCurrentUser` and `useSetCurrentUser` to facilitate easy access and updates to the user state in consuming components.
  - Implements a refresh mechanism that periodically refreshes the access token to maintain session validity.

### ProfileDataContext
- **`ProfileDataContext.js`**: Manages state and operations related to user profiles, particularly in follow-related interactions.
  - Provides `ProfileDataContext` and `SetProfileDataContext` for sharing profile data across components.
  - Handles the retrieval of popular profiles and manages follow/unfollow functionality through asynchronous requests.
  - Utilizes utility functions (`followHelper`, `unfollowHelper`) to update state when profiles are followed or unfollowed.
  - Offers hooks `useProfileData` and `useSetProfileData` for accessing profile data and performing actions like follow/unfollow within components.

[*Back to top*](#)

## API Integration
The React application interfaces with the Django API using the Axios library for HTTP requests.

### Axios Configuration
- **`axiosDefaults.js`**: This file is responsible for configuring Axios, the HTTP client used for making API requests.
  - Sets the base URL for API requests. Defaults to `http://127.0.0.1:8000` for local development.
  - Configures Axios to handle requests with `multipart/form-data` content type and to send cookies with requests (`withCredentials: true`).
  - Provides two Axios instances, `axiosReq` and `axiosRes`, with separate request and response interceptors.
  - **Request Interceptor**: Automatically attaches an access token from localStorage to the headers of outgoing requests.
  - **Response Interceptor**: Handles 401 Unauthorized errors by attempting to refresh tokens using a stored refresh token, updating the local storage and retrying the original request if successful.

## Routing
The application's route management is handled within `App.js` using `react-router-dom`.
It defines multiple routes for various pages in the application:

- **Home (`/`)**: Displays a `MapComponent` and a `TripFilterForm`, allowing users to apply filters to their views.
- **Gallery (`/gallery`)** and **Feed (`/feed`)**: Display images with options to filter based on user interactions like following users or liking posts.
- **Authentication Routes**: Includes paths for sign-in (`/signin`) and sign-up (`/signup`) forms.
- **Trip Management**:
  - Creation, editing, and image upload are facilitated at paths like `/trips/create`, `/trips/:tripId/edit`, and `/trips/:tripId/images`.
- **Profile Management**:
  - Profile viewing and editing are managed via routes such as `/profiles/:id`, with specific endpoints for editing username and password.
- **NotFound**: A wildcard route (`*`) is utilized to render a `NotFound` component for any undefined paths, enhancing user experience.

[*Back to top*](#)


## Styling and UI Design
Discuss the design approach, any UI libraries or frameworks used, and how styling is managed in the project.

[*Back to top*](#)

## Screenshots


### Un-authenticated site visitors
<p align="center"><img src="src/assets/doc/home_visitors.png" alt="map visitors"></p>
<p align="center"><img src="src/assets/doc/filter_map_country.png" alt="filter by country"></p>
<p align="center"><img src="src/assets/doc/filter_map_place.png" alt="filter by place"></p>
<p align="center"><img src="src/assets/doc/marker_popup_visitor.png" alt="marker popup"></p>
<p align="center"><img src="src/assets/doc/gallery_visitor.png" alt="gallery visitor"></p>
<p align="center"><img src="src/assets/doc/signup_form.png" alt="signup form"></p>
<p align="center"><img src="src/assets/doc/signin_form.png" alt="signin form"></p>

### Authenticated users
![alt text](home_users.png)
<p align="center"><img src="src/assets/doc/home_users.png" alt="map users"></p>
<p align="center"><img src="src/assets/doc/add_trip.png" alt="add trip"></p>
<p align="center"><img src="src/assets/doc/gallery_auth_users.png" alt="gallery users"></p>

![alt text](gallery_auth_users.png)


## Testing

### Manual testing


### Validators

#### Lighthouse

[*Back to top*](#)


## Heroku Deployment
Server instructions for Heroku deployment are included in the [`Procfile`](Procfile) file.
The base URL for the backend API is specified in the [`axiosDefaults.js`](src\api\axiosDefaults.js).

[*Back to top*](#)


## Contributing
### To contribute to the ***LovinEscapades-API*** project:
- Fork the repository on GitHub to create your own copy.
- Clone the forked repository to your local machine.
- To fork the project:
    - Click the "Fork" button on the top-right corner of the repository page
    - Clone Your Fork by running the following command in the terminal or command prompt:
        `git clone https://github.com/your-username/repository-name.git`
- Make your desired changes, whether it's fixing a bug, adding a feature, or updating documentation.
- Commit your changes with clear messages.
- Push your commits to your forked repository on GitHub.
- Submit a pull request detailing your changes and their benefits.

[*Back to top*](#)

## License
### Open Source
As an open-source project, ***LovinEscapades-API*** promotes transparency and community involvement.
The code is accessible on GitHub, allowing developers to view, fork, and contribute to the project as they desire.

[*Back to top*](#)

## Acknowledgements
I would like to extend my gratitude to my mentor, Luke Buchanan, for his support and patience, especially during the challenging initial stages of the frontend development.

[*Back to top*](#)
