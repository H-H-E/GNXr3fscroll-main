import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial, ContactShadows, Environment, PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { easing } from 'maath'
import { useStore } from './store'
import { Model } from './gnx'
import { Overlay } from './Overlay'
import { TextOverlay } from './TextOverlay'

// Improved debounce helper function
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Easing functions
const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
const easeInOutQuad = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// Progress bar component
function ProgressBar({ currentSection, totalSections, progress }) {
  const percentage = ((currentSection + progress) / (totalSections - 1)) * 100;
  
  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
    </div>
  );
}

// Scroll indicator component
function ScrollIndicator({ currentSection, totalSections }) {
  const handleClick = (index) => {
    window.scrollTo({
      top: index * window.innerHeight,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className="scroll-indicator">
      {Array.from({ length: totalSections }).map((_, index) => (
        <div 
          key={index} 
          className={`indicator-dot ${index === currentSection ? 'active' : ''}`}
          onClick={() => handleClick(index)}
        />
      ))}
    </div>
  );
}

export default function App() {
  const store = useStore()
  const [orbitEnabled, setOrbitEnabled] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeout = useRef(null)
  const lastScrollY = useRef(0)
  const scrollDirection = useRef(0)
  const isLooping = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!orbitEnabled && !isLooping.current) {
        setIsScrolling(true)
        const scrollY = window.scrollY
        const vh = window.innerHeight
        const maxScroll = vh * (store.totalSections - 1)
        
        // Determine scroll direction
        scrollDirection.current = scrollY > lastScrollY.current ? 1 : -1
        lastScrollY.current = scrollY
        
        // Improved loop detection with buffer zone for smoother experience
        // This will trigger the loop when we're close to the end (within 20px)
        if (scrollY >= maxScroll - 20) {
          isLooping.current = true
          
          // First, update store to be at the last section with 100% progress
          store.currentSection = store.totalSections - 1
          store.sectionProgress = 1
          
          // After a brief delay, smoothly reset to first section
          setTimeout(() => {
            window.scrollTo({
              top: 0,
              behavior: 'auto' // Use 'auto' for an instant jump back to start
            })
            
            // Update store values for first section
            store.currentSection = 0
            store.sectionProgress = 0
            
            // Allow a small delay before re-enabling scroll handling
            setTimeout(() => {
              isLooping.current = false
            }, 50)
          }, 100)
          
          return
        }
        
        // Handle regular scrolling when not at the end
        const currentSection = Math.floor(scrollY / vh)
        const progress = (scrollY % vh) / vh
        
        store.currentSection = currentSection
        store.sectionProgress = progress

        // Enhanced snapping logic
        if (store.scrollConfig.enableSnapping && !isLooping.current) {
          if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
          
          scrollTimeout.current = setTimeout(() => {
            setIsScrolling(false)
            
            // Only snap if we're not in the middle of a loop
            if (!isLooping.current) {
              // Determine target section based on progress and direction
              let targetSection = currentSection
              
              // If we've scrolled more than the threshold toward the next section, go there
              if (progress > (1 - store.scrollConfig.snapThreshold)) {
                targetSection = Math.min(currentSection + 1, store.totalSections - 1)
              } 
              // If we've scrolled less than the threshold from the current section, stay here
              else if (progress < store.scrollConfig.snapThreshold) {
                targetSection = currentSection
              } 
              // In the middle zone, use scroll direction to determine target
              else {
                if (scrollDirection.current > 0 && progress > 0.5) {
                  targetSection = Math.min(currentSection + 1, store.totalSections - 1)
                } else if (scrollDirection.current < 0 && progress < 0.5) {
                  targetSection = currentSection
                } else {
                  // Default to closest section
                  targetSection = Math.round(scrollY / vh)
                }
              }
              
              // Smooth scroll to target section
              window.scrollTo({
                top: targetSection * vh,
                behavior: store.scrollConfig.scrollBehavior
              })
            }
          }, store.scrollConfig.snapDelay)
        }
      }
    }

    // Add wheel event handler to detect when user is at the end and trying to scroll more
    const handleWheel = (e) => {
      if (!orbitEnabled && !isLooping.current) {
        const scrollY = window.scrollY
        const vh = window.innerHeight
        const maxScroll = vh * (store.totalSections - 1)
        
        // If we're at the last section and user is trying to scroll down further
        if (scrollY >= maxScroll - 50 && e.deltaY > 0) {
          // Prevent default to avoid bouncy scrolling on some browsers
          e.preventDefault()
          
          // Trigger the loop manually
          isLooping.current = true
          
          // First, update store to be at the last section with 100% progress
          store.currentSection = store.totalSections - 1
          store.sectionProgress = 1
          
          // After a brief delay, smoothly reset to first section
          setTimeout(() => {
            window.scrollTo({
              top: 0,
              behavior: 'auto' // Use 'auto' for an instant jump back to start
            })
            
            // Update store values for first section
            store.currentSection = 0
            store.sectionProgress = 0
            
            // Allow a small delay before re-enabling scroll handling
            setTimeout(() => {
              isLooping.current = false
            }, 50)
          }, 100)
        }
      }
    }

    const handleKeyPress = (e) => {
      if (e.key === 'o') {
        setOrbitEnabled(prev => !prev)
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyPress)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyPress)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
    }
  }, [orbitEnabled])

  return (
    <>
      <div className="canvas-container">
        <Canvas eventSource={document.getElementById('root')} eventPrefix="client">
          <Scene orbitEnabled={orbitEnabled} />
        </Canvas>
      </div>
      
      <Overlay />
      <TextOverlay />
      
      {/* Add progress bar at the top */}
      <ProgressBar 
        currentSection={store.currentSection} 
        totalSections={store.totalSections}
        progress={store.sectionProgress}
      />
      
      {/* Add scroll indicators on the right */}
      <ScrollIndicator 
        currentSection={store.currentSection} 
        totalSections={store.totalSections} 
      />
      
      <div className="scroll-container">
        {Array.from({ length: store.totalSections }).map((_, index) => (
          <div key={index} className="section"></div>
        ))}
      </div>
    </>
  )
}

function Scene({ orbitEnabled }) {
  const { camera } = useThree()
  const store = useStore()
  const moveSpeed = 0.5 // Speed of WASD movement
  const cameraTarget = useRef([0, 0, 0])
  const lastPositions = useRef({
    camera: [0, 0, 0],
    target: [0, 0, 0]
  })
  const velocities = useRef({
    camera: [0, 0, 0],
    target: [0, 0, 0]
  })
  const isTransitioning = useRef(false)
  const transitionProgress = useRef(0)
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!orbitEnabled) return
      
      switch(e.key.toLowerCase()) {
        case 'w':
          camera.position.z -= moveSpeed
          break
        case 's':
          camera.position.z += moveSpeed
          break
        case 'a':
          camera.position.x -= moveSpeed
          break
        case 'd':
          camera.position.x += moveSpeed
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [camera, orbitEnabled])
  
  useFrame((state, delta) => {
    if (!orbitEnabled) {
      const currentPos = store.cameraPositions[store.currentSection].position
      const currentTarget = store.cameraPositions[store.currentSection].target
      
      // Get next section, handling the loop back to start
      const nextSection = store.currentSection === store.totalSections - 1 
        ? 0 
        : store.currentSection + 1
      const nextPos = store.cameraPositions[nextSection].position
      const nextTarget = store.cameraPositions[nextSection].target
      
      // Special handling for transition between last and first section
      // This creates a smoother loop effect when going from end back to beginning
      if (store.currentSection === 0 && store.sectionProgress === 0 && 
          lastPositions.current.camera[0] !== 0) {
        if (!isTransitioning.current) {
          // Start a smooth transition
          isTransitioning.current = true
          transitionProgress.current = 0
        }
        
        // Update transition progress
        transitionProgress.current += delta * 1.5
        if (transitionProgress.current > 1) {
          transitionProgress.current = 1
          isTransitioning.current = false
        }
        
        // Apply easing to the transition
        const t = easeOutCubic(transitionProgress.current)
        
        // Interpolate from the last position to the first section position
        const targetPosition = [
          lastPositions.current.camera[0] * (1 - t) + currentPos[0] * t,
          lastPositions.current.camera[1] * (1 - t) + currentPos[1] * t,
          lastPositions.current.camera[2] * (1 - t) + currentPos[2] * t
        ]
        
        const targetLookAt = [
          lastPositions.current.target[0] * (1 - t) + currentTarget[0] * t,
          lastPositions.current.target[1] * (1 - t) + currentTarget[1] * t,
          lastPositions.current.target[2] * (1 - t) + currentTarget[2] * t
        ]
        
        // Smoothly move to the target position
        easing.damp3(camera.position, targetPosition, 0.3, delta)
        easing.damp3(cameraTarget.current, targetLookAt, 0.3, delta)
        camera.lookAt(...cameraTarget.current)
      } 
      else {
        // Apply easing curve to the regular progress value
        const easedProgress = easeOutCubic(store.sectionProgress)
        
        // Interpolate between current and next position based on scroll progress with easing
        const targetPosition = [
          currentPos[0] + (nextPos[0] - currentPos[0]) * easedProgress,
          currentPos[1] + (nextPos[1] - currentPos[1]) * easedProgress,
          currentPos[2] + (nextPos[2] - currentPos[2]) * easedProgress
        ]
        
        const targetLookAt = [
          currentTarget[0] + (nextTarget[0] - currentTarget[0]) * easedProgress,
          currentTarget[1] + (nextTarget[1] - currentTarget[1]) * easedProgress,
          currentTarget[2] + (nextTarget[2] - currentTarget[2]) * easedProgress
        ]
        
        if (store.cameraConfig.enableSmoothing) {
          // Calculate current position of camera as array
          const currentCameraPos = [camera.position.x, camera.position.y, camera.position.z]
          
          // Update velocity with some added damping for stability
          for (let i = 0; i < 3; i++) {
            // Calculate raw velocity (difference between target and current)
            const rawCameraVelocity = (targetPosition[i] - currentCameraPos[i]) / delta
            const rawTargetVelocity = (targetLookAt[i] - cameraTarget.current[i]) / delta
            
            // Apply max speed limit if needed (prevents too rapid camera movement)
            velocities.current.camera[i] = Math.abs(rawCameraVelocity) > store.cameraConfig.maxPositionSpeed
              ? Math.sign(rawCameraVelocity) * store.cameraConfig.maxPositionSpeed
              : rawCameraVelocity
              
            velocities.current.target[i] = Math.abs(rawTargetVelocity) > store.cameraConfig.maxPositionSpeed
              ? Math.sign(rawTargetVelocity) * store.cameraConfig.maxPositionSpeed
              : rawTargetVelocity
          }
          
          // Use the improved configuration values with easing for smoother transitions
          if (Math.abs(store.sectionProgress - 0.5) < 0.1) {
            // Extra smoothing at the midpoint of transitions
            easing.damp3(camera.position, targetPosition, store.cameraConfig.positionDamping * 1.5, delta)
            easing.damp3(cameraTarget.current, targetLookAt, store.cameraConfig.targetDamping * 1.5, delta)
          } else {
            // Normal smoothing
            easing.damp3(camera.position, targetPosition, store.cameraConfig.positionDamping, delta)
            easing.damp3(cameraTarget.current, targetLookAt, store.cameraConfig.targetDamping, delta)
          }
          
          camera.lookAt(...cameraTarget.current)
        } else {
          // Instant camera updates without smoothing
          camera.position.set(...targetPosition)
          cameraTarget.current = targetLookAt
          camera.lookAt(...targetLookAt)
        }
      }
      
      // Save last positions for next frame velocity calculations and transition handling
      lastPositions.current.camera = [camera.position.x, camera.position.y, camera.position.z]
      lastPositions.current.target = [...cameraTarget.current]

      // Update store with current camera position and target for non-orbit mode
      store.currentCameraPosition = {
        position: [
          Number(camera.position.x.toFixed(2)),
          Number(camera.position.y.toFixed(2)),
          Number(camera.position.z.toFixed(2))
        ],
        target: cameraTarget.current.map(v => Number(v.toFixed(2)))
      }
    } else {
      // Update store with current camera position and target for orbit mode
      store.currentCameraPosition = {
        position: [
          Number(camera.position.x.toFixed(2)),
          Number(camera.position.y.toFixed(2)),
          Number(camera.position.z.toFixed(2))
        ],
        target: [
          Number(state.controls?.target?.x.toFixed(2) || 0),
          Number(state.controls?.target?.y.toFixed(2) || 0),
          Number(state.controls?.target?.z.toFixed(2) || 0)
        ]
      }
    }
  })
  
  return (
    <>
      {orbitEnabled ? (
        <>
          <OrbitControls makeDefault />
          <CameraHelper />
        </>
      ) : null}
      
      <ambientLight intensity={0.7} />
      <spotLight intensity={0.7} angle={0.15} penumbra={1} position={[15, 20, -5]} castShadow />
      <Environment preset="city" background blur={1} />
      <ContactShadows resolution={512} position={[0, -0.8, 0]} opacity={1} scale={20} blur={2} far={0.8} />
      <Model rotation={[0, 0, 0]} scale={2.5} position={[0, -0.5, 0]} />
    </>
  )
}

function CameraHelper() {
  const { camera } = useThree()
  
  useEffect(() => {
    const logPosition = () => {
      console.log('Camera Position:', {
        position: [
          Number(camera.position.x.toFixed(2)),
          Number(camera.position.y.toFixed(2)),
          Number(camera.position.z.toFixed(2))
        ],
        target: [
          Number(camera.target?.x.toFixed(2) || 0),
          Number(camera.target?.y.toFixed(2) || 0),
          Number(camera.target?.z.toFixed(2) || 0)
        ]
      })
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'p') logPosition()
    })

    return () => {
      window.removeEventListener('keydown', (e) => {
        if (e.key === 'p') logPosition()
      })
    }
  }, [camera])

  return null
}

function Car(props) {
  const ref = useRef()
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
   // ref.current.rotation.set(0, Math.PI + Math.sin(t / 16) / 8, 0)
    //ref.current.position.y = (0.1 + Math.cos(t / 4)) / 40
  })

  return (
    <group ref={ref} {...props}>
      <Model />
    </group>
  )
}

useGLTF.preload('/1987_buick_grand_national_regal_gnx-transformed.glb')
