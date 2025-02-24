import { createRoot } from 'react-dom/client'
import './styles.css'
import App from './App'
import { Overlay } from './Overlay'
import { useStore } from './store'

// Create sections for scrolling
const ScrollContainer = () => {
  const store = useStore()
  return (
    <div className="scroll-container">
      {Array.from({ length: store.totalSections }, (_, i) => (
        <div key={i} className="section">
          <div className="section-marker">{i + 1}/{store.totalSections}</div>
        </div>
      ))}
    </div>
  )
}

createRoot(document.getElementById('root')).render(
  <>
    <div className="canvas-container">
      <App />
    </div>
    <div className="overlay-container">
      <Overlay />
    </div>
    <ScrollContainer />
  </>
)
