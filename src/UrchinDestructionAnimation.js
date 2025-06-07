import * as THREE from 'three'
import { useRef, useLayoutEffect } from 'react'

const UrchinDestructionAnimation = ({ trigger }) => {
  const mountRef = useRef()
  const animationRef = useRef()
  const trianglesRef = useRef([])

  useLayoutEffect(() => {
    if (!trigger) return

    // Setup scene
    const width = window.innerWidth
    const height = window.innerHeight
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    // Helper to get a random point around the board edge (circle perimeter)
    function randomEdgePoint() {
      const angle = Math.random() * Math.PI * 2
      const radius = 2.8 // slightly larger than board
      return {
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius
      }
    }

    // Create thin triangles (urchin spikes) that fall and fade out
    const triangles = []
    const numTriangles = 32
    for (let i = 0; i < numTriangles; i++) {
      const geometry = new THREE.BufferGeometry()
      // Thinner, longer triangle for spike effect
      const vertices = new Float32Array([
        0, 0.35, 0,    // tip (longer)
        -0.025, -0.1, 0, // left base (narrow)
        0.025, -0.1, 0   // right base (narrow)
      ])
      geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
      const material = new THREE.MeshBasicMaterial({ color: 0x222222, side: THREE.DoubleSide, transparent: true, opacity: 1 })
      const mesh = new THREE.Mesh(geometry, material)
      // Start at random edge
      const edge = randomEdgePoint()
      mesh.position.x = edge.x
      mesh.position.y = edge.y
      mesh.position.z = (Math.random() - 0.5) * 0.2
      mesh.rotation.z = Math.random() * Math.PI * 2
      // Target a random spot along the bottom
      const targetX = edge.x 
      const targetY = -3.2 + Math.random() * 0.2 // bottom
      // Add "water" drift parameters
      mesh.userData = {
        velocity: 0.0008 + Math.random() * 0.0012, // slower fall
        rotationSpeed: (Math.random() - 0.5) * 0.01, // slower rotation
        targetX,
        targetY,
        progress: 0, // 0=start, 1=at bottom
        landedAt: null, // timestamp when landed
        driftPhase: Math.random() * Math.PI * .1, // for sine drift
        driftSpeed: 0.1 + Math.random() * 0.1, // how fast it "waves"
        driftAmplitude: 0.008 + Math.random() * 0.010 // how much it "waves"
      }
      scene.add(mesh)
      triangles.push(mesh)
    }
    trianglesRef.current = triangles

    let startTime = null
    function animate(now) {
      if (!startTime) startTime = now
      const elapsed = (now - startTime) / 1000 // seconds

      triangles.forEach(tri => {
        // Move along a straight line from edge to bottom
        if (tri.userData.progress < 1) {
          tri.userData.progress += tri.userData.velocity
          if (tri.userData.progress > 1) {
            tri.userData.progress = 1
            tri.userData.landedAt = now
          }
          // Water drift: add a sine wave to x as it falls
          const drift =
            Math.sin(elapsed * tri.userData.driftSpeed + tri.userData.driftPhase) *
            tri.userData.driftAmplitude * (1 - tri.userData.progress * 0.7)
          // Interpolate position
          tri.position.x =
            tri.position.x + (tri.userData.targetX - tri.position.x) * tri.userData.progress * 0.08 + drift
          tri.position.y =
            tri.position.y + (tri.userData.targetY - tri.position.y) * tri.userData.progress * 0.08
          tri.rotation.z += tri.userData.rotationSpeed
        } else {
          // Fade out over 60 seconds after landing
          if (tri.userData.landedAt) {
            const fadeElapsed = (now - tri.userData.landedAt) / 1000
            tri.material.opacity = Math.max(0, 1 - fadeElapsed / 60)
          }
        }
      })
      renderer.render(scene, camera)
      // Continue animation as long as any triangle is visible
      if (triangles.some(tri => tri.material.opacity > 0)) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        renderer.dispose()
        mountRef.current && mountRef.current.removeChild(renderer.domElement)
      }
    }
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationRef.current)
      renderer.dispose()
      if (mountRef.current && mountRef.current.firstChild) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [trigger])

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 10000
      }}
    />
  )
}

export default UrchinDestructionAnimation
