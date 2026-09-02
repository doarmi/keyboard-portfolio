import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)
type ProjectKey = 'P' | 'D' | 'O'
const projectUrls: Record<ProjectKey, string> = { P: 'https://plivy-intro.vercel.app', D: '#', O: '#' }

function roundedBox(w: number, h: number, d: number, r = 0.08) {
  const shape = new THREE.Shape()
  const x = -w / 2, y = -d / 2
  shape.moveTo(x + r, y); shape.lineTo(x + w - r, y); shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + d - r); shape.quadraticCurveTo(x + w, y + d, x + w - r, y + d)
  shape.lineTo(x + r, y + d); shape.quadraticCurveTo(x, y + d, x, y + d - r)
  shape.lineTo(x, y + r); shape.quadraticCurveTo(x, y, x + r, y)
  const g = new THREE.ExtrudeGeometry(shape, { depth: h, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.025, bevelThickness: 0.025 })
  g.rotateX(Math.PI / 2); g.translate(0, h / 2, 0); g.computeVertexNormals(); return g
}

function labelTexture(text: string, accent = false) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256
  const ctx = c.getContext('2d')!; ctx.clearRect(0, 0, 256, 256)
  ctx.fillStyle = accent ? '#fff8ed' : '#292622'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
  ctx.font = `700 ${text.length > 2 ? 48 : 76}px Arial`; ctx.fillText(text, 128, 130)
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t
}

export default function ThreeKeyboard() {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const container = containerRef.current; if (!container) return
    const scene = new THREE.Scene(); scene.background = new THREE.Color('#e9e3d8')
    const camera = new THREE.PerspectiveCamera(34, 1, .1, 100); camera.position.set(0, 5.2, 8.5)
    const renderer = new THREE.WebGLRenderer({ antialias: true }); renderer.setPixelRatio(Math.min(devicePixelRatio, 2)); renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.08
    container.appendChild(renderer.domElement)

    scene.add(new THREE.HemisphereLight('#fff8e9', '#6c6258', 1.55))
    const keyLight = new THREE.DirectionalLight('#fff4df', 3.3); keyLight.position.set(-4, 7, 5); keyLight.castShadow = true; keyLight.shadow.mapSize.set(2048, 2048); scene.add(keyLight)
    const rim = new THREE.DirectionalLight('#b8c7d2', 1.1); rim.position.set(5, 3, -4); scene.add(rim)

    const keyboard = new THREE.Group(); scene.add(keyboard)
    const shellMat = new THREE.MeshPhysicalMaterial({ color: '#bdb4a6', roughness: .24, metalness: .08, clearcoat: .65, clearcoatRoughness: .25 })
    const insetMat = new THREE.MeshStandardMaterial({ color: '#262421', roughness: .5 })
    const keyMat = new THREE.MeshPhysicalMaterial({ color: '#e8e0d3', roughness: .36, clearcoat: .28, clearcoatRoughness: .38 })
    const accentMat = new THREE.MeshStandardMaterial({ color: '#db6244', roughness: .32, emissive: '#db6244', emissiveIntensity: 0 })

    const shell = new THREE.Mesh(roundedBox(7.15, .34, 3.05, .18), shellMat); shell.position.y = -.24; shell.castShadow = shell.receiveShadow = true; keyboard.add(shell)
    const inset = new THREE.Mesh(roundedBox(6.78, .09, 2.68, .13), insetMat); inset.position.y = -.025; inset.castShadow = true; keyboard.add(inset)

    const projectMeshes = new Map<ProjectKey, THREE.Mesh>()
    const rows = [
      ['ESC','1','2','3','4','5','6','7','8','9','0','-'],
      ['TAB','Q','W','E','R','T','Y','U','I','O','P'],
      ['CAPS','A','S','D','F','G','H','J','K','L'],
      ['SHIFT','Z','X','C','V','B','N','M','←'],
    ]
    const keyGeometries: THREE.BufferGeometry[] = []
    rows.forEach((labels, row) => {
      const z = -1.02 + row * .67; const step = .56; const offset = row * .11
      labels.forEach((label, col) => {
        const special = label === 'P' || label === 'D' || label === 'O'; const project = special ? label as ProjectKey : null
        const w = label === 'SHIFT' ? .82 : label === 'CAPS' ? .7 : label === 'TAB' ? .65 : .49
        const geo = roundedBox(w, .25, .53, .075); keyGeometries.push(geo)
        const key = new THREE.Mesh(geo, special ? accentMat : keyMat); key.position.set((col-(labels.length-1)/2)*step+offset, .17, z); key.castShadow = true; key.userData.project = project; keyboard.add(key)
        const tex = labelTexture(label, special); const labelMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false })
        const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(w*.68, .34), labelMat); labelMesh.rotation.x = -Math.PI/2; labelMesh.position.set(key.position.x, .306, z); keyboard.add(labelMesh)
        if (project) projectMeshes.set(project, key)
      })
    })
    const spaceGeo = roundedBox(2.75,.25,.53,.075); keyGeometries.push(spaceGeo); const space = new THREE.Mesh(spaceGeo,keyMat); space.position.set(.1,.17,1.35); space.castShadow=true; keyboard.add(space)

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30,30), new THREE.MeshStandardMaterial({color:'#d8d0c3',roughness:.86})); floor.rotation.x=-Math.PI/2; floor.position.y=-.46; floor.receiveShadow=true; scene.add(floor)
    keyboard.rotation.x=-.08; keyboard.rotation.y=.025

    const raycaster=new THREE.Raycaster(), pointer=new THREE.Vector2(99,99); let hovered:THREE.Mesh|null=null, transitioning=false
    const hint=(p?:ProjectKey)=>window.dispatchEvent(new CustomEvent('keyboard-project-hover',{detail:p??null}))
    const move=(e:PointerEvent)=>{const rect=renderer.domElement.getBoundingClientRect();pointer.set(((e.clientX-rect.left)/rect.width)*2-1,-((e.clientY-rect.top)/rect.height)*2+1);raycaster.setFromCamera(pointer,camera);const hit=raycaster.intersectObjects([...projectMeshes.values()])[0]?.object as THREE.Mesh|undefined;if(hovered&&hovered!==hit)gsap.to(hovered.position,{y:.17,duration:.18});hovered=hit??null;if(hovered){gsap.to(hovered.position,{y:.27,duration:.18});renderer.domElement.style.cursor='pointer';hint(hovered.userData.project)}else{renderer.domElement.style.cursor='default';hint()}}
    const activate=(p:ProjectKey)=>{if(transitioning)return;const key=projectMeshes.get(p);if(!key)return;transitioning=true;const world=key.getWorldPosition(new THREE.Vector3());gsap.timeline({onComplete:()=>{if(projectUrls[p]!=='#')window.open(projectUrls[p],'_blank','noopener,noreferrer');transitioning=false}}).to(key.position,{y:.04,duration:.11,ease:'power2.in'}).to(scene.background as THREE.Color,{r:.025,g:.023,b:.03,duration:.48},'<').to(accentMat,{emissiveIntensity:2.4,duration:.4},'<').to(camera.position,{x:world.x*.32,y:1.45,z:world.z+2.35,duration:.72,ease:'power3.inOut'},'<.06').to(key.position,{y:.17,duration:.16}).to(accentMat,{emissiveIntensity:.3,duration:.2},'<')}
    const click=()=>{const p=hovered?.userData.project as ProjectKey|undefined;if(p)activate(p)}
    const keydown=(e:KeyboardEvent)=>{const tag=(e.target as HTMLElement)?.tagName;if(['INPUT','TEXTAREA','SELECT'].includes(tag))return;const p=e.key.toUpperCase() as ProjectKey;if(['P','D','O'].includes(p))activate(p)}
    renderer.domElement.addEventListener('pointermove',move);renderer.domElement.addEventListener('click',click);window.addEventListener('keydown',keydown)

    const timeline=gsap.timeline({scrollTrigger:{trigger:container.closest('.keyboard-hero'),start:'top top',end:'bottom bottom',scrub:1}})
    timeline.to(camera.position,{x:-.75,y:3.7,z:6.5,duration:.42,ease:'none'}).to(camera.position,{x:0,y:2.55,z:5.15,duration:.58,ease:'none'}).to(keyboard.rotation,{x:-.14,y:-.035,duration:1,ease:'none'},0)
    const resize=()=>{const {width,height}=container.getBoundingClientRect();if(!width||!height)return;camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(width,height,false)}
    let raf=0;const animate=()=>{camera.lookAt(0,.02,0);renderer.render(scene,camera);raf=requestAnimationFrame(animate)};window.addEventListener('resize',resize);resize();animate()
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',resize);window.removeEventListener('keydown',keydown);renderer.domElement.removeEventListener('pointermove',move);renderer.domElement.removeEventListener('click',click);timeline.scrollTrigger?.kill();timeline.kill();keyGeometries.forEach(g=>g.dispose());shell.geometry.dispose();inset.geometry.dispose();floor.geometry.dispose();shellMat.dispose();insetMat.dispose();keyMat.dispose();accentMat.dispose();(floor.material as THREE.Material).dispose();renderer.dispose();renderer.domElement.remove()}
  },[])
  return <div ref={containerRef} className="three-keyboard" aria-label="Interactive 3D mechanical keyboard" />
}
