# 1forusa - React Native App with Authentication

This project integrates authentication functionality into the existing React Native app.

## Project Structure

```
1forusa/
├── backend/              # Node.js/Express backend
│   ├── config/          # Database configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   ├── .env            # Environment variables
│   ├── package.json    # Backend dependencies
│   └── server.js       # Server entry point
├── src/
│   ├── api/            # API service functions
│   ├── components/
│   │   ├── auth/       # Authentication components
│   │   └── common/     # Shared components
│   ├── contexts/       # React contexts
│   ├── navigation/     # Navigation configuration
│   └── screens/        # Screen components
└── package.json        # React Native dependencies
```

## Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env` and update the values:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: A secure random string for JWT signing
     - `EMAIL_USER` & `EMAIL_PASS`: Email credentials (optional for now)

4. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5050`

### 2. Frontend Setup

1. Navigate to the project root:
   ```bash
   cd ..
   ```

2. Install new dependencies:
   ```bash
   npm install
   ```

3. For iOS (if using iOS):
   ```bash
   cd ios && pod install && cd ..
   ```

4. Start the React Native app:
   ```bash
   npm start
   ```

5. Run on Android:
   ```bash
   npm run android
   ```

6. Run on iOS:
   ```bash
   npm run ios
   ```

## Authentication Flow

1. **Login Screen**: Users can log in with email and password
2. **Sign Up Screen**: Users can create new accounts
3. **Authentication State**: Managed with React Context
4. **Token Storage**: JWT tokens stored in AsyncStorage
5. **Logout**: Available in the Profile screen

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/verify-otp` - OTP verification
- `POST /api/auth/reset-password` - Password reset

## Database Setup

### MongoDB (Recommended)

1. Install MongoDB locally or use MongoDB Atlas
2. Update the `MONGO_URI` in your `.env` file
3. The application will create the necessary collections automatically

### Local MongoDB Installation

**Windows:**
1. Download MongoDB Community Server
2. Install and start the MongoDB service
3. Use connection string: `mongodb://localhost:27017/forusa_auth`

**macOS:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install mongodb
sudo systemctl start mongodb
```

## Testing the Integration

1. Start the backend server (`npm run dev` in backend folder)
2. Start the React Native app (`npm start` in root folder)
3. The app should show the Login screen
4. Create a new account using the Sign Up screen
5. Log in with your credentials
6. Navigate to Profile screen and test logout

## Troubleshooting

### Common Issues

1. **Backend connection failed**: Make sure MongoDB is running and the connection string is correct
2. **Module not found errors**: Run `npm install` in both root and backend directories
3. **Metro bundler issues**: Clear cache with `npx react-native start --reset-cache`
4. **Android network issues**: Make sure your API base URL uses `10.0.2.2` for Android emulator

### API Base URL Configuration

The API base URL is set in `src/api/auth.ts`:
- For Android Emulator: `http://10.0.2.2:5050/api/auth`
- For iOS Simulator: `http://localhost:5050/api/auth`
- For Physical Device: Use your computer's IP address

## Next Steps

1. **Password Reset Flow**: Implement forgot password with OTP
2. **User Profile Management**: Add user data editing
3. **Email Verification**: Set up proper email service
4. **Security Enhancements**: Add rate limiting, input validation
5. **UI Improvements**: Enhance the authentication screens design

## Dependencies Added

### Frontend
- `@react-native-async-storage/async-storage`: Token storage

### Backend
- `express`: Web framework
- `mongoose`: MongoDB ODM
- `bcryptjs`: Password hashing
- `jsonwebtoken`: JWT token generation
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variables
- `nodemailer`: Email sending (for password reset)
