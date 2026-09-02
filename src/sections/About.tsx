export default function About() {
  return (
    <section id="about" className="about-section">
      <div className="section-kicker">ABOUT ME</div>
      <div className="about-grid">
        <div className="profile-placeholder" aria-hidden="true"><span>PROFILE</span></div>
        <div className="about-copy">
          <h2>HYOJIN AHN</h2>
          <p className="about-role">WEB DESIGN · FRONTEND · VIBE CODING</p>
          <p>사용자의 경험을 중심으로 디자인과 인터랙션을 연결하고 실제로 작동하는 웹 경험을 만듭니다</p>
        </div>
        <dl className="profile-meta">
          <div><dt>LOCATION</dt><dd>Daejeon, Korea</dd></div>
          <div><dt>FOCUS</dt><dd>Interactive Web</dd></div>
          <div><dt>STATUS</dt><dd>Open to work</dd></div>
        </dl>
      </div>
    </section>
  )
}
