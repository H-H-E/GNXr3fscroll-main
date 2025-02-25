import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from './store'

const container = {
  hidden: { opacity: 0, height: 0, transition: { staggerChildren: 0.05 } },
  show: {
    opacity: 1,
    height: 'auto',
    transition: { when: 'beforeChildren', staggerChildren: 0.05 }
  }
}

const item = {
  hidden: { opacity: 0, y: '100%' },
  show: { opacity: 1, y: 0 }
}

// Scene content for each camera position
const sceneContent = [
  {
    title: "Wacced Out Murals",
    subtitle: "License Plate View",
    description: "The journey begins with a close-up of the iconic license plate, setting the stage for what's to come."
  },
  {
    title: "Squabble Up",
    subtitle: "Front Left Intimidation",
    description: "The aggressive stance from the front left reveals the car's intimidating presence on the road."
  },
  {
    title: "Luther",
    subtitle: "Side Profile",
    description: "Clean and classic side profile that showcases the timeless lines of this masterpiece."
  },
  {
    title: "Man at the Garden",
    subtitle: "Rear Quarter Power Stance",
    description: "From this angle, the car exudes power and performance, ready to launch forward at any moment."
  },
  {
    title: "Hey Now",
    subtitle: "Black Mirror",
    description: "The reflective hood shot captures both the car and the world around it, blending reality with automotive art."
  },
  {
    title: "Reincarnated",
    subtitle: "Ghost Rider",
    description: "The pure rear view reveals the spirit of the machine, reborn for a new generation of drivers."
  },
  {
    title: "TV Off",
    subtitle: "High-Angle Rear Lookdown",
    description: "From above, we see the deliberate design choices that make this vehicle stand apart from the rest."
  },
  {
    title: "Dodger Blue",
    subtitle: "Rear Three-Quarter Aerial",
    description: "An aerial perspective that highlights the car's form against the urban landscape below."
  },
  {
    title: "Peekaboo",
    subtitle: "Front Right Power Stance",
    description: "A playful yet powerful angle that reveals the car's personality and presence."
  },
  {
    title: "Heart Pt. 6",
    subtitle: "Low Front Perspective",
    description: "From below, we see the beating heart of this mechanical marvel, ready to roar to life."
  },
  {
    title: "GNX",
    subtitle: "Overhead Bird's-Eye View",
    description: "The comprehensive overview reveals the perfect proportions and deliberate design of the GNX."
  },
  {
    title: "Gloria",
    subtitle: "Rear Quarter View",
    description: "Glory from the left rear quarter, showcasing the muscular stance and classic lines."
  },
  {
    title: "Loop Complete",
    subtitle: "Back to the Beginning",
    description: "Our journey comes full circle, returning to where we started but forever changed by what we've experienced."
  }
];

function SceneContent({ scene, show }) {
  return (
    <motion.div 
      className="scene-content"
      variants={container} 
      initial="hidden" 
      animate={show ? 'show' : 'hidden'}
    >
      <motion.h1 className="scene-title" variants={item}>
        {scene.title}
      </motion.h1>
      <motion.h3 className="scene-subtitle" variants={item}>
        {scene.subtitle}
      </motion.h3>
      <motion.p className="scene-description" variants={item}>
        {scene.description}
      </motion.p>
    </motion.div>
  )
}

export function TextOverlay() {
  const state = useStore()
  const currentScene = sceneContent[state.currentSection]
  
  return (
    <div className="text-overlay">
      <AnimatePresence mode="wait">
        <SceneContent 
          key={state.currentSection} 
          scene={currentScene} 
          show={true} 
        />
      </AnimatePresence>
    </div>
  )
} 