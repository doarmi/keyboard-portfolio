const skills = [
  {
    name: 'Service Planning / UI·UX',
    level: 80,
  },
  {
    name: 'AI-assisted Development',
    level: 80,
  },
  {
    name: 'Figma',
    level: 75,
  },
  {
    name: 'HTML / CSS',
    level: 75,
  },
  {
    name: 'GSAP / Interactive Web',
    level: 65,
  },
  {
    name: 'JavaScript / TypeScript',
    level: 60,
  },
  {
    name: 'React',
    level: 60,
  },
]

export default function Skills() {
  return (
    <section id="skills" className="skills-section">
      <div className="section-kicker">SKILLS</div>

      <div className="skill-progress-list">
        {skills.map((skill) => (
          <div className="skill-progress-item" key={skill.name}>
            <div className="skill-progress-header">
              <span className="skill-progress-name">
                {skill.name}
              </span>

              <span className="skill-progress-percent">
                {skill.level}%
              </span>
            </div>

            <div
              className="skill-progress-track"
              role="progressbar"
              aria-label={skill.name}
              aria-valuenow={skill.level}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="skill-progress-bar"
                style={{ width: `${skill.level}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}