# 🧠 DP Visualizer

**Interactive Dynamic Programming Learning Tool**

A modern, web-based application that helps students and developers understand dynamic programming concepts through interactive visualizations. Visualize recursion trees, dynamic programming tables, and step-by-step algorithm execution for popular DP problems.

![DP Visualizer](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.0-38B2AC?logo=tailwind-css)
![Vite](https://img.shields.io/badge/Vite-4.4.0-646CFF?logo=vite)

## ✨ Features

### 🎯 **Interactive Visualizations**
- **Recursion Tree Visualization**: See how recursive calls are made and how the tree grows
- **Dynamic Programming Table**: Watch the DP table fill up step-by-step
- **Real-time Animation**: Control the speed and step through the algorithm execution
- **Color-coded States**: Different colors for new computations, reused values, and completed nodes

### 📚 **Multiple Algorithm Approaches**
- **Recursive**: Pure recursive implementation
- **Memoization**: Top-down approach with caching
- **Tabulation**: Bottom-up approach with iteration

### 🎮 **Interactive Controls**
- **Play/Pause**: Control animation playback
- **Step Forward/Backward**: Navigate through each step manually
- **Speed Control**: Adjust animation speed (0.5x to 3x)
- **Reset**: Start over from the beginning

### 📊 **Supported Problems**
- **Fibonacci Sequence**: Classic DP problem with multiple approaches
- **House Robber**: 1D DP problem with optimization
- **Frog Jump with K Distances**: Advanced DP with constraints

### 🎨 **Modern UI/UX**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Clean, modern interface
- **Accessibility**: Keyboard navigation and screen reader support
- **Professional Typography**: Roboto Mono for headings, Inter for body text

## 🚀 Live Demo

**[Try the DP Visualizer Online](https://your-deployment-url.com)**

## 🛠️ Technology Stack

- **Frontend**: React 18.2.0
- **Build Tool**: Vite 4.4.0
- **Styling**: Tailwind CSS 3.3.0
- **Icons**: Custom SVG icons
- **Fonts**: Roboto Mono, Inter, Fira Code
- **Deployment**: Ready for Vercel, Netlify, or GitHub Pages

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/dp-visualizer.git
   cd dp-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎯 Usage

### Getting Started

1. **Select a Problem**: Choose from Fibonacci, House Robber, or Frog Jump
2. **Choose Algorithm**: Pick between Recursive, Memoization, or Tabulation
3. **Set Input**: Enter your test case (e.g., n=5 for Fibonacci)
4. **Start Visualization**: Click "Start Visualization" to begin
5. **Control Playback**: Use the animation controls to step through the algorithm

### Understanding the Visualizations

#### Recursion Tree
- **Nodes**: Each node represents a function call
- **Edges**: Show the relationship between parent and child calls
- **Colors**: 
  - 🟡 Yellow: Active computation
  - 🟢 Green: Completed with result
  - 🔵 Blue: Memoized (cached) result

#### Dynamic Programming Table
- **Rows**: Represent different subproblems
- **Columns**: Show the progression of the algorithm
- **Values**: Display computed results at each step

#### Step Log
- **Detailed Logging**: See exactly what happens at each step
- **Function Calls**: Track which functions are called
- **Results**: View returned values and cache hits

## 🏗️ Project Structure

```
dp-visualizer/
├── public/
│   ├── favicon.svg          # App icon
│   └── manifest.json        # PWA manifest
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   └── AppIcon.jsx      # Icon component
│   ├── pages/
│   │   ├── problem-selection-dashboard/
│   │   ├── algorithm-visualization-dashboard/
│   │   ├── house-robber-visualization-dashboard/
│   │   └── frog-jump-visualization-dashboard/
│   ├── styles/
│   │   ├── tailwind.css     # Tailwind configuration
│   │   └── index.css        # Global styles
│   └── App.jsx              # Main app component
├── package.json
└── README.md
```

## 🎨 Customization

### Adding New Problems

1. Create a new dashboard in `src/pages/`
2. Implement the algorithm simulation functions
3. Add visualization components
4. Update the problem selection page

### Styling

The project uses Tailwind CSS with custom design tokens:
- **Colors**: Primary blue (#1E40AF), success green, warning amber
- **Typography**: Roboto Mono for headings, Inter for body text
- **Spacing**: Consistent 4px grid system

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag the dist folder to Netlify
```

### GitHub Pages
```bash
npm run build
# Follow GitHub Pages setup instructions
```
