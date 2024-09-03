## RealTalk chat application

### You can start the app locally by running npm start in your terminal for both frontend and backend

### URL to backend github repo: https://github.com/tarikturkovic0/chat-app-backend

### Registration and Login

1. **Registration**:
   - Users can register by providing their details, such as username and password.
   - Upon successful registration, a JWT (JSON Web Token) is generated and stored in the browser's local storage to maintain user sessions.

2. **Login**:
   - Existing users can log in using their credentials.
   - After successful authentication, a JWT is issued and stored, granting access to the application.

### Main Interface

1. **Active Users List**:
   - Upon logging in, users are presented with a list of currently active users.
   - This list allows users to see who is online and available for chat.

2. **Chatroom Management**:
   - **Create Chatroom**:
     - Users can create a new chatroom by providing a unique code.
     - Once created, the chatroom will be added to the user’s chat history.
   - **Join Chatroom**:
     - Users can join an existing chatroom by entering its code.
     - After joining, the chatroom will appear in their chat history.

### Chat Interface

1. **Starting a Chat**:
   - Users can start a direct chat with another active user by selecting their name from the list.
   - The chat interface will open, displaying the chat history and a text input field for sending new messages.

2. **Chat History**:
   - All previous chats, both direct messages and chatrooms, are displayed in the chat history.
   - Users can navigate through their chat history to review past conversations.

3. **Real-Time Messaging**:
   - Messages are delivered in real-time, and users receive instant notifications when new messages arrive.
   - The chat interface updates dynamically to reflect incoming and outgoing messages.

### Additional Features

1. **Chatroom Code**:
   - Each chatroom is identified by a unique code, which is used for both creating and joining chatrooms.

2. **User Interactions**:
   - Users can interact with each other through direct messages or within chatrooms.
   - The chat interface differentiates between individual chats and chatroom messages.

### Logout

- Users can log out of the application, which will invalidate the JWT and redirect them to the login page.


## Architecture

### Frontend (Angular)

The frontend of the application is built using Angular and is structured as follows:

- **`app` Folder**:
  - **`app.component.ts`**: The root component of the application.
  - **`app.module.ts`**: The main module that imports and declares other modules and components.
  - **`routing.module.ts`**: Manages the routing configuration of the application.

- **`auth` Folder**:
  - **`auth.interceptor.ts`**: Interceptor to handle JWT authentication tokens for HTTP requests.
  - **Route Guards**: Guards to protect routes and ensure user authentication.

- **`chat` Folder**:
  - **Main Chat Component**: Handles the chat interface and communication logic.

- **`login` Folder**:
  - **Login and Registration Components**: Components for user login and registration.

- **`models` Folder**:
  - **`message.ts`**: Class model for chat messages.

- **`services` Folder**:
  - **`auth.service.ts`**: Service to manage authentication and user sessions.
  - **`chat.service.ts`**: Service to manage chat-related operations.
  - **`socket.service.ts`**: Service to handle WebSocket connections and communication.

### Backend (Node.js)

The backend of the application is built using Node.js and is structured as follows:

- **`server.js`**: Main entry point for the Node.js server.

- **`redisClient.js`**: Configuration file for connecting to Redis.

- **`controllers` Folder**:
  - **`authController.js`**: Handles authentication-related requests and operations.
  - **`chatController.js`**: Manages chat-related requests and operations.

- **`middleware` Folder**:
  - **`authMiddleware.js`**: Middleware for handling authentication, works with the frontend interceptor.

- **`models` Folder**:
  - **`userModel.js`**: Defines the schema and model for user data.

- **`routes` Folder**:
  - **`authRoutes.js`**: Defines routes related to authentication.
  - **`chatRoutes.js`**: Defines routes related to chat functionality.

- **`sockets` Folder**:
  - **`chatSockets.js`**: Manages WebSocket connections and chat communication.

### Data Flow

The application uses Angular to send HTTP requests to the Node.js backend. The backend connects to WebSocket for real-time communication and stores user data and messages in Redis. Data is retrieved from Redis and sent back to users, enabling real-time updates and interaction.
