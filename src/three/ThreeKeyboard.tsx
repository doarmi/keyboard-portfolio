import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function ThreeKeyboard() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const geometry = new THREE.BoxGeometry(1, 0.35, 0.65)
    const material = new THREE.MeshNormalMaterial()
    const testObject = new THREE.Mesh(geometry, material)
    scene.add(testObject)

    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      if (width === 0 || height === 0) return

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    let animationFrameId = 0
    const animate = () => {
      testObject.rotation.y += 0.005
      renderer.render(scene, camera)
      animationFrameId = window.requestAnimationFrame(animate)
    }

    window.addEventListener('resize', resize)
    resize()
    animate()

    return () => {
      window.cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
      scene.remove(testObject)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={containerRef} className="three-keyboard" aria-label="Three.js test object" />
}
