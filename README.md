# OpenCode Mobile

A React Native mobile interface for OpenCode - run commands, get outputs, notifications, and interact with your AI coding assistant from your mobile device.

## Features

- **Chat Interface**: Full-featured chat with streaming message support
- **Session Management**: Create, switch, and delete coding sessions
- **Real-time Updates**: SSE (Server-Sent Events) for live streaming responses
- **Tool Execution Display**: View tool usage and results inline
- **Todo Tracking**: See task progress in real-time
- **Notifications**: Get notified about session events
- **Theme Support**: Light, dark, and system theme options
- **ShadCN-style UI**: Beautiful, consistent UI components with NativeWind

## Tech Stack

- **React Native** with Expo
- **NativeWind** (Tailwind CSS for React Native)
- **Expo Router** for navigation
- **Zustand** for state management
- **TypeScript** for type safety

## Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- An OpenCode server running (default: `http://localhost:4096`)

## Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

## Running the App

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS (macOS only)
npm run ios

# Run in web browser
npm run web
```

## Connecting to OpenCode Server

1. Start your OpenCode server with the `--server` flag:
   ```bash
   opencode --server
   ```

2. Open the app and go to Settings
3. Enter your server URL (e.g., `http://192.168.1.100:4096` for local network)
4. Optionally enter the server password
5. Tap "Connect"

## Project Structure

```
opencode-mobile/
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout
│   ├── index.tsx           # Main chat screen
│   ├── sessions.tsx        # Sessions list
│   ├── settings.tsx        # Settings screen
│   ├── new-session.tsx     # New session modal
│   └── notifications.tsx   # Notifications screen
├── src/
│   ├── api/                # OpenCode API client
│   │   └── client.ts
│   ├── components/
│   │   ├── chat/           # Chat-related components
│   │   └── ui/             # ShadCN-style UI components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── store/              # Zustand store
│   ├── styles/             # Global styles
│   └── types/              # TypeScript types
├── tailwind.config.js      # Tailwind/NativeWind config
└── app.json                # Expo configuration
```

## Key Components

### UI Components (ShadCN-style)

- `Button` - Customizable buttons with variants
- `Card` - Card components with header, content, footer
- `Input` / `TextArea` - Form inputs
- `Badge` - Status badges
- `Modal` / `AlertDialog` - Modal dialogs
- `Toast` - Toast notifications
- `Switch` - Toggle switches
- `Skeleton` - Loading skeletons
- `EmptyState` - Empty state placeholders

### Chat Components

- `ChatHeader` - Session info and navigation
- `ChatInput` - Message input with send/cancel
- `MessageBubble` - Message display with tool results
- `TodoList` - Task progress display
- `TypingIndicator` - Streaming indicator

## API Client

The app connects to OpenCode's REST API with SSE streaming:

```typescript
import { openCodeClient } from '@/api/client';

// Configure connection
openCodeClient.setConfig({
  serverUrl: 'http://localhost:4096',
  password: 'optional-password',
});

// Create session
const session = await openCodeClient.createSession('/path/to/project', 'build');

// Send message with streaming
await openCodeClient.sendMessage(sessionId, 'help me refactor', (event) => {
  if (event.type === 'message.part.updated') {
    // Handle streaming delta
  }
});

// Subscribe to real-time events
openCodeClient.subscribeToEvents(sessionId);
openCodeClient.addEventListener('message.updated', (message) => {
  // Handle message update
});
```

## State Management

Uses Zustand with persistent storage:

```typescript
import { useAppStore } from '@/store/app';

// Access state
const { sessions, currentSession, isStreaming } = useAppStore();

// Actions
const { createSession, sendMessage, setTheme } = useAppStore();
```

## Building for Production

```bash
# Build for Android
npm run build:android

# Build for iOS
npm run build:ios
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
