# Create a new directory and navigate into it
mkdir hangman-game
cd hangman-game

# Initialize a new Next.js project with TypeScript
npx create-next-app@latest . --typescript --tailwind --eslint

# Install required dependencies
npm install lucide-react @radix-ui/react-alert-dialog @radix-ui/react-slot class-variance-authority clsx tailwind-merge
# npx shadcn@latest init
# npx shadcn@latest add button
# Install shadcn/ui CLI tool
npx shadcn@latest init

# When prompted, select these options:
# Style: Default
# Base Color: Slate
# CSS Variables: Yes
# React Server Components: Yes
# Tailwind CSS Class Sorting: Yes
# Components Directory: @/components
# Utilities Directory: @/lib/utils
# Color CSS Variables: Yes

# Install required shadcn/ui components
npx shadcn@latest add alert
npx shadcn@latest add button
npx shadcn@latest add card

# Create necessary directories
mkdir -p src/components/game

# Update tailwind.config.js to include animation classes
cat > tailwind.config.js << EOL
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages//*.{ts,tsx}',
    './components//*.{ts,tsx}',
    './app//*.{ts,tsx}',
    './src//*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "bounce-in": {
          "0%": { 
            opacity: "0",
            transform: "translateY(-10px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          },
        }
      },
      animation: {
        "bounce-in": "bounce-in 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
}
EOL

# Create the game component file
mkdir -p src/app
cat > src/app/page.tsx << EOL
import HangmanGame from '../components/game/HangmanGame';

export default function Home() {
  return (
    <main>
      <HangmanGame />
    </main>
  );
}
EOL

# Create the main game component file
cat > src/components/game/HangmanGame.tsx << EOL
// Copy the React component code from the previous artifact here
EOL