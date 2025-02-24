import { useStore } from './store'
import { useEffect, useState } from 'react'
import './styles.css'

export function Overlay() {
  const state = useStore()
  const [coords, setCoords] = useState({ 
    position: { x: 0, y: 0, z: 0 },
    target: { x: 0, y: 0, z: 0 }
  })

  useEffect(() => {
    setCoords({
      position: {
        x: state.currentCameraPosition.position[0],
        y: state.currentCameraPosition.position[1],
        z: state.currentCameraPosition.position[2]
      },
      target: {
        x: state.currentCameraPosition.target[0],
        y: state.currentCameraPosition.target[1],
        z: state.currentCameraPosition.target[2]
      }
    })
  }, [state.currentCameraPosition])

  return (
    <div className="diagnostics-overlay">
      <div className="info-box">
        <h3>Camera Diagnostics</h3>
        <p>Current Scene: {state.currentSection + 1} / {state.totalSections}</p>
        <p>Camera Position:</p>
        <ul>
          <li>X: {coords.position.x}</li>
          <li>Y: {coords.position.y}</li>
          <li>Z: {coords.position.z}</li>
        </ul>
        <p>Camera Target:</p>
        <ul>
          <li>X: {coords.target.x}</li>
          <li>Y: {coords.target.y}</li>
          <li>Z: {coords.target.z}</li>
        </ul>
        <p>Progress: {(state.sectionProgress * 100).toFixed(1)}%</p>
      </div>
    </div>
  )
}
