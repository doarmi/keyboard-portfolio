const skills = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Three.js', 'GSAP', 'Firebase', 'Vercel']

export default function Skills() {
  return (
    <section id="skills" className="skills-section">
      <div className="section-kicker">SKILLS</div>
      <div className="skill-keys">
        {skills.map((skill) => <span className="skill-key" key={skill}>{skill}</span>)}
      </div>
    </section>
  )
}
