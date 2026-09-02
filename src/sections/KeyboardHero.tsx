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

const scrubImage = '/assets/scrub/keyboard_01_wide.webp'

export default function KeyboardHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const interactionRef = useRef<HTMLDivElement>(null)
  const [project, setProject] = useState<ProjectKey | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const image = imageRef.current
    const interaction = interactionRef.current
    if (!section || !image || !interaction) return

    gsap.set(image, {
      scale: 1.03,
      xPercent: 0,
      yPercent: 0,
      transformOrigin: '53% 58%',
    })
    gsap.set(interaction, { opacity: 0, pointerEvents: 'none' })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.15,
        onUpdate: self => {
          const isReady = self.progress > 0.88
          setReady(isReady)
          gsap.set(interaction, {
            opacity: isReady ? gsap.utils.mapRange(0.88, 0.96, 0, 1, self.progress) : 0,
            pointerEvents: isReady ? 'auto' : 'none',
          })
        },
      },
    })

    tl.to(image, {
      scale: 1.24,
      xPercent: -1.2,
      yPercent: 1.4,
      duration: 0.38,
      ease: 'none',
    })
      .to(image, {
        scale: 1.52,
        xPercent: -2.4,
        yPercent: 2.5,
        duration: 0.34,
        ease: 'none',
      })
      .to(image, {
        scale: 1.88,
        xPercent: -3.6,
        yPercent: 3.8,
        duration: 0.28,
        ease: 'none',
      })

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
          <img
            ref={imageRef}
            src={scrubImage}
            alt=""
            className="keyboard-scrub-frame keyboard-scrub-single"
            draggable={false}
          />
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
