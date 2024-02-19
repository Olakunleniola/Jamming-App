# Jamming App

Welcome to the Jamming App! This web application allows you to create custom playlists and save them directly to your Spotify account.

## Features

- Create custom playlists: Build playlists with your favorite tracks from Spotify's vast library.
- Save to Spotify: Once you've crafted the perfect playlist, save it directly to your Spotify account with just a few clicks.
- User Registration: To comply with Spotify API usage policy, users need to register before using the app.

## Demo

![demo_div](./demo_video/Jamming%20Video.gif)

## Getting Started

To get started with the Jamming App, follow these steps:

1. Clone the repository to your local machine.
2. Install the necessary dependencies by running `npm install`.
3. Obtain a client ID and secret from Spotify Developer Dashboard by registering at [https://developer.spotify.com/](https://developer.spotify.com/).
4. Create a `.env` file in the root directory of the project and add your Spotify client ID and secret:

  ```javascript
    REACT_APP_CLIENT_ID=your_client_id
    REACT_APP_CLIENT_SECRET=your_client_secret
    REACT_APP_CREDENTIALS=client_id:client_secret
  ```
5. Start the development server by running `npm start`.
6. Visit the app in your browser at `http://localhost:3000`.

If you prefer not to set up your own environment, you can also view the live version of the app at [https://jamming-app.onrender.com/](https://jamming-app.onrender.com/).

## Technologies Used

- React: Frontend development
- Spotify API: Integration with Spotify's music database
- Flask: Backend framework for handling user registration and database operations

## Contributing

We welcome contributions from the community! If you find any bugs, have suggestions for improvements, or want to contribute new features, please submit a pull request or open an issue on GitHub.

## Feedback

Your feedback is important to us! If you have any questions, concerns, or feedback about the app, please don't hesitate to reach out to us.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
