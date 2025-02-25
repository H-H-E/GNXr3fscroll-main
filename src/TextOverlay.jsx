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
    subtitle: "Cultural Defense & Legacy",
    description: "The journey begins where defaced murals symbolize contested cultural memory. Like the GNX, Kendrick's vehicle becomes a mobile archive protecting Black artistic expression from erasure."
  },
  {
    title: "Squabble Up",
    subtitle: "Mobilizing for Cultural Battle",
    description: "An aggressive stance preparing for confrontation. The track's military imagery transforms the GNX from status symbol to tactical vehicle for cultural defense and authentic expression."
  },
  {
    title: "Luther",
    subtitle: "Precision & Tenderness",
    description: "The clean profile reveals how technical excellence serves emotional expression. Like Luther Vandross's vocal mastery, the GNX demonstrates how controlled power enables movement across different cultural territories."
  },
  {
    title: "Man at the Garden",
    subtitle: "Achievement & Deserved Success",
    description: "A meditation on what success truly means. The powerful stance of the GNX represents not just material achievement but personal growth and cultural impact that transcends individual gain."
  },
  {
    title: "Hey Now",
    subtitle: "Navigating Multiple Spaces",
    description: "The reflective surface captures movement through physical, social, and cultural territories. Like the GNX's ability to traverse different environments, the track explores mobility across boundaries."
  },
  {
    title: "Reincarnated",
    subtitle: "Spiritual Transformation",
    description: "Viewed from above, we witness transformation and rebirth. The GNX becomes a vehicle for spiritual recursion, suggesting Kendrick as a soul reincarnated to address music's complex relationship with Black culture."
  },
  {
    title: "TV Off",
    subtitle: "Technical Precision & Raw Power",
    description: "Examining the mechanics of power through technical excellence. The track's exploration of military structure parallels the GNX's combination of engineering precision and raw force."
  },
  {
    title: "Dodger Blue",
    subtitle: "Territorial Authority",
    description: "Authentic movement through LA's geography and culture. The GNX framework here demonstrates how mastery of territory through authentic connection establishes cultural authority."
  },
  {
    title: "Peekaboo",
    subtitle: "Strategic Visibility",
    description: "Playful yet powerful, this angle explores surveillance as power. The track transforms the GNX's stealth capabilities into a meditation on controlling one's visibility in both physical and digital spaces."
  },
  {
    title: "Heart Pt. 6",
    subtitle: "Memory as Vehicle",
    description: "From this perspective, we see how memory becomes a vehicle for temporal navigation. The GNX framework illuminates movement through time, artistic development, and cultural preservation."
  },
  {
    title: "GNX",
    subtitle: "The Ultimate Framework",
    description: "The title track reveals the full meaning of the Grand National Experimental - a sophisticated framework for understanding movement, power, and authentic expression in contemporary culture."
  },
  {
    title: "Gloria",
    subtitle: "Love Letter to Hip-Hop",
    description: "Glory from this angle reveals the intimate relationship between artist and art. Using the metaphor of romance, the track explores Kendrick's complex bond with hip-hop as both companion and conveyance."
  },
  {
    title: "Loop Complete",
    subtitle: "Cultural Transcendence",
    description: "Our journey comes full circle, revealing the GNX as performance space, battle station, and escape route - just as hip-hop functions as entertainment, cultural weapon, and path to transcendence."
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