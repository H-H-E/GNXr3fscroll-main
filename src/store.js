import { proxy } from 'valtio'
import { useProxy } from 'valtio/utils'

const cameraPositions = [
  {
    // 1. "Wacced Out Murals" - License Plate View (Loop Start)
    position: [9.58, 1.63, -4.11],
    target: [1.71, 0.11, -4.26]
  },
  {
    // 2. "Squabble Up" - Front Left Intimidation
   
    position: [13.57, 2.4, -4.03],
    target: [1.71, 0.11, -4.26]
  },
  {
    // 3. "Luther" - Side Profile (Clean & Classic)
    position: [2.44, 2.68, 11.21],
    target: [2.23, 2.06, 4.37]
  },
  {
    // 4. "Man at the Garden" - Rear Quarter Power Stance
    position: [11.39, 2.89, -0.28],
    target: [1.01, 0.49, -2.65]
  },
  {
    // 5. "Hey Now" - Black Mirror (Reflective Hood Shot)
    position: [-5.78, 1.45, -1.59],
    target: [0.96, 0.2, -1.01]

    
    
  },
  {
    // 6. "Reincarnated" - Ghost Rider (Pure Rear View)
    position: [13.57, 7, -4.03],
    target: [1.71, 0.11, -4.26]
  },
  {
    // 7. "TV Off" - High-Angle Rear Lookdown
    position: [10.05, 6.81, -4.17],
    target: [1.05, 3.53, -4.5]
  },
  {
    // 8. "Dodger Blue" - Rear Three-Quarter Aerial Perspective
    position: [16.18, 9.35, -15.41],
    target: [1.12, 3.64, -9.07]
  },
  {
    // 9. "Peekaboo" - Front Right Power Stance
    position: [-4.8, 3.26, 3.24],
    target: [3.48, 0.69, -6.97]
  },
  {
    // 10. "Heart Pt. 6" - Low Front Perspective
    position: [4.08, 23.05, -6.96],
    target: [3.48, 0.69, -6.97]
    
  },
  {
    // 11. "GNX" - Overhead Bird's-Eye View
    position: [-8.61, 2.98, -12.26],
    target: [3.48, 0.69, -6.97]
    
  },
  {
    // 12. "Gloria" - Rear Quarter View (Left)
    position: [-6, 12.5, -7],
    target: [-2, 1.5, -2]
  },
  {
    // 13. Loop Back - License Plate View (Loop End)
    position: [9.58, 1.63, -4.11],
    target: [1.71, 0.11, -4.26]
  }
];

const store = proxy({
  open: false,
  currentSection: 0,
  sectionProgress: 0,
  totalSections: cameraPositions.length,
  currentCameraPosition: {
    position: [0, 0, 0],
    target: [0, 0, 0]
  },
  cameraPositions,
  // Scroll configuration
  scrollConfig: {
    // Time to wait after scrolling before snapping (in milliseconds)
    snapDelay: 300,
    // Smoothness of the scroll-to-section animation ('auto', 'smooth')
    scrollBehavior: 'smooth',
    // Whether to enable snap scrolling
    enableSnapping: true,
    // Threshold for partial scrolls (0 to 1) - if progress exceeds this, snap to next section
    snapThreshold: 0.1,
    // Easing factor for manual scrolling (higher = more resistance)
    scrollResistance: 0.1
  },
  // Camera transition configuration
  cameraConfig: {
    // Damping factor for camera position transitions (lower = smoother but slower)
    positionDamping: 0.15,
    // Damping factor for camera target/lookAt transitions
    targetDamping: 0.2,
    // Whether to enable smooth camera transitions
    enableSmoothing: true,
    // Maximum speed for camera position changes (prevents too rapid movement)
    maxPositionSpeed: 0.5,
    // Additional easing for transitions between sections (0-1, higher = more easing)
    transitionEasing: 0.3
  }
})

export const useStore = () => useProxy(store)