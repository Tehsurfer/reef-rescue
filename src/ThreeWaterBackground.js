import { useRef, useEffect } from 'react'
import * as THREE from 'three'

const ThreeWaterBackground = () => {
  const mountRef = useRef()

  useEffect(() => {
    const scene = new THREE.Scene()
    // Use an orthographic camera to ensure the plane fills the screen exactly
    const width = window.innerWidth
    const height = window.innerHeight
    const aspect = width / height
    const viewSize = 8
    const camera = new THREE.OrthographicCamera(
      -viewSize * aspect / 2, viewSize * aspect / 2,
      viewSize / 2, -viewSize / 2,
      0.1, 1000
    )
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(width, height)
    renderer.setClearColor(0x000000, 0)
    mountRef.current.appendChild(renderer.domElement)

    // Make the plane large enough to always cover the viewport
    const geometry = new THREE.PlaneGeometry(viewSize * aspect, viewSize, 1, 1)

    // Custom shader material for animated gradient
    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0.0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        varying vec2 vUv;
        void main() {
          float x = vUv.x;
          float y = vUv.y; // y=0 is top, y=1 is bottom
          float t = u_time * 0.18;
          // Softer gradient: bottom (very light blue) to top (medium blue), less contrast
          vec3 bottomColor = vec3(0.667, 0.878, 0.976);    // very light blue, close to white
          vec3 topColor = vec3(0.098, 0.58, 0.843);     // medium blue
          vec3 base = mix(topColor, bottomColor, y);

          // Add a subtle moving highlight as a sine wave
          float wave = 0.10 * sin(6.0 * y + t * 1.2 + x * 2.0);
          float highlight = smoothstep(0.35 + wave, 0.45 + wave, y);
          vec3 color = mix(base, vec3(0.9, 0.98, 1.0), highlight * 0.12);

          gl_FragColor = vec4(color, 0.92);
        }
      `,
      transparent: true
    })

    const plane = new THREE.Mesh(geometry, material)
    scene.add(plane)

    let frameId
    function animate(t) {
      material.uniforms.u_time.value = t / 1000.0
      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    frameId = requestAnimationFrame(animate)

    // Handle resize
    function handleResize() {
      const w = window.innerWidth
      const h = window.innerHeight
      const aspect = w / h
      renderer.setSize(w, h)
      camera.left = -viewSize * aspect / 2
      camera.right = viewSize * aspect / 2
      camera.top = viewSize / 2
      camera.bottom = -viewSize / 2
      camera.aspect = aspect
      camera.updateProjectionMatrix()
      // Optionally, resize the plane geometry if needed
      plane.scale.set(aspect, 1, 1)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
      renderer.dispose()
      if (mountRef.current && mountRef.current.firstChild) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden'
      }}
    />
  )
}

export default ThreeWaterBackground
