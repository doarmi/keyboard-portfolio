import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useKeyboardSound } from '../hooks/useKeyboardSound'
import '../styles/keyboard-feedback.css'

gsap.registerPlugin(ScrollTrigger)

type ProjectKey = 'P' | 'D' | 'O'
const projectUrls: Record<ProjectKey, string> = {
  P: 'https://plivy-intro.vercel.app',
  D: 'https://djstar-observatory.vercel.app/',
  O: 'https://oasis-xi-eight.vercel.app/',
}
const projectKeys: { key: ProjectKey; name: string; slug: string; polygon: string }[] = [
  { key: 'P', name: 'PLIVY', slug: 'plivy', polygon: '1170,506 1203,498 1234,519 1243,540 1201,552 1181,534' },
  { key: 'D', name: 'DJSTAR', slug: 'djstar', polygon: '822,634 858,620 891,640 902,659 854,677 836,660' },
  { key: 'O', name: 'OASIS', slug: 'oasis', polygon: '1121,518 1156,510 1185,530 1196,551 1153,565 1134,547' },
]
const scrubImage = '/assets/scrub/keyboard_01_wide.webp'

export default function KeyboardHero() {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const interactionRef = useRef<HTMLDivElement>(null)
  const visibleRef = useRef(false)
  const releaseTimer = useRef<number | undefined>(undefined)
  const pressedAt = useRef(0)
  const heldKey = useRef<ProjectKey | null>(null)
  const [ready, setReady] = useState(false)
  const [activeKey, setActiveKey] = useState<ProjectKey | null>(null)
  const { soundOn, toggleSound, play } = useKeyboardSound()
  const clipId = useId().replace(/:/g, '')

  useEffect(() => {
    const section = sectionRef.current
    const image = imageRef.current
    const interaction = interactionRef.current
    const stage = stageRef.current
    if (!section || !image || !interaction || !stage) return
    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting
      if (!entry.isIntersecting) { heldKey.current = null; setActiveKey(null) }
    })
    observer.observe(stage)
    gsap.set(image, { scale: 1.03, xPercent: 0, yPercent: 0, transformOrigin: '53% 58%' })
    gsap.set(interaction, { opacity: 0, pointerEvents: 'none' })
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section, start: 'top top', end: 'bottom bottom', scrub: 1.15,
        onUpdate: self => {
          const isReady = self.progress > .88
          setReady(isReady)
          gsap.set(interaction, {
            opacity: isReady ? gsap.utils.mapRange(.88, .96, 0, 1, self.progress) : 0,
            pointerEvents: 'none',
          })
          if (!isReady) { heldKey.current = null; setActiveKey(null) }
        },
      },
    })
    tl.to(image, { scale: 1.24, xPercent: -1.2, yPercent: 1.4, duration: .38, ease: 'none' })
      .to(image, { scale: 1.52, xPercent: -2.4, yPercent: 2.5, duration: .34, ease: 'none' })
      .to(image, { scale: 1.88, xPercent: -3.6, yPercent: 3.8, duration: .28, ease: 'none' })
    return () => { observer.disconnect(); tl.scrollTrigger?.kill(); tl.kill() }
  }, [])

  const press = useCallback((key: ProjectKey) => {
    if (!ready || !visibleRef.current || heldKey.current === key) return
    window.clearTimeout(releaseTimer.current)
    heldKey.current = key
    pressedAt.current = performance.now()
    setActiveKey(key)
    play()
  }, [ready, play])

  const release = useCallback(() => {
    const key = heldKey.current
    if (!key) return
    heldKey.current = null
    window.clearTimeout(releaseTimer.current)
    releaseTimer.current = window.setTimeout(() => {
      setActiveKey(current => current === key ? null : current)
    }, Math.max(0, 160 - (performance.now() - pressedAt.current)))
  }, [])

  const openProject = useCallback((key: ProjectKey) => {
    // Stay inside the trusted click/keydown event; no delayed popup.
    window.open(projectUrls[key], '_blank', 'noopener,noreferrer')
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!ready || !visibleRef.current || event.repeat || event.ctrlKey || event.metaKey || event.altKey) return
      const target = event.target as HTMLElement | null
      if (target?.isContentEditable || target?.closest('input, textarea, select, [role="textbox"]')) return
      const key = (event.code.startsWith('Key') ? event.code.slice(3) : event.key.toUpperCase()) as ProjectKey
      if (!['P', 'D', 'O'].includes(key)) return
      event.preventDefault()
      press(key)
    }
    const onKeyUp = (event: KeyboardEvent) => {
      const key = event.code.startsWith('Key') ? event.code.slice(3) : event.key.toUpperCase()
      if (key !== heldKey.current) return
      release()
      if (!ready || !visibleRef.current || event.ctrlKey || event.metaKey || event.altKey) return
      event.preventDefault()
      openProject(key as ProjectKey)
    }
    const onVisibility = () => { if (document.hidden) release() }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
    window.addEventListener('blur', release)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
      window.removeEventListener('blur', release)
      document.removeEventListener('visibilitychange', onVisibility)
      window.clearTimeout(releaseTimer.current)
    }
  }, [ready, press, release, openProject])

  const activate = (key: ProjectKey) => {
    if (!ready || !visibleRef.current) return
    if (activeKey !== key) press(key)
    release()
    openProject(key)
  }

  return (
    <section ref={sectionRef} className="keyboard-hero" id="keyboard-hero">
      <div ref={stageRef} className="keyboard-stage">
        <button type="button" className="keyboard-sound-toggle" aria-pressed={soundOn}
          aria-label={soundOn ? '키보드 효과음 끄기' : '키보드 효과음 켜기'} onClick={toggleSound}>
          <span className="sound-indicator" aria-hidden="true" /> SOUND {soundOn ? 'ON' : 'OFF'}
        </button>
        <div className="keyboard-scrub">
          <div ref={imageRef} className="keyboard-scrub-frame keyboard-photo-plane">
            <img src={scrubImage} alt="" className="keyboard-photo-background" draggable={false} />
            <svg className={`keyboard-photo-keys ${ready ? 'is-ready' : ''}`} viewBox="0 0 1950 1096" preserveAspectRatio="xMidYMid slice">
              <defs>{projectKeys.map(({ key, polygon }) => (
                <clipPath key={key} id={`${clipId}-${key}`}><polygon points={polygon} /></clipPath>
              ))}</defs>
              {projectKeys.map(({ key, name, polygon }) => (
                <a key={key} href={projectUrls[key]} target="_blank" rel="noopener noreferrer"
                  aria-label={`${name} 프로젝트 새 탭에서 열기`} tabIndex={-1}
                  className={`photo-key ${activeKey === key ? 'is-pressed' : ''}`}
                  onPointerDown={event => { if (event.button === 0) press(key) }}
                  onClick={event => { if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); activate(key) } }}>
                  <polygon className="photo-key-well" points={polygon} />
                  <g className="photo-key-cap">
                    <image href={scrubImage} width="1950" height="1096" clipPath={`url(#${clipId}-${key})`} />
                    <polygon className="photo-key-hit" points={polygon} />
                  </g>
                </a>
              ))}
            </svg>
          </div>
        </div>
        <div ref={interactionRef} className="keyboard-interaction-layer">
          <div className={`interaction-guide keyboard-only-guide keyboard-feedback-guide ${ready ? 'is-ready' : ''}`}>
            <strong>키보드의 P · D · O를 누르거나 화면의 키를 클릭하세요</strong>
            {projectKeys.map(({ key, name, slug }) => (
              <button key={key} type="button" disabled={!ready}
                className={`guide-project guide-${slug} ${activeKey === key ? 'is-active' : ''}`}
                aria-label={`${name} 프로젝트 새 탭에서 열기`}
                onPointerDown={event => { if (event.button === 0) press(key) }} onClick={() => activate(key)}>
                <kbd>{key}</kbd><span>{name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
