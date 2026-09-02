import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type ProjectKey = 'P' | 'D' | 'O'

const projectUrls: Record<ProjectKey, string> = {
  P: 'https://plivy-intro.vercel.app',
  D: 'https://djstar-observatory.vercel.app/',
  O: 'https://oasis-xi-eight.vercel.app/',
}

const projectLabels: Record<ProjectKey, string> = {
  P: 'PLIVY',
  D: 'DJSTAR',
  O: 'OASIS',
}

const scrubImage = '/assets/scrub/keyboard_01_wide.webp'

export default function KeyboardHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const interactionRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const [activeKey, setActiveKey] = useState<ProjectKey | null>(null)

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

  const openProject = (key: ProjectKey) => {
    setActiveKey(key)
    window.setTimeout(() => {
      window.open(projectUrls[key], '_blank', 'noopener,noreferrer')
      window.setTimeout(() => setActiveKey(null), 250)
    }, 140)
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!ready) return
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      const key = event.key.toUpperCase() as ProjectKey
      if (key !== 'P' && key !== 'D' && key !== 'O') return
      event.preventDefault()
      openProject(key)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ready])

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
          <div className="interaction-guide keyboard-only-guide">
            <span>키보드에서</span>
            <kbd>P</kbd><span>PLIVY</span>
            <kbd>D</kbd><span>DJSTAR</span>
            <kbd>O</kbd><span>OASIS</span>
            <span>키를 눌러 방문하세요</span>
          </div>

          <nav className="project-shortcut-links" aria-label="Project shortcuts">
            {(['P', 'D', 'O'] as ProjectKey[]).map(key => (
              <button
                key={key}
                type="button"
                className={`project-shortcut-link ${activeKey === key ? 'is-active' : ''}`}
                onClick={() => openProject(key)}
              >
                <span className="shortcut-key">{key}</span>
                <span>{projectLabels[key]}</span>
                <span aria-hidden="true">↗</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}
