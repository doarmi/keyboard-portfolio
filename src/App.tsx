import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import About from './sections/About'
import Contact from './sections/Contact'
import KeyboardHero from './sections/KeyboardHero'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import './styles/refinements.css'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [isAboutArea, setIsAboutArea] = useState(false)

  useEffect(() => {
    const about = document.querySelector('#about')

    if (!about) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsAboutArea(entry.isIntersecting)
      },
      {
        threshold: 0.15,
      },
    )

    observer.observe(about)

    return () => observer.disconnect()
  }, [])

  const handleQuickNavigation = () => {
    if (isAboutArea) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      return
    }

    document.querySelector('#about')?.scrollIntoView({
      behavior: 'smooth',
    })
  }

  return (
    <main>
      <button
        type="button"
        className="quick-nav-button"
        onClick={handleQuickNavigation}
      >
        {isAboutArea ? 'INTRO ↑' : 'ABOUT ME ↓'}
      </button>

      <KeyboardHero />
      <Projects />
      <About />
      <Skills />
      <Contact />
    </main>
  )
}