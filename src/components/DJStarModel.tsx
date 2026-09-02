import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default function DJStarModel(){
  const hostRef=useRef<HTMLDivElement>(null)

  useEffect(()=>{
    const host=hostRef.current
    if(!host)return

    const scene=new THREE.Scene()
    const camera=new THREE.PerspectiveCamera(34,1,.01,100)
    camera.position.set(0,.15,7.2)
    camera.lookAt(0,0,0)

    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true})
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.outputColorSpace=THREE.SRGBColorSpace
    renderer.toneMapping=THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure=1.35
    renderer.shadowMap.enabled=true
    renderer.shadowMap.type=THREE.PCFSoftShadowMap
    host.appendChild(renderer.domElement)

    scene.add(new THREE.HemisphereLight(0xd9e8ff,0x10151b,3.2))
    const key=new THREE.DirectionalLight(0xffffff,5.2)
    key.position.set(4,7,6);scene.add(key)
    const fill=new THREE.DirectionalLight(0x8dbdff,3)
    fill.position.set(-5,2,4);scene.add(fill)
    const warm=new THREE.PointLight(0xffb66d,2.2,20)
    warm.position.set(3,-2,5);scene.add(warm)

    const pivot=new THREE.Group()
    scene.add(pivot)
    let model:THREE.Group|null=null
    let raf=0
    let pointerX=0
    let pointerY=0

    new GLTFLoader().load('/assets/models/IBM_5155.glb',(gltf)=>{
      model=gltf.scene
      model.traverse((object)=>{
        if(object instanceof THREE.Mesh){
          object.castShadow=true
          object.receiveShadow=true
          const material=object.material as THREE.MeshStandardMaterial
          if(material?.isMeshStandardMaterial){material.envMapIntensity=.8;material.needsUpdate=true}
        }
      })

      const rawBox=new THREE.Box3().setFromObject(model)
      const rawCenter=rawBox.getCenter(new THREE.Vector3())
      const rawSize=rawBox.getSize(new THREE.Vector3())
      model.position.copy(rawCenter).multiplyScalar(-1)
      const fitScale=4.9/Math.max(rawSize.x,rawSize.y,rawSize.z)
      model.scale.setScalar(fitScale)
      pivot.add(model)

      // Re-center AFTER scale so the transformed model is guaranteed to sit at the origin.
      pivot.updateMatrixWorld(true)
      const fittedBox=new THREE.Box3().setFromObject(pivot)
      const fittedCenter=fittedBox.getCenter(new THREE.Vector3())
      pivot.position.sub(fittedCenter)
      pivot.rotation.set(-.08,-.28,.01)

      host.classList.add('model-loaded')
    },undefined,(error)=>{
      console.error('DJSTAR GLB load failed',error)
      host.classList.add('model-missing')
    })

    const resize=()=>{
      const {width,height}=host.getBoundingClientRect()
      if(!width||!height)return
      renderer.setSize(width,height,false)
      camera.aspect=width/height
      camera.updateProjectionMatrix()
    }
    const move=(e:PointerEvent)=>{
      const r=host.getBoundingClientRect()
      pointerX=(e.clientX-r.left)/r.width-.5
      pointerY=(e.clientY-r.top)/r.height-.5
    }
    const ro=new ResizeObserver(resize);ro.observe(host);resize()
    host.addEventListener('pointermove',move)

    const clock=new THREE.Clock()
    const render=()=>{
      raf=requestAnimationFrame(render)
      if(model){
        const t=clock.getElapsedTime()
        pivot.rotation.y+=(-.28+pointerX*.12-pivot.rotation.y)*.045
        pivot.rotation.x+=(-.08-pointerY*.055-pivot.rotation.x)*.045
        pivot.position.y=Math.sin(t*.65)*.025
      }
      renderer.render(scene,camera)
    }
    render()

    return()=>{cancelAnimationFrame(raf);ro.disconnect();host.removeEventListener('pointermove',move);renderer.dispose();renderer.domElement.remove()}
  },[])

  return <div className="djstar-3d-shell"><div ref={hostRef} className="djstar-3d-canvas"><span className="djstar-model-error">3D MODEL FILE REQUIRED</span></div><div className="djstar-3d-caption"><span>DJSTAR / OBSERVATORY TERMINAL</span><i>INTERACTIVE 3D</i></div></div>
}
