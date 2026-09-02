import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type ProjectKey = 'P' | 'D' | 'O'

const messages: Record<ProjectKey, string> = {
  P: 'P 키를 눌러 PLIVY에 방문해보세요',
  D: 'D 키를 눌러 대전시민천문대를 방문해보세요',
  O: 'O 키를 눌러 OASIS에 방문해보세요',
}

const projectUrls: Record<ProjectKey, string> = {
  P: 'https://plivy-intro.vercel.app',
  D: '#',
  O: '#',
}

const frames = [
  '/assets/scrub/keyboard_01_wide.webp',
  '/assets/scrub/keyboard_02_mid.webp',
  '/assets/scrub/keyboard_03_close.webp',
  '/assets/scrub/keyboard_04_final.webp',
]

export default function KeyboardHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const frameRefs = useRef<(HTMLImageElement | null)[]>([])
  const interactionRef = useRef<HTMLDivElement>(null)
  const [project, setProject] = useState<ProjectKey | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const interaction = interactionRef.current
    const imgs = frameRefs.current.filter(Boolean) as HTMLImageElement[]
    if (!section || !interaction || imgs.length !== frames.length) return

    gsap.set(imgs, { opacity: 0, scale: 1.06 })
    gsap.set(imgs[0], { opacity: 1, scale: 1 })
    gsap.set(interaction, { opacity: 0, pointerEvents: 'none' })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.7,
        onUpdate: self => {
          const isReady = self.progress > 0.9
          setReady(isReady)
          gsap.set(interaction, {
            opacity: isReady ? 1 : 0,
            pointerEvents: isReady ? 'auto' : 'none',
          })
        },
      },
    })

    tl.to(imgs[0], { scale: 1.12, duration: 1, ease: 'none' })
      .to(imgs[1], { opacity: 1, scale: 1, duration: 0.45, ease: 'none' }, 0.72)
      .to(imgs[0], { opacity: 0, duration: 0.45, ease: 'none' }, 0.72)
      .to(imgs[1], { scale: 1.11, duration: 1, ease: 'none' }, 1.05)
      .to(imgs[2], { opacity: 1, scale: 1, duration: 0.45, ease: 'none' }, 1.72)
      .to(imgs[1], { opacity: 0, duration: 0.45, ease: 'none' }, 1.72)
      .to(imgs[2], { scale: 1.1, duration: 1, ease: 'none' }, 2.05)
      .to(imgs[3], { opacity: 1, scale: 1, duration: 0.5, ease: 'none' }, 2.72)
      .to(imgs[2], { opacity: 0, duration: 0.5, ease: 'none' }, 2.72)
      .to(imgs[3], { scale: 1.045, duration: 0.7, ease: 'none' }, 3.05)

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
    }
  }, [])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!ready) return
      const key = event.key.toUpperCase() as ProjectKey
      if (key !== 'P' && key !== 'D' && key !== 'O') return
      const url = projectUrls[key]
      if (url !== '#') window.open(url, '_blank', 'noopener,noreferrer')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ready])

  const activate = (key: ProjectKey) => {
    const url = projectUrls[key]
    if (url !== '#') window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section ref={sectionRef} className="keyboard-hero" id="keyboard-hero">
      <div className="keyboard-stage">
        <div className="keyboard-scrub" aria-hidden="true">
          {frames.map((src, index) => (
            <img
              key={src}
              ref={el => { frameRefs.current[index] = el }}
              src={src}
              alt=""
              className="keyboard-scrub-frame"
              draggable={false}
            />
          ))}
        </div>

        <header className="keyboard-ui-header">
          <span>KEYBOARD / PORTFOLIO</span>
          <span>2026</span>
        </header>

        <div ref={interactionRef} className="keyboard-interaction-layer">
          <button className="key-hotspot key-hotspot-d" onMouseEnter={() => setProject('D')} onMouseLeave={() => setProject(null)} onClick={() => activate('D')} aria-label="대전시민천문대 열기">D</button>
          <button className="key-hotspot key-hotspot-o" onMouseEnter={() => setProject('O')} onMouseLeave={() => setProject(null)} onClick={() => activate('O')} aria-label="OASIS 열기">O</button>
          <button className="key-hotspot key-hotspot-p" onMouseEnter={() => setProject('P')} onMouseLeave={() => setProject(null)} onClick={() => activate('P')} aria-label="PLIVY 열기">P</button>

          <div className={`interaction-guide ${project ? 'is-project' : ''}`}>
            {project ? (
              <><kbd>{project}</kbd><span>{messages[project]}</span></>
            ) : (
              <><span className="cursor-symbol">↖</span><span>마우스를 프로젝트 키 위로 움직여보세요</span></>
            )}
          </div>

          <div className="project-key-legend" aria-label="Project shortcuts">
            <span><b>P</b> PLIVY</span>
            <span><b>D</b> DJSTAR</span>
            <span><b>O</b> OASIS</span>
          </div>
        </div>
      </div>
    </section>
  )
}
