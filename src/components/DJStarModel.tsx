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
    const camera=new THREE.PerspectiveCamera(35,1,.01,100)
    camera.position.set(0,.25,8)
    camera.lookAt(0,0,0)

    // Opaque canvas on purpose: this removes every alpha/compositing ambiguity.
    const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,powerPreference:'high-performance'})
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.outputColorSpace=THREE.SRGBColorSpace
    renderer.toneMapping=THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure=1.35
    renderer.setClearColor(0x071522,1)

    scene.add(new THREE.HemisphereLight(0xffffff,0x1b2633,3.2))
    const key=new THREE.DirectionalLight(0xffffff,5.5);key.position.set(4,6,7);scene.add(key)
    const fill=new THREE.DirectionalLight(0x8dbdff,3.2);fill.position.set(-5,2,5);scene.add(fill)
    const warm=new THREE.PointLight(0xffb36b,2.4,20);warm.position.set(3,-1,4);scene.add(warm)

    const pivot=new THREE.Group()
    scene.add(pivot)
    let model:THREE.Group|null=null
    let raf=0
    let pointerX=0
    let pointerY=0

    const resize=()=>{
      const rect=host.getBoundingClientRect()
      const width=Math.max(320,Math.round(rect.width))
      const height=Math.max(390,Math.round(rect.height))
      renderer.setSize(width,height,false)
      camera.aspect=width/height
      camera.updateProjectionMatrix()
    }
    const ro=new ResizeObserver(resize);ro.observe(host);resize()

    const move=(event:PointerEvent)=>{
      const rect=host.getBoundingClientRect()
      pointerX=(event.clientX-rect.left)/rect.width-.5
      pointerY=(event.clientY-rect.top)/rect.height-.5
    }
    host.addEventListener('pointermove',move)

    new GLTFLoader().load('/assets/models/IBM_5155.glb',(gltf)=>{
      model=gltf.scene
      let meshes=0
      model.traverse((object)=>{
        if(!(object instanceof THREE.Mesh))return
        meshes++
        object.frustumCulled=false
        const materials=Array.isArray(object.material)?object.material:[object.material]
        materials.forEach((material)=>{
          if(!material)return
          material.side=THREE.DoubleSide
          material.transparent=false
          material.opacity=1
          material.depthTest=true
          material.depthWrite=true
          material.needsUpdate=true
        })
      })

      model.updateMatrixWorld(true)
      const sourceBox=new THREE.Box3().setFromObject(model)
      const center=sourceBox.getCenter(new THREE.Vector3())
      const size=sourceBox.getSize(new THREE.Vector3())
      const maxDim=Math.max(size.x,size.y,size.z)
      if(!Number.isFinite(maxDim)||maxDim<=0){setStatus('3D BOUNDS ERROR');return}

      // Center the imported hierarchy first, then normalize the wrapper.
      model.position.sub(center)
      pivot.add(model)
      pivot.scale.setScalar(4.6/maxDim)
      pivot.rotation.set(-.04,-.22,0)
      pivot.updateMatrixWorld(true)

      // One final world-space centering pass.
      const worldBox=new THREE.Box3().setFromObject(pivot)
      const worldCenter=worldBox.getCenter(new THREE.Vector3())
      pivot.position.sub(worldCenter)
      pivot.updateMatrixWorld(true)

      const fittedSize=new THREE.Box3().setFromObject(pivot).getSize(new THREE.Vector3())
      const verticalFov=THREE.MathUtils.degToRad(camera.fov)
      const fitHeightDistance=(fittedSize.y*.5)/Math.tan(verticalFov*.5)
      const fitWidthDistance=((fittedSize.x*.5)/Math.tan(verticalFov*.5))/Math.max(camera.aspect,.5)
      const distance=Math.max(fitHeightDistance,fitWidthDistance)*1.35
      camera.position.set(0,fittedSize.y*.05,distance)
      camera.near=Math.max(.01,distance/100)
      camera.far=distance*20
      camera.lookAt(0,0,0)
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
        pivot.rotation.y+=(-.22+pointerX*.1-pivot.rotation.y)*.04
        pivot.rotation.x+=(-.04-pointerY*.045-pivot.rotation.x)*.04
      }
      renderer.render(scene,camera)
    }
    render()

    return()=>{cancelAnimationFrame(raf);ro.disconnect();host.removeEventListener('pointermove',move);renderer.dispose()}
  },[])

  return <div className="djstar-3d-shell">
    <div ref={hostRef} className="djstar-3d-stage">
      <canvas ref={canvasRef} className="djstar-webgl" width="1040" height="610" />
      <div className="djstar-3d-status">{status}</div>
    </div>
    <div className="djstar-3d-caption"><span>DJSTAR / OBSERVATORY TERMINAL</span><i>INTERACTIVE 3D</i></div>
  </div>
}
