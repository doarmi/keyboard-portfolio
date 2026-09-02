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
  return (
    <main>
      <KeyboardHero />
      <Projects />
      <About />
      <Skills />
      <Contact />
    </main>
  )
}
