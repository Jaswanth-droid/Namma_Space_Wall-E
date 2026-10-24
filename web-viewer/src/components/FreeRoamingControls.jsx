import { useRef, useEffect } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PointerLockControls } from '@react-three/drei'

export default function FreeRoamingControls({ onPositionUpdate, isLocked, setIsLocked }) {
  const { camera } = useThree()
  const controlsRef = useRef()
  
  const moveState = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false,
    sprint: false
  })
  
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())

  useEffect(() => {
    const onKeyDown = (event) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          moveState.current.forward = true
          break
        case 'KeyS':
        case 'ArrowDown':
          moveState.current.backward = true
          break
        case 'KeyA':
        case 'ArrowLeft':
          moveState.current.left = true
          break
        case 'KeyD':
        case 'ArrowRight':
          moveState.current.right = true
          break
        case 'KeyE':
        case 'Space':
          moveState.current.up = true
          break
        case 'KeyQ':
        case 'ControlLeft':
          moveState.current.down = true
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          moveState.current.sprint = true
          break
      }
    }

    const onKeyUp = (event) => {
      switch (event.code) {
        case 'KeyW':
        case 'ArrowUp':
          moveState.current.forward = false
          break
        case 'KeyS':
        case 'ArrowDown':
          moveState.current.backward = false
          break
        case 'KeyA':
        case 'ArrowLeft':
          moveState.current.left = false
          break
        case 'KeyD':
        case 'ArrowRight':
          moveState.current.right = false
          break
        case 'KeyE':
        case 'Space':
          moveState.current.up = false
          break
        case 'KeyQ':
        case 'ControlLeft':
          moveState.current.down = false
          break
        case 'ShiftLeft':
        case 'ShiftRight':
          moveState.current.sprint = false
          break
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useFrame((_, delta) => {
    if (!controlsRef.current || !controlsRef.current.isLocked) return

    const baseSpeed = moveState.current.sprint ? 8.0 : 3.5
    const damping = 10.0

    velocity.current.x -= velocity.current.x * damping * delta
    velocity.current.z -= velocity.current.z * damping * delta
    velocity.current.y -= velocity.current.y * damping * delta

    direction.current.z = Number(moveState.current.forward) - Number(moveState.current.backward)
    direction.current.x = Number(moveState.current.right) - Number(moveState.current.left)
    direction.current.y = Number(moveState.current.up) - Number(moveState.current.down)
    direction.current.normalize()

    if (moveState.current.forward || moveState.current.backward) {
      velocity.current.z -= direction.current.z * baseSpeed * 10 * delta
    }
    if (moveState.current.left || moveState.current.right) {
      velocity.current.x -= direction.current.x * baseSpeed * 10 * delta
    }
    if (moveState.current.up || moveState.current.down) {
      velocity.current.y += direction.current.y * baseSpeed * 10 * delta
    }

    controlsRef.current.moveRight(-velocity.current.x * delta)
    controlsRef.current.moveForward(-velocity.current.z * delta)
    camera.position.y += velocity.current.y * delta

    // Keep camera above floor level
    if (camera.position.y < 1.0) {
      camera.position.y = 1.0
      velocity.current.y = 0
    }

    if (onPositionUpdate) {
      onPositionUpdate({
        x: camera.position.x.toFixed(2),
        y: camera.position.y.toFixed(2),
        z: camera.position.z.toFixed(2)
      })
    }
  })

  return (
    <PointerLockControls
      ref={controlsRef}
      onLock={() => setIsLocked(true)}
      onUnlock={() => setIsLocked(false)}
    />
  )
}
