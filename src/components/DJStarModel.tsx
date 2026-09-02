import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export default function DJStarModel(){
  const hostRef=useRef<HTMLDivElement>(null)

  useEffect(()=>{
    const host=hostRef.current
    if(!host)return

    const setDebug=(message:string)=>{
      host.dataset.debug=message
      console.log(`[DJSTAR 3D] ${message}`)
    }

    const scene=new THREE.Scene()
    const camera=new THREE.PerspectiveCamera(36,1,.1,100)
    camera.position.set(0,0,8)

    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true})
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.outputColorSpace=THREE.SRGBColorSpace
    renderer.toneMapping=THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure=1.4
    renderer.setClearColor(0x000000,0)
    host.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff,2.2))
    const key=new THREE.DirectionalLight(0xffffff,5);key.position.set(4,6,6);scene.add(key)
    const fill=new THREE.DirectionalLight(0x7fb9ff,3);fill.position.set(-5,2,5);scene.add(fill)

    // Permanent origin marker. If this is visible, WebGL/camera/CSS are all working.
    const marker=new THREE.Mesh(
      new THREE.BoxGeometry(.28,.28,.28),
      new THREE.MeshBasicMaterial({color:0xff2d55})
    )
    scene.add(marker)
    const axes=new THREE.AxesHelper(1.5)
    scene.add(axes)

    const pivot=new THREE.Group()
    scene.add(pivot)
    let model:THREE.Group|null=null
    let raf=0
    let pointerX=0
    let pointerY=0

    setDebug('WEBGL TEST • REQUESTING GLB')

    new GLTFLoader().load('/assets/models/IBM_5155.glb',(gltf)=>{
      model=gltf.scene
      let meshCount=0
      model.traverse((o)=>{
        if(o instanceof THREE.Mesh){
          meshCount++
          const mats=Array.isArray(o.material)?o.material:[o.material]
          mats.forEach((m)=>{
            if(m){m.side=THREE.DoubleSide;m.transparent=false;m.opacity=1;m.depthWrite=true;m.needsUpdate=true}
          })
        }
      })

      // Normalize using a wrapper so the imported hierarchy itself is untouched.
      const box=new THREE.Box3().setFromObject(model)
      const center=box.getCenter(new THREE.Vector3())
      const size=box.getSize(new THREE.Vector3())
      const maxDim=Math.max(size.x,size.y,size.z)
      if(!Number.isFinite(maxDim)||maxDim<=0){setDebug(`INVALID BOUNDS • meshes ${meshCount}`);return}

      model.position.sub(center)
      pivot.add(model)
      pivot.scale.setScalar(4/maxDim)
      pivot.rotation.set(-.05,-.28,0)
      pivot.updateMatrixWorld(true)

      // Camera is deliberately fixed and close: normalized model must be visible here.
      camera.position.set(0,.15,7.2)
      camera.near=.1
      camera.far=50
      camera.lookAt(0,0,0)
      camera.updateProjectionMatrix()

      const finalSize=new THREE.Box3().setFromObject(pivot).getSize(new THREE.Vector3())
      setDebug(`GLB OK • ${meshCount} MESHES • ${finalSize.x.toFixed(1)}×${finalSize.y.toFixed(1)}×${finalSize.z.toFixed(1)} • PINK CUBE = WEBGL OK`)
      host.classList.add('model-loaded')
    },undefined,(err)=>{
      console.error('[DJSTAR 3D] GLB load failed',err)
      setDebug('GLB LOAD FAILED')
      host.classList.add('model-missing')
    })

    const resize=()=>{
      const r=host.getBoundingClientRect()
      if(!r.width||!r.height)return
      renderer.setSize(r.width,r.height,false)
      camera.aspect=r.width/r.height
      camera.updateProjectionMatrix()
      console.log('[DJSTAR 3D] canvas',Math.round(r.width),Math.round(r.height),'buffer',renderer.domElement.width,renderer.domElement.height)
    }
    const move=(e:PointerEvent)=>{
      const r=host.getBoundingClientRect()
      pointerX=(e.clientX-r.left)/r.width-.5
      pointerY=(e.clientY-r.top)/r.height-.5
    }
    const ro=new ResizeObserver(resize);ro.observe(host);resize()
    host.addEventListener('pointermove',move)

    const render=()=>{
      raf=requestAnimationFrame(render)
      marker.rotation.x+=.012
      marker.rotation.y+=.018
      if(model){
        pivot.rotation.y+=(-.28+pointerX*.08-pivot.rotation.y)*.04
        pivot.rotation.x+=(-.05-pointerY*.04-pivot.rotation.x)*.04
      }
      renderer.render(scene,camera)
    }
    render()

    return()=>{
      cancelAnimationFrame(raf);ro.disconnect();host.removeEventListener('pointermove',move)
      renderer.dispose();renderer.domElement.remove()
    }
  },[])

  return <div className="djstar-3d-shell"><div ref={hostRef} className="djstar-3d-canvas"><span className="djstar-model-error">3D MODEL FILE REQUIRED</span></div><div className="djstar-3d-caption"><span>DJSTAR / OBSERVATORY TERMINAL</span><i>INTERACTIVE 3D</i></div></div>
}
