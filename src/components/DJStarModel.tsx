import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default function DJStarModel(){
  const canvasRef=useRef<HTMLCanvasElement>(null)
  const hostRef=useRef<HTMLDivElement>(null)
  const [status,setStatus]=useState('LOADING 3D')

  useEffect(()=>{
    const canvas=canvasRef.current
    const host=hostRef.current
    if(!canvas||!host)return

    const scene=new THREE.Scene()
    const camera=new THREE.PerspectiveCamera(34,1,.1,100)
    camera.position.set(0,.25,7.4)
    camera.lookAt(0,0,0)

    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true,powerPreference:'high-performance'})
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.outputColorSpace=THREE.SRGBColorSpace
    renderer.toneMapping=THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure=1.25
    renderer.setClearColor(0x000000,0)

    scene.add(new THREE.AmbientLight(0xffffff,2.6))
    const key=new THREE.DirectionalLight(0xffffff,5.5)
    key.position.set(4,6,7)
    scene.add(key)
    const fill=new THREE.DirectionalLight(0x8dbdff,3.4)
    fill.position.set(-5,2,5)
    scene.add(fill)
    const warm=new THREE.PointLight(0xffb36b,2.2,18)
    warm.position.set(3,-1,4)
    scene.add(warm)

    const pivot=new THREE.Group()
    scene.add(pivot)

    let model:THREE.Group|null=null
    let raf=0
    let pointerX=0
    let pointerY=0

    const resize=()=>{
      const rect=host.getBoundingClientRect()
      if(rect.width<2||rect.height<2)return
      renderer.setSize(rect.width,rect.height,false)
      camera.aspect=rect.width/rect.height
      camera.updateProjectionMatrix()
    }

    const ro=new ResizeObserver(resize)
    ro.observe(host)
    resize()

    const move=(event:PointerEvent)=>{
      const rect=host.getBoundingClientRect()
      pointerX=(event.clientX-rect.left)/rect.width-.5
      pointerY=(event.clientY-rect.top)/rect.height-.5
    }
    host.addEventListener('pointermove',move)

    const loader=new GLTFLoader()
    loader.load('/assets/models/IBM_5155.glb',(gltf)=>{
      model=gltf.scene

      let meshes=0
      model.traverse((object)=>{
        if(!(object instanceof THREE.Mesh))return
        meshes+=1
        const materials=Array.isArray(object.material)?object.material:[object.material]
        materials.forEach((material)=>{
          if(!material)return
          material.side=THREE.DoubleSide
          material.transparent=false
          material.opacity=1
          material.depthWrite=true
          material.needsUpdate=true
        })
      })

      model.updateMatrixWorld(true)
      const sourceBox=new THREE.Box3().setFromObject(model)
      const center=sourceBox.getCenter(new THREE.Vector3())
      const size=sourceBox.getSize(new THREE.Vector3())
      const maxDimension=Math.max(size.x,size.y,size.z)

      if(!Number.isFinite(maxDimension)||maxDimension<=0){
        setStatus('3D BOUNDS ERROR')
        return
      }

      model.position.set(-center.x,-center.y,-center.z)
      pivot.add(model)
      pivot.scale.setScalar(4.5/maxDimension)
      pivot.rotation.set(-.06,-.3,0)
      pivot.position.set(.15,-.05,0)
      pivot.updateMatrixWorld(true)

      // Fit the normalized object from its actual final bounds.
      const finalBox=new THREE.Box3().setFromObject(pivot)
      const finalCenter=finalBox.getCenter(new THREE.Vector3())
      const finalSize=finalBox.getSize(new THREE.Vector3())
      pivot.position.x-=finalCenter.x
      pivot.position.y-=finalCenter.y
      pivot.position.z-=finalCenter.z

      const radius=Math.max(finalSize.length()*.5,1)
      camera.position.set(0,radius*.05,radius*2.65)
      camera.lookAt(0,0,0)
      camera.near=.05
      camera.far=radius*10
      camera.updateProjectionMatrix()

      setStatus(`${meshes} MESHES · 3D READY`)
      host.classList.add('is-ready')
    },undefined,(error)=>{
      console.error('[DJSTAR 3D] load failed',error)
      setStatus('3D LOAD FAILED')
      host.classList.add('is-error')
    })

    const render=()=>{
      raf=requestAnimationFrame(render)
      if(model){
        pivot.rotation.y+=(-.3+pointerX*.12-pivot.rotation.y)*.045
        pivot.rotation.x+=(-.06-pointerY*.055-pivot.rotation.x)*.045
      }
      renderer.render(scene,camera)
    }
    render()

    return()=>{
      cancelAnimationFrame(raf)
      ro.disconnect()
      host.removeEventListener('pointermove',move)
      renderer.dispose()
    }
  },[])

  return <div className="djstar-3d-shell">
    <div ref={hostRef} className="djstar-3d-stage">
      <canvas ref={canvasRef} className="djstar-webgl" />
      <div className="djstar-3d-status">{status}</div>
    </div>
    <div className="djstar-3d-caption"><span>DJSTAR / OBSERVATORY TERMINAL</span><i>INTERACTIVE 3D</i></div>
  </div>
}
