import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default function DJStarModel(){
  const hostRef=useRef<HTMLDivElement>(null)

  useEffect(()=>{
    const host=hostRef.current
    if(!host)return

    const scene=new THREE.Scene()
    const camera=new THREE.PerspectiveCamera(31,1,.01,100)
    camera.position.set(4.4,2.8,6.8)

    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true})
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.outputColorSpace=THREE.SRGBColorSpace
    renderer.toneMapping=THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure=1.2
    renderer.shadowMap.enabled=true
    renderer.shadowMap.type=THREE.PCFSoftShadowMap
    host.appendChild(renderer.domElement)

    scene.add(new THREE.HemisphereLight(0xc8ddff,0x111820,2.2))
    const key=new THREE.DirectionalLight(0xffffff,4.2)
    key.position.set(4,7,5);key.castShadow=true;scene.add(key)
    const rim=new THREE.DirectionalLight(0x5aa8ff,2.8)
    rim.position.set(-5,3,-4);scene.add(rim)
    const warm=new THREE.PointLight(0xffb15b,2.4,12)
    warm.position.set(2,-1,4);scene.add(warm)

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
          if(material?.isMeshStandardMaterial){material.envMapIntensity=.75;material.needsUpdate=true}
        }
      })
      const box=new THREE.Box3().setFromObject(model)
      const center=box.getCenter(new THREE.Vector3())
      const size=box.getSize(new THREE.Vector3())
      model.position.sub(center)
      const scale=4.6/Math.max(size.x,size.y,size.z)
      model.scale.setScalar(scale)
      model.rotation.set(-.06,-.5,.015)
      scene.add(model)
    },undefined,()=>host.classList.add('model-missing'))

    const resize=()=>{
      const {width,height}=host.getBoundingClientRect()
      if(!width||!height)return
      renderer.setSize(width,height,false)
      camera.aspect=width/height
      camera.updateProjectionMatrix()
    }
    const move=(e:PointerEvent)=>{
      const r=host.getBoundingClientRect()
      pointerX=((e.clientX-r.left)/r.width-.5)
      pointerY=((e.clientY-r.top)/r.height-.5)
    }
    const ro=new ResizeObserver(resize);ro.observe(host);resize()
    host.addEventListener('pointermove',move)

    const clock=new THREE.Clock()
    const render=()=>{
      raf=requestAnimationFrame(render)
      if(model){
        const t=clock.getElapsedTime()
        model.rotation.y+=(-.5+pointerX*.13-model.rotation.y)*.045
        model.rotation.x+=(-.06-pointerY*.06-model.rotation.x)*.045
        model.position.y=Math.sin(t*.65)*.025
      }
      renderer.render(scene,camera)
    }
    render()

    return()=>{cancelAnimationFrame(raf);ro.disconnect();host.removeEventListener('pointermove',move);renderer.dispose();renderer.domElement.remove()}
  },[])

  return <div className="djstar-3d-shell"><div ref={hostRef} className="djstar-3d-canvas"><span className="djstar-model-error">3D MODEL FILE REQUIRED</span></div><div className="djstar-3d-caption"><span>DJSTAR / OBSERVATORY TERMINAL</span><i>INTERACTIVE 3D</i></div></div>
}
