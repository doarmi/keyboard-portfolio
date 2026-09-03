import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import '../styles/djstar.css'
import '../styles/oasis.css'
import '../styles/plivy.css'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    slug: 'plivy',
    name: 'PLIVY',
    subtitle: 'Music Diary Community',
    description:
      '음악과 함께한 순간을 기록하고 다시 발견하는\n음악 다이어리 커뮤니티',
    href: 'https://plivy-intro.vercel.app',
    visual: 'iphone',
  },
  {
    slug: 'oasis',
    name: 'OASIS',
    subtitle: 'Fan Experience Platform',
    description:
      '밴드와 팬의 경험을 하나의 공간으로 연결한\n인터랙티브 팬 플랫폼',
    href: 'https://oasis-xi-eight.vercel.app/',
    visual: 'vinyl',
  },
  {
    slug: 'djstar',
    name: 'DJSTAR',
    subtitle: 'Observatory Experience',
    description:
      '우주를 관측하고 배우며 직접 탐험하는\n대전시민천문대 디지털 경험',
    href: 'https://djstar-observatory.vercel.app/',
    visual: 'observatory',
  },
] as const

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const root = sectionRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      gsap.utils
        .toArray<HTMLElement>('.experience-transition')
        .forEach((transition) => {
          const inner = transition.querySelector('.transition-inner')
          const line = transition.querySelector('.transition-line')

          gsap
            .timeline({
              scrollTrigger: {
                trigger: transition,
                start: 'top 78%',
                end: 'bottom 30%',
                scrub: 1,
              },
            })
            .fromTo(
              inner,
              { y: 70, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.45 },
            )
            .fromTo(
              line,
              { scaleX: 0 },
              { scaleX: 1, duration: 0.35 },
              '<0.08',
            )
            .to(
              inner,
              { y: -50, opacity: 0, duration: 0.38 },
              0.72,
            )
        })

      gsap.utils
        .toArray<HTMLElement>('.work-panel')
        .forEach((panel) => {
          const copy = panel.querySelector('.work-copy')
          const visual = panel.querySelector('.work-visual')

          gsap.fromTo(
            copy,
            { y: 45, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 72%',
              },
            },
          )

          gsap.fromTo(
            visual,
            { y: 85, scale: 0.94, opacity: 0.25 },
            {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 1.05,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 74%',
              },
            },
          )
        })

      const djstarMockup = root.querySelector<HTMLElement>(
        '.djstar-photo-mockup',
      )

      if (djstarMockup) {
        gsap.fromTo(
          djstarMockup,
          {
            rotateX: 3,
            rotateY: -3,
            y: 46,
            scale: 0.94,
          },
          {
            rotateX: 0,
            rotateY: 0,
            y: 0,
            scale: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: djstarMockup,
              start: 'top 88%',
              end: 'center 56%',
              scrub: 1,
            },
          },
        )
      }
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="projects"
      className="selected-works"
      ref={sectionRef}
    >
      <div className="works-label">SELECTED WORKS</div>

      {projects.map((project, index) => (
        <div className="project-flow" key={project.slug}>
          <article className={`work-panel work-${project.slug}`}>
            <div className="work-copy">
              <h2>{project.name}</h2>

              <p className="work-subtitle">
                {project.subtitle}
              </p>

              <p
                className="work-description"
                style={{ whiteSpace: 'pre-line' }}
              >
                {project.description}
              </p>

              <a
                className="project-view-button"
                href={project.href}
                target="_blank"
                rel="noreferrer"
              >
                <span>VIEW PROJECT</span>
              </a>
            </div>

            <div className={`work-visual visual-${project.visual}`}>
              {index === 0 && (
                <div className="iphone-mockup" aria-hidden="true">
                  <div className="iphone-island" />

                  <div className="iphone-screen">
                    <strong>PLIVY</strong>
                    <span>Good afternoon</span>

                    <div className="now-playing">
                      <img
                        className="plivy-album-art"
                        src="/assets/plivy-honest-cover.jpg"
                        alt=""
                      />

                      <small>NOW PLAYING</small>
                      <b>Honest</b>
                      <span>NOTD &amp; Lou Elliotte</span>

                      <div className="player-line" />
                      <div className="player-controls">
                        ‹　●　›
                      </div>
                    </div>

                    <div className="playlist-row">
                      RECENT RECORDS
                    </div>
                    <div className="playlist-row">
                      MY PLAYLIST
                    </div>
                  </div>
                </div>
              )}

              {index === 1 && (
                <div className="vinyl-scene" aria-hidden="true">
                  <div className="record-sleeve">
                    <img src="/assets/oasis-band.jpg" alt="" />
                  </div>

                  <div className="vinyl-disc">
                    <div className="vinyl-label">oasis</div>
                  </div>
                </div>
              )}

              {index === 2 && (
                <div className="djstar-photo-mockup">
                  <img
                    className="djstar-cockpit-photo"
                    src="/assets/djstar-console.jpg"
                    alt="Retro observatory cockpit used as the DJSTAR project visual"
                  />

                  <div
                    className="djstar-window-display"
                    aria-hidden="true"
                  >
                    <img src="/assets/saturn-cassini.jpg" alt="" />
                  </div>

                  <div className="djstar-photo-glass" />
                </div>
              )}
            </div>
          </article>

          {index === 0 && (
            <div
              className="experience-transition transition-oasis"
              aria-hidden="true"
            >
              <div className="transition-inner">
                <span>NEXT EXPERIENCE</span>
                <div className="transition-line" />
                <strong>ENTER OASIS</strong>
                <small className="scroll-cue">
                  KEEP SCROLLING <span className="scroll-cue-arrow">↓</span>
                </small>
              </div>
            </div>
          )}

          {index === 1 && (
            <div
              className="experience-transition transition-djstar"
              aria-hidden="true"
            >
              <div className="star-field" />

              <div className="transition-inner">
                <span>NEXT EXPERIENCE</span>
                <div className="transition-line" />
                <strong>ENTER THE OBSERVATORY</strong>
                <small className="scroll-cue">
                  KEEP SCROLLING <span className="scroll-cue-arrow">↓</span>
                </small>
              </div>
            </div>
          )}
        </div>
      ))}
    </section>
  )
}