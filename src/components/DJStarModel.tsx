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
    camera.position.set(0,.35,7.2)
    camera.lookAt(0,0,0)

    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true})
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.outputColorSpace=THREE.SRGBColorSpace
    renderer.toneMapping=THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure=1.35
    renderer.shadowMap.enabled=true
    renderer.shadowMap.type=THREE.PCFSoftShadowMap
    host.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff,1.6))
    scene.add(new THREE.HemisphereLight(0xdceaff,0x17202b,2.6))
    const key=new THREE.DirectionalLight(0xffffff,5)
    key.position.set(4,7,6);scene.add(key)
    const fill=new THREE.DirectionalLight(0x91bdff,3)
    fill.position.set(-5,2,4);scene.add(fill)
    const rim=new THREE.DirectionalLight(0x4e9cff,2.4)
    rim.position.set(1,4,-5);scene.add(rim)

    let rig:THREE.Group|null=null
    let raf=0
    let pointerX=0
    let pointerY=0

    new GLTFLoader().load('/assets/models/IBM_5155.glb',(gltf)=>{
      host.classList.remove('model-missing')
      const source=gltf.scene
      source.traverse((object)=>{
        if(object instanceof THREE.Mesh){
          object.castShadow=true
          object.receiveShadow=true
          const materials=Array.isArray(object.material)?object.material:[object.material]
          materials.forEach((material)=>{
            if(material instanceof THREE.MeshStandardMaterial){
              material.envMapIntensity=.8
              material.needsUpdate=true
            }
          })
        }
      })

      const rawBox=new THREE.Box3().setFromObject(source)
      const center=rawBox.getCenter(new THREE.Vector3())
      const size=rawBox.getSize(new THREE.Vector3())
      source.position.set(-center.x,-center.y,-center.z)

      const normalized=new THREE.Group()
      normalized.add(source)
      const longest=Math.max(size.x,size.y,size.z)||1
      normalized.scale.setScalar(4.8/longest)

      rig=new THREE.Group()
      rig.add(normalized)
      rig.rotation.set(-.04,-.3,.01)
      rig.position.set(.25,-.12,0)
      scene.add(rig)
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
    const ro=new ResizeObserver(resize)
    ro.observe(host)
    resize()
    host.addEventListener('pointermove',move)

    const clock=new THREE.Clock()
    const render=()=>{
      raf=requestAnimationFrame(render)
      if(rig){
        const t=clock.getElapsedTime()
        rig.rotation.y+=(-.3+pointerX*.12-rig.rotation.y)*.045
        rig.rotation.x+=(-.04-pointerY*.05-rig.rotation.x)*.045
        rig.position.y=-.12+Math.sin(t*.65)*.025
      }
      renderer.render(scene,camera)
    }
    render()

    return()=>{
      cancelAnimationFrame(raf)
      ro.disconnect()
      host.removeEventListener('pointermove',move)
      renderer.dispose()
      renderer.domElement.remove()
    }
  },[])

  return <div className="djstar-3d-shell"><div ref={hostRef} className="djstar-3d-canvas"><span className="djstar-model-error">3D MODEL FILE REQUIRED</span></div><div className="djstar-3d-caption"><span>DJSTAR / OBSERVATORY TERMINAL</span><i>INTERACTIVE 3D</i></div></div>
}
