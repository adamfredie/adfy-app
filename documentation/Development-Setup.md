# Development Environment Setup Guide

## 🚀 Quick Start

This guide will help you set up the development environment for the Aduffy Learning platform. The application is built with React, TypeScript, and Tailwind CSS v4.

## 📋 Prerequisites

### Required Software
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher (comes with Node.js)
- **Git**: Latest version for version control
- **Modern Web Browser**: Chrome, Safari, Edge, or Firefox (Chrome recommended for voice features)

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **RAM**: Minimum 4GB, recommended 8GB+
- **Storage**: At least 1GB free space for dependencies
- **Internet Connection**: Required for package installation and AI features

## 🔧 Installation Steps

### 1. Verify Prerequisites

Check your Node.js and npm versions:
```bash
node --version  # Should be 18.0.0+
npm --version   # Should be 8.0.0+
```

If you need to install or update Node.js:
- **Windows/macOS**: Download from [nodejs.org](https://nodejs.org/)
- **Linux**: Use your package manager or download from nodejs.org
- **Using nvm** (recommended for managing multiple versions):
  ```bash
  # Install nvm (Linux/macOS)
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  
  # Install and use Node.js 18
  nvm install 18
  nvm use 18
  ```

### 2. Clone the Repository

```bash
# Clone the repository (replace with actual repository URL)
git clone https://github.com/your-org/aduffy-learning.git

# Navigate to project directory
cd aduffy-learning
```

### 3. Install Dependencies

```bash
# Install all project dependencies
npm install
```

This will install all required packages including:
- React 18 and TypeScript
- Tailwind CSS v4
- ShadCN UI components
- Lucide React icons
- Development tools and build system

### 4. Environment Configuration

Create environment configuration (if needed):
```bash
# Copy environment template (if exists)
cp .env.example .env.local
```

**Note**: Currently, the application uses local storage and doesn't require API keys or external services for core functionality.

### 5. Start Development Server

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173` (Vite default port).

## 🛠️ Development Tools Setup

### Recommended Code Editor: Visual Studio Code

#### Essential Extensions
Install these VS Code extensions for optimal development experience:

```bash
# Install VS Code extensions (if using VS Code CLI)
code --install-extension bradlc.vscode-tailwindcss
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-eslint
```

**Manual Installation**:
1. **Tailwind CSS IntelliSense**: Auto-completion for Tailwind classes
2. **TypeScript Importer**: Auto-import TypeScript modules
3. **Prettier**: Code formatting
4. **ESLint**: Code linting and error detection
5. **ES7+ React/Redux/React-Native**: React code snippets

#### VS Code Settings

Create `.vscode/settings.json` in your project root:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["clsx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"],
    ["className\\s*=\\s*[\"'`]([^\"'`]*)[\"'`]", "([a-zA-Z0-9\\-:]+)"]
  ]
}
```

### Browser Development Tools

#### Chrome DevTools Setup
1. **React Developer Tools**: Install from Chrome Web Store
2. **Redux DevTools**: For state debugging (if needed in future)
3. **Lighthouse**: For performance auditing (built into Chrome)

#### Voice Features Testing
- **Microphone access**: Ensure microphone permissions are granted
- **Speech recognition testing**: Test in Chrome/Safari for best results
- **Audio playback**: Verify system audio is working

## 📁 Project Structure Understanding

```
aduffy-learning/
├── App.tsx                 # Main application component
├── components/             # React components
│   ├── Dashboard.tsx      # Main dashboard
│   ├── Onboarding.tsx     # User onboarding flow
│   ├── StorytellingActivity.tsx # Primary learning activity
│   ├── Settings.tsx       # User settings
│   ├── Header.tsx         # Navigation header
│   └── ui/               # ShadCN UI components
├── hooks/                # Custom React hooks
│   ├── index.ts          # Hook exports
│   └── useVoiceInteraction.ts # Voice API integration
├── styles/               # Styling and themes
│   └── globals.css       # Tailwind v4 configuration
├── types/                # TypeScript type definitions
│   └── speech.d.ts       # Speech API types
├── documentation/        # Project documentation
└── design-files/         # Design specifications
```

### Key Files to Understand

1. **App.tsx**: Main application entry point with routing and state management
2. **components/StorytellingActivity.tsx**: Core learning activity with 5 steps
3. **hooks/useVoiceInteraction.ts**: Voice recognition and synthesis logic
4. **styles/globals.css**: Tailwind v4 theme with ADuffy Learning branding
5. **components/ui/**: ShadCN components for consistent UI

## 🎨 Styling & Theme Development

### Tailwind CSS v4 Configuration

The project uses Tailwind v4 with a custom theme. Key features:

#### Custom Color Palette
```css
/* ADuffy Learning Brand Colors */
--aduffy-yellow: #f9a825;    /* Primary brand color */
--aduffy-navy: #1a1a1a;      /* Text and accents */
--aduffy-teal: #17a2b8;      /* Secondary highlights */
--aduffy-orange: #fd7e14;    /* Activity differentiation */
```

#### Custom Utility Classes
```css
.aduffy-card { /* Custom card styling */ }
.aduffy-button { /* Primary button styling */ }
.aduffy-badge-primary { /* Badge components */ }
```

#### Theme Development Tips
1. **Use CSS variables**: All colors are defined as CSS custom properties
2. **Maintain consistency**: Use predefined color palette
3. **Test both themes**: Light and dark mode support
4. **Follow accessibility**: Ensure proper contrast ratios

### Component Development Guidelines

#### ShadCN Integration
```typescript
// Import ShadCN components
import { Button } from "./components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";

// Use with custom classes
<Button className="aduffy-button">
  Custom styled button
</Button>
```

#### Custom Component Patterns
```typescript
// Use consistent prop patterns
interface ComponentProps {
  onBack: () => void;
  userProfile?: OnboardingData | null;
  className?: string;
}

// Follow naming conventions
const MyComponent: React.FC<ComponentProps> = ({ onBack, userProfile, className }) => {
  // Component logic
};
```

## 🎤 Voice Features Development

### Testing Voice Integration

#### Local Testing Setup
1. **HTTPS requirement**: Voice APIs require secure context
   ```bash
   # For local HTTPS testing (if needed)
   npm install -g local-ssl-proxy
   local-ssl-proxy --source 3001 --target 5173
   ```

2. **Browser compatibility testing**:
   - **Chrome**: Full Web Speech API support
   - **Safari**: Full support on macOS/iOS
   - **Edge**: Full support
   - **Firefox**: Limited speech recognition

#### Voice API Development

**Speech Recognition Setup**:
```typescript
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';
```

**Speech Synthesis Setup**:
```typescript
const utterance = new SpeechSynthesisUtterance(text);
utterance.rate = 0.8;
utterance.pitch = 1.0;
window.speechSynthesis.speak(utterance);
```

### Testing Microphone Access

1. **Browser permissions**: Test permission prompts
2. **Error handling**: Test denied permissions
3. **Fallback behavior**: Ensure graceful degradation
4. **Audio quality**: Test in different environments

## 📦 Build & Deployment

### Development Commands

```bash
# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Code formatting
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

### Build Configuration

The project uses Vite for building. Key configurations:

#### Vite Configuration (vite.config.ts)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Production Build

```bash
# Build for production
npm run build

# Output will be in 'dist' directory
ls dist/
```

**Build outputs**:
- `dist/index.html`: Main HTML file
- `dist/assets/`: JavaScript, CSS, and other assets
- Optimized and minified for production

### Deployment Options

#### Static Hosting (Recommended)
- **Vercel**: Zero-config deployment
- **Netlify**: Drag-and-drop deployment
- **GitHub Pages**: Free hosting for public repos
- **Firebase Hosting**: Google's hosting platform

#### Deployment Steps (Vercel Example)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel

# Follow prompts for project configuration
```

## 🧪 Testing & Quality Assurance

### Manual Testing Checklist

#### Core Functionality
- [ ] Onboarding flow completion
- [ ] Dashboard navigation
- [ ] StorytellingActivity 5-step flow
- [ ] Voice recognition and synthesis
- [ ] Progress saving and resumption
- [ ] Settings management

#### Browser Compatibility
- [ ] Chrome (desktop and mobile)
- [ ] Safari (macOS/iOS)
- [ ] Edge (desktop)
- [ ] Firefox (basic functionality)

#### Voice Features
- [ ] Microphone permission handling
- [ ] Speech recognition accuracy
- [ ] Text-to-speech playback
- [ ] Error handling for unsupported browsers

#### Responsive Design
- [ ] Desktop layout (1920x1080)
- [ ] Tablet layout (768x1024)
- [ ] Mobile layout (375x667)
- [ ] Touch interactions

### Performance Testing

#### Lighthouse Audits
```bash
# Run Lighthouse audit
lighthouse http://localhost:5173 --output html --output-path ./lighthouse-report.html
```

**Target Scores**:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

#### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist
```

## 🔧 Troubleshooting

### Common Development Issues

#### 1. Node Modules Issues
```bash
# Clear npm cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

#### 2. TypeScript Errors
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Clear TypeScript cache
rm -rf node_modules/.cache
```

#### 3. Tailwind CSS Not Working
```bash
# Verify Tailwind configuration
npx tailwindcss --help

# Check CSS imports in globals.css
```

#### 4. Voice Features Not Working
- **Check browser support**: Use Chrome or Safari
- **Verify HTTPS**: Voice APIs require secure context
- **Test microphone**: Ensure system microphone works
- **Check permissions**: Browser microphone permissions

#### 5. Build Failures
```bash
# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint

# Clear build cache
rm -rf dist node_modules/.vite
```

### Getting Help

#### Resources
1. **React Documentation**: [reactjs.org](https://reactjs.org/)
2. **TypeScript Handbook**: [typescriptlang.org](https://www.typescriptlang.org/)
3. **Tailwind CSS Docs**: [tailwindcss.com](https://tailwindcss.com/)
4. **ShadCN UI**: [ui.shadcn.com](https://ui.shadcn.com/)
5. **Vite Documentation**: [vitejs.dev](https://vitejs.dev/)

#### Project-Specific Help
- Check `documentation/` folder for detailed guides
- Review `design-files/` for UI specifications
- Examine existing components for patterns and examples

## 🚀 Next Steps

After completing the setup:

1. **Explore the codebase**: Start with `App.tsx` and navigate through components
2. **Run the application**: Test all features including voice capabilities
3. **Make small changes**: Try modifying colors or text to understand the flow
4. **Read documentation**: Review all files in `documentation/` folder
5. **Test voice features**: Ensure microphone access and speech recognition work
6. **Practice development**: Try adding a simple feature or fixing a minor issue

## 📝 Development Best Practices

### Code Style
- **TypeScript**: Use strict typing, avoid `any` type
- **Components**: Use functional components with hooks
- **Naming**: Use descriptive, consistent naming conventions
- **Comments**: Document complex logic and voice API interactions

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make commits with descriptive messages
git commit -m "feat: add voice recognition error handling"

# Push and create pull request
git push origin feature/your-feature-name
```

### Performance Considerations
- **Memoization**: Use `useMemo` and `useCallback` for expensive operations
- **Lazy loading**: Consider code splitting for large components
- **Voice API**: Proper cleanup of speech recognition instances
- **Local storage**: Efficient data management and cleanup

---

**Ready to start developing? 🎉**

Run `npm run dev` and open `http://localhost:5173` to see the Aduffy Learning platform in action!

*Development Setup Guide Version: 1.0.0*
*Last Updated: December 2024*