import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import About from './sections/About'
import Boot from './sections/Boot'
import Contact from './sections/Contact'
import KeyboardHero from './sections/KeyboardHero'
import KeyboardOS from './sections/KeyboardOS'
import Projects from './sections/Projects'
import Skills from './sections/Skills'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  return (
    <main>
      <Boot />
      <KeyboardHero />
      <KeyboardOS />
      <Projects />
      <About />
      <Skills />
      <Contact />
    </main>
  )
}
