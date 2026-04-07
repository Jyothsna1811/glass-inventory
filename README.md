# Glass Inventory Management System

A mobile-friendly web application for managing glass inventory with local storage persistence.

## Features

- **Add/Remove** glass models with quantity tracking
- **Add Custom Variants** for new glass models
- **Overall List** with search functionality
- **Mobile Responsive** design with touch-friendly interface
- **Local Storage** persistence (data saved on device)

## Quick Start

### Option 1: GitHub Pages (Recommended)
1. Fork this repository
2. Go to Settings → Pages
3. Select "Deploy from a branch"
4. Choose main branch and save
5. Access at `https://[username].github.io/glass-inventory`

### Option 2: Local Development
```bash
python -m http.server 3000
```
Open http://localhost:3000 in browser

### Option 3: Mobile Access
- Connect to same WiFi as computer
- Access http://[computer-ip]:3000 on mobile browser

## Usage

1. **Add**: Select model and quantity to add
2. **Remove**: Select model and quantity to remove  
3. **Add Variant**: Create custom glass models
4. **Overall List**: View complete inventory with search

## Data Storage

- Inventory data is stored locally in browser
- Each device maintains separate inventory
- Data persists across browser sessions
- No backend required

## Keyboard Shortcuts

- `Ctrl+A`: Add modal
- `Ctrl+R`: Remove modal  
- `Ctrl+L`: List modal
- `Esc`: Close modal

## Technologies

- HTML5, CSS3, JavaScript
- Local Storage API
- Responsive Design
- No external dependencies
