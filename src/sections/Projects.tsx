const projects = [
  {
    slug: 'plivy',
    name: 'PLIVY',
    subtitle: 'Music Diary Community',
    description: '음악과 함께한 순간을 기록하고 다시 발견하는 음악 다이어리 커뮤니티',
    href: 'https://plivy-intro.vercel.app',
    visual: 'iphone',
  },
  {
    slug: 'oasis',
    name: 'OASIS',
    subtitle: 'Fan Experience Platform',
    description: '밴드와 팬의 경험을 하나의 공간으로 연결한 인터랙티브 팬 플랫폼',
    href: 'https://oasis-xi-eight.vercel.app/',
    visual: 'vinyl',
  },
  {
    slug: 'djstar',
    name: 'DJSTAR',
    subtitle: 'Observatory Experience',
    description: '우주를 관측하고 배우며 직접 탐험하는 대전시민천문대 디지털 경험',
    href: 'https://djstar-observatory.vercel.app/',
    visual: 'observatory',
  },
] as const

export default function Projects() {
  return (
    <section id="projects" className="selected-works">
      <div className="works-label">SELECTED WORKS</div>
      {projects.map((project, index) => (
        <article className={`work-panel work-${project.slug}`} key={project.slug}>
          <div className="work-copy">
            <h2>{project.name}</h2>
            <p className="work-subtitle">{project.subtitle}</p>
            <p className="work-description">{project.description}</p>
            <a href={project.href} target="_blank" rel="noreferrer">VIEW PROJECT ↗</a>
          </div>

          <div className={`work-visual visual-${project.visual}`} aria-hidden="true">
            {index === 0 && (
              <div className="iphone-mockup">
                <div className="iphone-island" />
                <div className="iphone-screen">
                  <strong>PLIVY</strong>
                  <span>Good afternoon</span>
                  <div className="now-playing">
                    <small>NOW PLAYING</small>
                    <b>Honest</b>
                    <span>NOTD & Lou Elliotte</span>
                    <div className="player-line" />
                    <div className="player-controls">‹　●　›</div>
                  </div>
                  <div className="playlist-row">RECENT RECORDS</div>
                  <div className="playlist-row">MY PLAYLIST</div>
                </div>
              </div>
            )}
            {index === 1 && (
              <div className="vinyl-scene">
                <div className="record-sleeve"><b>oasis</b><span>live forever</span></div>
                <div className="vinyl-disc"><div className="vinyl-label">oasis</div></div>
              </div>
            )}
            {index === 2 && (
              <div className="observatory-console">
                <div className="observatory-screen">
                  <span className="console-brand">DJSTAR OBSERVATORY</span>
                  <div className="saturn"><i /><span /></div>
                  <strong>SATURN</strong>
                  <small>TODAY'S OBJECT</small>
                </div>
                <div className="console-controls"><i /><i /><i /></div>
              </div>
            )}
          </div>
        </article>
      ))}
    </section>
  )
}
