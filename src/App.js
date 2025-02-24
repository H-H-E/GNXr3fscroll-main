import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, MeshTransmissionMaterial, ContactShadows, Environment, PerspectiveCamera, OrbitControls } from '@react-three/drei'
import { easing } from 'maath'
import { useStore } from './store'
import { Model } from './gnx'

export default function App() {
  const store = useStore()
  const [orbitEnabled, setOrbitEnabled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!orbitEnabled) {
        const scrollY = window.scrollY
        const vh = window.innerHeight
        const maxScroll = vh * (store.totalSections - 1)
        
        // Reset to top when reaching the end
        if (scrollY >= maxScroll) {
          window.scrollTo({
            top: 0,
            behavior: 'auto'
          })
          store.currentSection = 0
          store.sectionProgress = 0
          return
        }
        
        const currentSection = Math.floor(scrollY / vh)
        const progress = (scrollY % vh) / vh
        
        store.currentSection = currentSection
        store.sectionProgress = progress
      }
    }

    const handleKeyPress = (e) => {
      if (e.key === 'o') {
        setOrbitEnabled(prev => !prev)
      }
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [orbitEnabled])

  return (
    <Canvas eventSource={document.getElementById('root')} eventPrefix="client">
      <Scene orbitEnabled={orbitEnabled} autoRotate={false}/>
      <ambientLight intensity={0.7} />
      <spotLight intensity={0.7} angle={0.15} penumbra={1} position={[15, 20, -5]} castShadow />
      <Environment preset="city" background blur={1} />
      <ContactShadows resolution={512} position={[0, -0.8, 0]} opacity={1} scale={20} blur={2} far={0.8} />
      <Car rotation={[0, 0, 0]} scale={2.5} position={[0, -0.5, 0]} />
    </Canvas>
  )
}

function Scene({ orbitEnabled }) {
  const { camera } = useThree()
  const store = useStore()
  const moveSpeed = 0.5 // Speed of WASD movement
  
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
      
      // Interpolate between current and next position based on scroll progress
      const targetPosition = [
        currentPos[0] + (nextPos[0] - currentPos[0]) * store.sectionProgress,
        currentPos[1] + (nextPos[1] - currentPos[1]) * store.sectionProgress,
        currentPos[2] + (nextPos[2] - currentPos[2]) * store.sectionProgress
      ]
      
      const targetLookAt = [
        currentTarget[0] + (nextTarget[0] - currentTarget[0]) * store.sectionProgress,
        currentTarget[1] + (nextTarget[1] - currentTarget[1]) * store.sectionProgress,
        currentTarget[2] + (nextTarget[2] - currentTarget[2]) * store.sectionProgress
      ]
      
      // Use a faster damping for smoother transitions
      easing.damp3(camera.position, targetPosition, 0.35, delta)
      camera.lookAt(...targetLookAt)

      // Update store with current camera position and target for non-orbit mode
      store.currentCameraPosition = {
        position: [
          Number(camera.position.x.toFixed(2)),
          Number(camera.position.y.toFixed(2)),
          Number(camera.position.z.toFixed(2))
        ],
        target: targetLookAt.map(v => Number(v.toFixed(2)))
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
  
  return orbitEnabled ? (
    <>
      <OrbitControls makeDefault />
      <CameraHelper />
    </>
  ) : null
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
