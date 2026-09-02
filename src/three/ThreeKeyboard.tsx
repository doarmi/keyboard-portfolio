import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type ProjectKey = 'P' | 'D' | 'O'

const projectUrls: Record<ProjectKey, string> = {
  P: 'https://plivy-intro.vercel.app',
  D: '#',
  O: '#',
}

export default function ThreeKeyboard() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#eee9df')

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 5.4, 8.8)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    container.appendChild(renderer.domElement)

    const ambient = new THREE.HemisphereLight('#fffaf0', '#5a5148', 2.5)
    const keyLight = new THREE.DirectionalLight('#fff7e8', 4.5)
    keyLight.position.set(-4, 8, 6)
    keyLight.castShadow = true
    scene.add(ambient, keyLight)

    const keyboard = new THREE.Group()
    keyboard.rotation.x = -0.08
    scene.add(keyboard)

    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: '#d8d0c2', roughness: 0.3, metalness: 0.05,
      transmission: 0.08, transparent: true, opacity: 0.96,
    })
    const keyMat = new THREE.MeshStandardMaterial({ color: '#f3eee3', roughness: 0.58 })
    const accentMat = new THREE.MeshStandardMaterial({
      color: '#e86645', roughness: 0.42, emissive: '#e86645', emissiveIntensity: 0,
    })

    const body = new THREE.Mesh(new THREE.BoxGeometry(6.8, 0.34, 2.7), bodyMat)
    body.position.y = -0.22
    body.castShadow = body.receiveShadow = true
    keyboard.add(body)

    const keyGeometry = new THREE.BoxGeometry(0.52, 0.25, 0.52, 2, 1, 2)
    const projectMeshes = new Map<ProjectKey, THREE.Mesh>()
    const projectPositions: Record<ProjectKey, THREE.Vector3> = {
      P: new THREE.Vector3(2.05, 0.08, -0.62),
      D: new THREE.Vector3(-0.95, 0.08, 0),
      O: new THREE.Vector3(1.45, 0.08, -0.62),
    }

    const rows = [11, 11, 10, 9]
    rows.forEach((count, row) => {
      const z = -0.92 + row * 0.61
      const offset = row * 0.12
      for (let col = 0; col < count; col++) {
        const x = (col - (count - 1) / 2) * 0.59 + offset
        let project: ProjectKey | null = null
        for (const name of ['P', 'D', 'O'] as ProjectKey[]) {
          const p = projectPositions[name]
          if (Math.abs(x - p.x) < 0.28 && Math.abs(z - p.z) < 0.28) project = name
        }
        const key = new THREE.Mesh(keyGeometry, project ? accentMat : keyMat)
        key.position.set(x, 0.08, z)
        key.castShadow = true
        key.userData.project = project
        keyboard.add(key)
        if (project) projectMeshes.set(project, key)
      }
    })

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshStandardMaterial({ color: '#e7e0d5', roughness: 0.9 }),
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -0.43
    floor.receiveShadow = true
    scene.add(floor)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2(99, 99)
    let hovered: THREE.Mesh | null = null
    let transitioning = false

    const setHint = (project?: ProjectKey) => {
      window.dispatchEvent(new CustomEvent('keyboard-project-hover', { detail: project ?? null }))
    }

    const pointerMove = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      raycaster.setFromCamera(pointer, camera)
      const hit = raycaster.intersectObjects([...projectMeshes.values()], false)[0]?.object as THREE.Mesh | undefined
      if (hovered && hovered !== hit) gsap.to(hovered.position, { y: 0.08, duration: 0.2 })
      hovered = hit ?? null
      if (hovered) {
        gsap.to(hovered.position, { y: 0.17, duration: 0.18 })
        renderer.domElement.style.cursor = 'pointer'
        setHint(hovered.userData.project)
      } else {
        renderer.domElement.style.cursor = 'default'
        setHint()
      }
    }

    const activate = (project: ProjectKey) => {
      if (transitioning) return
      const key = projectMeshes.get(project)
      if (!key) return
      transitioning = true
      setHint(project)
      const target = key.getWorldPosition(new THREE.Vector3())
      const tl = gsap.timeline({
        onComplete: () => {
          const url = projectUrls[project]
          if (url !== '#') window.open(url, '_blank', 'noopener,noreferrer')
          transitioning = false
        },
      })
      tl.to(key.position, { y: -0.01, duration: 0.12, ease: 'power2.in' })
        .to(scene.background as THREE.Color, { r: 0.035, g: 0.032, b: 0.04, duration: 0.55 }, '<')
        .to(accentMat, { emissiveIntensity: 2.2, duration: 0.45 }, '<')
        .to(camera.position, { x: target.x * 0.35, y: 1.4, z: target.z + 2.3, duration: 0.75, ease: 'power3.inOut' }, '<0.08')
        .to(key.position, { y: 0.08, duration: 0.18 })
        .to(accentMat, { emissiveIntensity: 0.35, duration: 0.25 }, '<')
    }

    const click = () => {
      const project = hovered?.userData.project as ProjectKey | undefined
      if (project) activate(project)
    }
    const keydown = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement)?.tagName
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return
      const key = event.key.toUpperCase() as ProjectKey
      if (key === 'P' || key === 'D' || key === 'O') activate(key)
    }

    renderer.domElement.addEventListener('pointermove', pointerMove)
    renderer.domElement.addEventListener('click', click)
    window.addEventListener('keydown', keydown)

    const scrollTween = gsap.timeline({
      scrollTrigger: {
        trigger: container.closest('.keyboard-hero'),
        start: 'top top', end: 'bottom bottom', scrub: 1,
      },
    })
    scrollTween
      .to(camera.position, { x: -1.1, y: 3.6, z: 6.4, duration: 0.45, ease: 'none' })
      .to(camera.position, { x: 0, y: 2.7, z: 5.1, duration: 0.55, ease: 'none' })
      .to(keyboard.rotation, { x: -0.18, y: -0.04, duration: 1, ease: 'none' }, 0)

    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      if (!width || !height) return
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    let raf = 0
    const animate = () => {
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
      raf = requestAnimationFrame(animate)
    }
    window.addEventListener('resize', resize)
    resize()
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('keydown', keydown)
      renderer.domElement.removeEventListener('pointermove', pointerMove)
      renderer.domElement.removeEventListener('click', click)
      scrollTween.scrollTrigger?.kill()
      scrollTween.kill()
      keyGeometry.dispose()
      body.geometry.dispose()
      floor.geometry.dispose()
      bodyMat.dispose(); keyMat.dispose(); accentMat.dispose()
      ;(floor.material as THREE.Material).dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={containerRef} className="three-keyboard" aria-label="Interactive 3D project keyboard" />
}
