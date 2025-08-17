# SnapFeed Component

A modern, mobile-first Snap feed component that integrates with the existing SnapShare backend. This component provides an Instagram-style feed with smooth animations and responsive design.

## Features

- 📱 Mobile-first responsive design
- 🔒 JWT authentication integration
- 🖼️ Beautiful card-based UI for snaps
- ⏱️ Relative timestamps (e.g., "2h ago")
- 📊 Shows remaining daily uploads
- 🔄 Real-time updates via WebSocket
- ♿ Accessible and keyboard-navigable
- 🎨 Customizable styling with CSS variables

## Installation

1. Copy the following files to your project:
   - `/public/js/snapfeed/SnapFeed.js` - The main component
   - `/public/css/snapfeed.css` - Styling (or use your own)

2. Include the CSS in your HTML:
   ```html
   <link rel="stylesheet" href="/css/snapfeed.css">
   ```

3. Include the JavaScript file (after the DOM is ready):
   ```html
   <script src="/js/snapfeed/SnapFeed.js"></script>
   ```

## Usage

### Basic Usage

Add a container element with a unique ID where you want the feed to appear:

```html
<div id="my-snap-feed" data-snapfeed></div>
```

The component will automatically initialize and handle authentication and feed loading.

### Manual Initialization

For more control, you can initialize the component manually:

```javascript
// After the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const feed = new SnapFeed({
    containerId: 'my-snap-feed',  // ID of the container element
    apiBaseUrl: 'http://localhost:3000',  // Optional: your API base URL
    authToken: 'your-jwt-token'  // Optional: if not provided, will check localStorage
  });
});
```

### Authentication

The component automatically handles authentication by:
1. Looking for a JWT token in `localStorage` under the `user` key
2. Redirecting to the login page if not authenticated
3. Including the token in API requests

Make sure to set the user data in `localStorage` after login:

```javascript
localStorage.setItem('user', JSON.stringify({
  token: 'your-jwt-token',
  username: 'username',
  id: 'user-id',
  remainingUploads: 3
}));
```

## API Integration

The component uses the following API endpoints:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/feed` | GET | Get feed data (new and viewed snaps) |
| `/api/snap/view` | POST | Mark a snap as viewed |
| `/api/upload` | POST | Upload a new snap |

## Styling

Customize the appearance using CSS variables in your stylesheet:

```css
:root {
  --primary-color: #0095f6;
  --danger-color: #ed4956;
  --text-primary: #262626;
  --text-secondary: #8e8e8e;
  --bg-color: #fafafa;
  --card-bg: #ffffff;
  --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  --border-radius: 12px;
}
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 12+)
- Chrome for Android

## Demo

A demo is available at `/public/snapfeed-demo.html` which demonstrates the component's functionality.

## License

MIT
