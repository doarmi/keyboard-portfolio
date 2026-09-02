import { useEffect, useState } from 'react'
import ThreeKeyboard from '../three/ThreeKeyboard'

type ProjectKey = 'P' | 'D' | 'O'

const messages: Record<ProjectKey, string> = {
  P: 'P 키를 눌러 PLIVY에 방문해보세요',
  D: 'D 키를 눌러 대전시민천문대에 방문해보세요',
  O: 'O 키를 눌러 OASIS에 방문해보세요',
}

export default function KeyboardHero() {
  const [project, setProject] = useState<ProjectKey | null>(null)
  const [discovered, setDiscovered] = useState(false)

  useEffect(() => {
    const handleHover = (event: Event) => {
      const detail = (event as CustomEvent<ProjectKey | null>).detail
      setProject(detail)
      if (detail) setDiscovered(true)
    }
    window.addEventListener('keyboard-project-hover', handleHover)
    return () => window.removeEventListener('keyboard-project-hover', handleHover)
  }, [])

  return (
    <section className="keyboard-hero" id="keyboard-hero">
      <div className="keyboard-stage">
        <header className="keyboard-ui-header">
          <span>KEYBOARD / PORTFOLIO</span>
          <span>2026</span>
        </header>

        <ThreeKeyboard />

        <div className={`interaction-guide ${project ? 'is-project' : ''}`}>
          {project ? (
            <>
              <kbd>{project}</kbd>
              <span>{messages[project]}</span>
            </>
          ) : (
            <>
              <span className="cursor-symbol">↖</span>
              <span>{discovered ? '다른 프로젝트 키도 탐색해보세요' : '마우스를 키보드 위로 움직여보세요'}</span>
            </>
          )}
        </div>

        <div className="project-key-legend" aria-label="Project shortcuts">
          <span><b>P</b> PLIVY</span>
          <span><b>D</b> DJSTAR</span>
          <span><b>O</b> OASIS</span>
        </div>
      </div>
    </section>
  )
}
