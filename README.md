# ***<center><font color="red"> LovinEscapades-API</font>***: The Ultimate Trip Tracking Tool!</center>
## <center> A React - Django DRF web app </center>

The React app project contains the 'auth' folder with SigninForm.js and SignUpForm.js. 
Please summarize their functionalities in the appropriate sections of the README file:

### **Table of content:**
- [Overview](#overview)
- [Installation and Setup](#installation-and-setup)
- [Application Development](#application-development)
- [Main Features](#main-features)
- [Project Structure](#project-structure)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Routing](#routing)
- [Screenshots](#screenshots)
- [Testing](#testing)
- [Heroku Deployment](#heroku-deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)
- [Documentation version](#documentation-version)

## Overview
This React application serves as the frontend for the LovinEscapades project and draws inspiration from the Moments walkthrough project by Code Institute, as well as the "LovinEscapades" project from Milestone Project 4. While these earlier works influenced the core concepts and design, substantial upgrades and refactoring were implemented to address and resolve conflicts resulting from the deprecation of Create React App (CRA). Additionally, generative AI tools, including OpenAI's GPT-4 model, were leveraged for debugging and updating deprecated libraries throughout the Code Institute walkthrough projects.

## Application Development
This application was developed using an iterative approach, following Agile principles.

**User Stories & Epics**
I employed a user-centric approach, defining key epics and user stories to guide project development.

**Example Epic**:
Epic: As an API developer,
I want to implement robust and secure user authentication,
so that API consumers can securely access and interact with protected resources.

**Example User Story**:
As an API consumer,
I can authenticate with the API using JWT (JSON Web Tokens),
So that I can access protected resources and perform authorized actions.

**Key Epics**:
* User Authentication: Implement secure and reliable user authentication.
* Trip Management: Enable users to create, manage, and share trip plans.
* Social Interaction: Allow users to interact with other users and their content (e.g., liking posts, following users).
* API Documentation: Provide comprehensive and user-friendly API documentation.


All critical user stories identified as "must-have" were successfully implemented within the project timeline.


<p align="center"><img src="src/assets/doc/Kanban.png" alt="agile kanban board"></p>
<center> Github Kanban board with project User stories.</center><br>

<p align="center"><img src="src/assets/doc/Kanban_detail.png" alt="agile kanban board"></p>
<center> Github Kanban board with project User stories.</center><br>


This project builds upon the "LovinEscapades" project from MileCustom template for User Storiesstone Project 4 at CodeInstitute. It provides an opportunity to apply API development concepts and enhance my understanding of backend development principles. During development, I focused on code quality and maintainability, adhering to the DRY principle and utilizing frequent Git commits for effective version control.


[*Back to top*](#)

## Main Features

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

## Screenshots

### Un-authenticated site visitors
<p align="center"><img src="src/assets/doc/home_visitors.png" alt="map visitors"></p>
<center> Home page view for unauthenticated site visitors.</center><br>

<br>
<p align="center"><img src="src/assets/doc/filter_map_country.png" alt="filter by country"></p>
<center> Map filters example: filter by country name.</center><br>

<br>
<p align="center"><img src="src/assets/doc/filter_map_place.png" alt="filter by place"></p>
<center> Map filters example: filter by place/city name.</center><br>

<br>
<p align="center"><img src="src/assets/doc/marker_popup_visitor.png" alt="marker popup"></p>
<center> Information on popups is not unavailable to unauthenticated site visitors.</center><br>

<br>
<p align="center"><img src="src/assets/doc/gallery_visitor.png" alt="gallery visitor"></p>
<center> Github Kanban board with project User stories.</center><br>

<br>
<p align="center"><img src="src/assets/doc/signup_form.png" alt="signup form"></p>
<center> Github Kanban board with project User stories.</center><br>

<br>
<p align="center"><img src="src/assets/doc/signin_form.png" alt="signin form"></p>
<center> Github Kanban board with project User stories.</center><br>


### Authenticated users
<br>
<p align="center"><img src="src/assets/doc/home_users.png" alt="map users"></p>
<center> Github Kanban board with project User stories.</center><br>

<br>
<p align="center"><img src="src/assets/doc/add_trip.png" alt="add trip"></p>
<center> Github Kanban board with project User stories.</center><br>

<br>
<p align="center"><img src="src/assets/doc/gallery_auth_users.png" alt="gallery page"></p>
<center> Github Kanban board with project User stories.</center><br>

<br>
<p align="center"><img src="src/assets/doc/feed_auth_users.png" alt="feed page"></p>
<center> Github Kanban board with project User stories.</center><br>

<br>
<p align="center"><img src="src/assets/doc/liked_auth_users.png" alt="liked page"></p>
<center> Github Kanban board with project User stories.</center><br>

<br>
<p align="center"><img src="src/assets/doc/profile_page.png" alt="profile page"></p>
<center> Github Kanban board with project User stories.</center><br>

[*Back to top*](#)


## Testing

### Manual testing
The manual testing section aims to validate the functionality, usability, and integration of the frontend React app with the Django backend beyond automated tests. This testing strategy ensures that the app operates correctly under various conditions, including user authentication, profile management, trip and image handling, and UI consistency.

| **Test Type**                       | **Description and Steps**                                                                                     | **Expected Result**                                                                                         | **Status**                                 |
|-------------------------------------|---------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|--------------------------------------------|
| **Authentication**                  | 1. **User registration:** <br/> - Register using username and password, enter password twice, redirect to `Home` page. <br/> 2. **User login:** <br/> - Log in with credentials, check errors for empty fields, incorrect username/password. <br/> 3. **User logout:** <br/> - Logout via navbar, redirect to `Login` page. | Successful registration and login/logout processes with proper error handling and redirection.                | ![pass](https://via.placeholder.com/10/00FF00?text=+) `pass` |
| **User Profile Management**         | 1. **Edit profile:** <br/> - Edit bio and change image, cancel/submit changes, logout, login required. <br/> 2. **Change username:** <br/> - Edit username, cancel/submit changes, logout, login required. <br/> 3. **Change password:** <br/> - Edit password, cancel/submit changes, logout, login required. <br/> 4. **Delete profile:** <br/> - Access/delete form, confirm, logout, redirect to `Home`. <br/> 5. **Activity indicators:** <br/> - Indicators update correctly. | Successful editing, changing, deleting of profile with proper notifications and navigation feedback.          | ![pass](https://via.placeholder.com/10/00FF00?text=+) `pass` |
| **Trip Management**                 | 1. **Create trip:** <br/> - Field error checks, date validation, cancel/redirect, submit/redirect to map. <br/> 2. **Edit trip:** <br/> - Pre-filled form, field error checks, cancel/redirect, submit/redirect. <br/> 3. **Delete trip:** <br/> - Access from marker/profile, cancellation/redirect, submit/redirect. | Successful creation, editing, deletion of trips, with navigational correctness and validation checks.         | ![pass](https://via.placeholder.com/10/00FF00?text=+) `pass` |
| **Image Management**                | 1. **Upload new image:** <br/> - Access upload forms, cancel/submit feedback, redirection as appropriate. <br/> 2. **Edit existing image:** <br/> - Pre-filled form, previous image data checks, cancel/submit, redirection proper. <br/> 3. **Delete image:** <br/> - Access/delete forms, cancellation/redirect, submit/redirect. <br/> 4. **Image likes:** <br/> - Correct like functionality, excluding own images. | Correct handling of image management processes with functional forms and appropriate feedback mechanisms.    | ![pass](https://via.placeholder.com/10/00FF00?text=+) `pass` |
| **Map Trip Locations**              | 1. Display trip locations on the map. <br/> 2. Update trip/image info in popups. <br/> 3. Disable buttons for non-owners. | Correct display of map locations and interactive elements, with button disabling for unauthorized actions.   | ![pass](https://via.placeholder.com/10/00FF00?text=+) `pass` |
| **Gallery Page**                    | 1. Display shared images. <br/> 2. Proper access to edit/delete forms for owners. <br/> 3. Controlled like functionality. | Correct display and interaction of shared content with controlled user functionalities for likes.            | ![pass](https://via.placeholder.com/10/00FF00?text=+) `pass` |
| **Feed Page**                       | 1. Display images from followed users. <br/> 2. Hide images from unfollowed users.                             | Appropriate filtering of content based on user follow state.                                                | ![pass](https://via.placeholder.com/10/00FF00?text=+) `pass` |
| **Liked Page**                      | 1. Display liked images. <br/> 2. Hide unliked images.                                                          | Correct display of user-liked images with hidden unliked content.                                           | ![pass](https://via.placeholder.com/10/00FF00?text=+) `pass` |
| **Privacy Handling**                | 1. Not shared trips not visible to other users on the map. <br/> 2. Not shared trips not visible to other users on the trip's owner profile page. <br/> 3. Not shared images not visible to other users on the map and gallery page. <br/> 4. Not shared images not visible to other users on the trip's owner profile page. | Ensures that non-shared trips and images are correctly hidden from unauthorized users across different pages. | ![pass](https://via.placeholder.com/10/00FF00?text=+) `pass` |
|


### Validators

#### Lighthouse

[*Back to top*](#)


## Heroku Deployment
Server instructions for Heroku deployment are included in the [`Procfile`](Procfile) file.
The base URL for the backend API is specified in the [`axiosDefaults.js`](src\api\axiosDefaults.js).

[*Back to top*](#)



## Installation
To get the app up and running on your local machine for development and testing purposes, follow these steps:

* **Prerequisites**
Ensure you have the following tools installed on your development machine:
- **Node.js**: [Download and install Node.js](https://nodejs.org/), which comes with `npm`.
- **Git**: [Download and install Git](https://git-scm.com/).

* **Clone Repository**
First, clone the repository to your local machine using Git. Open your terminal and run:
```bash
git clone https://github.com/yourusername/your-repo-name.git
```
Navigate into the project directory:
```bash
cd your-repo-name
```

* **Install Dependencies**
Once inside the project directory, install the necessary `npm` packages:
```bash
npm install
```
This will install all dependencies listed in the `package.json` file.

* **Running the Application**
You can run the application in development mode with the following command:
```bash
npm start
```
This will start the development server and open the app in your default web browser. If not, you can visit it at [http://localhost:3000](http://localhost:3000).

### Contribution Guide
#### Fork the Project
* Click the "Fork" button on the top-right corner of the repository page
* Clone Your Fork by running the following command in the terminal or command prompt:
    `git clone https://github.com/your-username/repository-name.git`
* Make your desired changes, whether it's fixing a bug, adding a feature, or updating documentation.
* Commit your changes with clear messages, for example:
```bash
git add .
git commit -m "Fix issue #123: Corrected the layout on the homepage"
```
* Push your commits to your forked repository on GitHub.
````bash
git push
```

* Submit a pull request detailing your changes and their benefits.

[*Back to top*](#)

## License
### Open Source
As an open-source project, ***LovinEscapades-API*** promotes transparency and community involvement.
The code is accessible on GitHub, allowing developers to view, fork, and contribute to the project as they desire.

[*Back to top*](#)

## Acknowledgements
I would like to extend my gratitude to my mentor, Luke Buchanan, for his support and patience, especially during the challenging initial stages of the frontend development.

[*Back to top*](#)

## Documentation version

Last updated: Feb 5, 2025

[*Back to top*](#)