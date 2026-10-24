import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import FreeRoamingControls from './components/FreeRoamingControls'
import IndoorScene from './components/IndoorScene'
import './App.css'

export default function App() {
  const [isLocked, setIsLocked] = useState(false)
  const [coordinates, setCoordinates] = useState({ x: '0.00', y: '1.60', z: '5.00' })
  const [pois, setPois] = useState([
    { name: 'Entrance Hall', x: 0.0, y: 1.6, z: 7.0 },
    { name: 'Workstation Alpha', x: -3.0, y: 1.6, z: -3.0 },
    { name: 'Workstation Beta', x: 3.0, y: 1.6, z: -3.0 },
    { name: 'Meeting Hub', x: 0.0, y: 1.6, z: 2.0 },
  ])
  const [activePoi, setActivePoi] = useState('')

  const handleAddPoi = () => {
    if (!activePoi.trim()) return
    setPois((prev) => [
      ...prev,
      {
        name: activePoi.trim(),
        x: parseFloat(coordinates.x),
        y: parseFloat(coordinates.y),
        z: parseFloat(coordinates.z),
      },
    ])
    setActivePoi('')
  }

  return (
    <div className="viewer-container">
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [0, 1.6, 6], fov: 75 }}
        shadows
        gl={{ antialias: true }}
      >
        <FreeRoamingControls
          isLocked={isLocked}
          setIsLocked={setIsLocked}
          onPositionUpdate={setCoordinates}
        />
        <IndoorScene />
      </Canvas>

      {/* Crosshair when in free-roaming mode */}
      {isLocked && <div className="crosshair">+</div>}

      {/* Click-to-Enter Overlay */}
      {!isLocked && (
        <div className="overlay" onClick={() => document.querySelector('canvas')?.requestPointerLock()}>
          <div className="modal">
            <h1>Namma Space — 3D Digital Twin Viewer</h1>
            <p className="subtitle">Techfest IIT Bombay • Free-Roaming Proof of Concept</p>
            <div className="instructions">
              <div className="badge">Click anywhere to start Free-Roaming</div>
              <ul className="keys-list">
                <li><span>W / A / S / D</span> Move Forward / Left / Backward / Right</li>
                <li><span>Mouse</span> Look Around 360°</li>
                <li><span>Shift</span> Sprint Boost</li>
                <li><span>Space / E</span> Ascend / Fly Up</li>
                <li><span>Ctrl / Q</span> Descend</li>
                <li><span>ESC</span> Release Mouse Cursor</li>
              </ul>
            </div>
            <button className="start-btn">Enter Virtual Walkthrough</button>
          </div>
        </div>
      )}

      {/* Telemetry HUD */}
      <div className="telemetry-bar">
        <div className="telemetry-item">
          <span className="label">POS X</span>
          <span className="val">{coordinates.x}m</span>
        </div>
        <div className="telemetry-item">
          <span className="label">POS Y</span>
          <span className="val">{coordinates.y}m</span>
        </div>
        <div className="telemetry-item">
          <span className="label">POS Z</span>
          <span className="val">{coordinates.z}m</span>
        </div>
        <div className="telemetry-item mode">
          <span className="label">MODE</span>
          <span className={`val status ${isLocked ? 'active' : ''}`}>
            {isLocked ? 'FREE ROAMING' : 'PAUSED (ESC)'}
          </span>
        </div>
      </div>

      {/* POI Sidebar Preview */}
      <div className="poi-panel">
        <h3>Spatial POI Index</h3>
        <div className="poi-list">
          {pois.map((poi, idx) => (
            <div key={idx} className="poi-item">
              <span className="poi-name">{poi.name}</span>
              <span className="poi-coords">({poi.x}, {poi.y}, {poi.z})</span>
            </div>
          ))}
        </div>

        <div className="poi-input-group">
          <input
            type="text"
            placeholder="Tag current location..."
            value={activePoi}
            onChange={(e) => setActivePoi(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPoi()}
          />
          <button onClick={handleAddPoi}>Tag</button>
        </div>
      </div>
    </div>
  )
}
