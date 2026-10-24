import { useRef } from 'react'
import { Text } from '@react-three/drei'

export default function IndoorScene({ customModelUrl }) {
  const roomWidth = 14
  const roomLength = 18
  const roomHeight = 3.5

  return (
    <group>
      {/* Ambient and Key Lighting */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} castShadow />
      <pointLight position={[0, 3, 0]} intensity={0.6} distance={15} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Grid Floor Overlay for Spatial Reference */}
      <gridHelper args={[24, 24, '#38bdf8', '#334155']} position={[0, 0.01, 0]} />

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, roomHeight, 0]}>
        <planeGeometry args={[roomWidth, roomLength]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>

      {/* North Wall */}
      <mesh position={[0, roomHeight / 2, -roomLength / 2]}>
        <boxGeometry args={[roomWidth, roomHeight, 0.2]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* South Wall with Entrance */}
      <mesh position={[-roomWidth / 3, roomHeight / 2, roomLength / 2]}>
        <boxGeometry args={[roomWidth / 2.5, roomHeight, 0.2]} />
        <meshStandardMaterial color="#334155" />
      </mesh>
      <mesh position={[roomWidth / 3, roomHeight / 2, roomLength / 2]}>
        <boxGeometry args={[roomWidth / 2.5, roomHeight, 0.2]} />
        <meshStandardMaterial color="#334155" />
      </mesh>

      {/* East & West Walls */}
      <mesh position={[roomWidth / 2, roomHeight / 2, 0]}>
        <boxGeometry args={[0.2, roomHeight, roomLength]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>
      <mesh position={[-roomWidth / 2, roomHeight / 2, 0]}>
        <boxGeometry args={[0.2, roomHeight, roomLength]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Representative Indoor Elements / Desks / Obstacles */}
      <group position={[-3, 0.45, -3]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2.5, 0.9, 1.4]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <Text position={[0, 0.8, 0]} fontSize={0.25} color="#38bdf8">
          Workstation Alpha
        </Text>
      </group>

      <group position={[3, 0.45, -3]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[2.5, 0.9, 1.4]} />
          <meshStandardMaterial color="#475569" />
        </mesh>
        <Text position={[0, 0.8, 0]} fontSize={0.25} color="#38bdf8">
          Workstation Beta
        </Text>
      </group>

      <group position={[0, 0.4, 2]}>
        <mesh position={[0, 0, 0]} castShadow>
          <cylinderGeometry args={[1.5, 1.5, 0.8, 32]} />
          <meshStandardMaterial color="#0284c7" />
        </mesh>
        <Text position={[0, 0.7, 0]} fontSize={0.28} color="#f8fafc">
          Meeting Hub
        </Text>
      </group>

      {/* Spatial Direction Indicator */}
      <Text position={[0, 2.5, -roomLength / 2 + 0.2]} fontSize={0.6} color="#38bdf8">
        NORTH [Z-]
      </Text>
    </group>
  )
}
