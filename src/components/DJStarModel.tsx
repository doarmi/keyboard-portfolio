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
    const camera=new THREE.PerspectiveCamera(34,1,.01,100)
    camera.position.set(0,0,8)
    camera.lookAt(0,0,0)

    const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true})
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
    renderer.outputColorSpace=THREE.SRGBColorSpace
    renderer.toneMapping=THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure=1.35
    renderer.shadowMap.enabled=true
    renderer.shadowMap.type=THREE.PCFSoftShadowMap
    renderer.setClearColor(0x000000,0)
    host.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff,1.4))
    const hemi=new THREE.HemisphereLight(0xd9e8ff,0x10151b,2.4);scene.add(hemi)
    const key=new THREE.DirectionalLight(0xffffff,4.5);key.position.set(4,6,6);scene.add(key)
    const fill=new THREE.DirectionalLight(0x8dbdff,2.8);fill.position.set(-5,2,4);scene.add(fill)

    const pivot=new THREE.Group()
    scene.add(pivot)

    const axes=new THREE.AxesHelper(2.6)
    axes.visible=false
    scene.add(axes)

    let model:THREE.Group|null=null
    let helper:THREE.Box3Helper|null=null
    let raf=0
    let pointerX=0
    let pointerY=0

    setDebug('REQUESTING /assets/models/IBM_5155.glb')

    new GLTFLoader().load(
      '/assets/models/IBM_5155.glb',
      (gltf)=>{
        model=gltf.scene
        let meshCount=0
        model.traverse((object)=>{
          if(object instanceof THREE.Mesh){
            meshCount+=1
            object.castShadow=true
            object.receiveShadow=true
            const material=object.material as THREE.MeshStandardMaterial
            if(material?.isMeshStandardMaterial){
              material.envMapIntensity=.8
              material.side=THREE.DoubleSide
              material.needsUpdate=true
            }
          }
        })

        const rawBox=new THREE.Box3().setFromObject(model)
        const rawCenter=rawBox.getCenter(new THREE.Vector3())
        const rawSize=rawBox.getSize(new THREE.Vector3())
        const maxDim=Math.max(rawSize.x,rawSize.y,rawSize.z)

        console.log('[DJSTAR 3D] raw center',rawCenter.toArray())
        console.log('[DJSTAR 3D] raw size',rawSize.toArray(),'meshCount',meshCount)

        if(!Number.isFinite(maxDim)||maxDim<=0){
          setDebug(`INVALID MODEL BOUNDS | meshes ${meshCount}`)
          return
        }

        model.position.copy(rawCenter).multiplyScalar(-1)
        pivot.add(model)
        pivot.scale.setScalar(4.6/maxDim)
        pivot.updateMatrixWorld(true)

        const fittedBox=new THREE.Box3().setFromObject(pivot)
        const fittedCenter=fittedBox.getCenter(new THREE.Vector3())
        const fittedSize=fittedBox.getSize(new THREE.Vector3())
        pivot.position.sub(fittedCenter)
        pivot.rotation.set(-.04,-.22,0)
        pivot.updateMatrixWorld(true)

        helper=new THREE.Box3Helper(new THREE.Box3().setFromObject(pivot),0xff3b30)
        scene.add(helper)
        axes.visible=true

        const sphere=new THREE.Sphere()
        new THREE.Box3().setFromObject(pivot).getBoundingSphere(sphere)
        const radius=Math.max(sphere.radius,.5)
        const fov=THREE.MathUtils.degToRad(camera.fov)
        const distance=(radius/Math.sin(fov/2))*1.05
        camera.position.set(0,radius*.08,distance)
        camera.near=Math.max(.01,distance-radius*3)
        camera.far=distance+radius*6
        camera.updateProjectionMatrix()
        camera.lookAt(0,0,0)

        setDebug(`LOADED | meshes ${meshCount} | size ${fittedSize.x.toFixed(2)}×${fittedSize.y.toFixed(2)}×${fittedSize.z.toFixed(2)} | cam ${distance.toFixed(2)}`)
        host.classList.add('model-loaded')
      },
      (event)=>{
        if(event.total){
          const pct=Math.round((event.loaded/event.total)*100)
          host.dataset.debug=`LOADING ${pct}%`
        }
      },
      (error)=>{
        console.error('[DJSTAR 3D] GLB load failed',error)
        setDebug('LOAD FAILED — CHECK CONSOLE')
        host.classList.add('model-missing')
      }
    )

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

    const render=()=>{
      raf=requestAnimationFrame(render)
      if(model){
        pivot.rotation.y+=(-.22+pointerX*.08-pivot.rotation.y)*.04
        pivot.rotation.x+=(-.04-pointerY*.04-pivot.rotation.x)*.04
        if(helper){
          scene.remove(helper)
          helper=new THREE.Box3Helper(new THREE.Box3().setFromObject(pivot),0xff3b30)
          scene.add(helper)
        }
      }
      renderer.render(scene,camera)
    }
    render()

    return()=>{
      cancelAnimationFrame(raf)
      ro.disconnect()
      host.removeEventListener('pointermove',move)
      if(helper)scene.remove(helper)
      renderer.dispose()
      renderer.domElement.remove()
    }
  },[])

  return <div className="djstar-3d-shell"><div ref={hostRef} className="djstar-3d-canvas"><span className="djstar-model-error">3D MODEL FILE REQUIRED</span><div className="djstar-debug-readout"/></div><div className="djstar-3d-caption"><span>DJSTAR / OBSERVATORY TERMINAL</span><i>INTERACTIVE 3D</i></div></div>
}
