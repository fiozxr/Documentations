# Android Task Manager

A fully functional Task Manager for Android with a Windows Task Manager-inspired interface. Monitor processes, track system performance, manage apps, and view device information - all in a sleek, dark-themed UI.

![Task Manager Preview](preview.png)

## Features

### 1. Processes Tab
- View all running processes with real-time CPU and memory usage
- Sort by name, PID, status, CPU, or memory
- Search and filter processes
- End tasks with one click
- Color-coded status indicators

### 2. Performance Tab
- **CPU Monitor**: Real-time utilization graph with core information
- **Memory Monitor**: RAM usage with visual breakdown
- **Network Monitor**: Network activity tracking
- **Battery Monitor**: Battery level and status
- Live updating charts (updates every second)

### 3. App Manager
- List and grid view modes
- Force stop apps
- Clear app data
- Uninstall apps
- View app memory and CPU usage

### 4. Device Info
- Device model and Android version
- Processor information
- RAM and storage details
- Screen resolution
- Battery status
- Storage breakdown visualization

## Tech Stack

- **React** + **TypeScript** - Modern UI framework
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Performance charts
- **Lucide React** - Icons
- **PWA** - Progressive Web App support

## Building with Acode

This app can be compiled into a native Android APK using **Acode** - an Android code editor. See [ACODE_COMPILATION_GUIDE.md](ACODE_COMPILATION_GUIDE.md) for detailed instructions.

### Quick Build Steps:

1. Copy the `dist/` folder to your Android device
2. Open **Acode** app
3. Use WebIDE → Build APK
4. Configure app name and icon
5. Build and install!

## Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Project Structure

```
src/
├── App.tsx          # Main application component
├── index.css        # Global styles
├── main.tsx         # Entry point
└── components/      # UI components

public/
├── manifest.json    # PWA manifest
├── sw.js            # Service worker
└── task-manager-icon.svg
```

## Screenshots

### Processes Tab
![Processes](screenshots/processes.png)

### Performance Tab
![Performance](screenshots/performance.png)

### App Manager
![App Manager](screenshots/app-manager.png)

### Device Info
![Device Info](screenshots/device-info.png)

## Customization

### Changing Colors
Edit `src/index.css` and modify the CSS variables:

```css
:root {
  --primary: #0078d4;        /* Windows blue */
  --background: #0f0f0f;     /* Dark background */
  --card: #1a1a1a;           /* Card background */
  --border: #3d3d3d;         /* Border color */
}
```

### Adding New Features

The app uses a tab-based architecture. To add a new tab:

1. Add a new case in the `activeTab` state switch
2. Create a new component for your tab content
3. Add a tab button in the tabs section

## Native Android Integration

To access real system data (requires native build):

```javascript
// Check if running in Android WebView
if (window.Android) {
    const info = window.Android.getSystemInfo();
    console.log(info);
}
```

See the compilation guide for implementing the Android interface.

## Permissions

For full functionality, the app may request:
- `KILL_BACKGROUND_PROCESSES` - To stop background apps
- `GET_TASKS` - To list running processes
- `PACKAGE_USAGE_STATS` - For app usage statistics

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Samsung Internet 14+

## License

MIT License - Feel free to use and modify!

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## Acknowledgments

- Inspired by Windows Task Manager
- Icons by [Lucide](https://lucide.dev/)
- Charts by [Recharts](https://recharts.org/)

---

**Built with ❤️ for Android power users**
