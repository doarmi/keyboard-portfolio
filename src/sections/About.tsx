import { useState } from 'react'

const email = 'dae04011@naver.com'

export default function About() {
  const [emailCopied, setEmailCopied] = useState(false)

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email)
    setEmailCopied(true)

    window.setTimeout(() => {
      setEmailCopied(false)
    }, 1600)
  }

  return (
    <section id="about" className="about-section">
      <div className="section-kicker">ABOUT ME</div>

      <div className="about-grid">
        <div className="about-copy">
          <h2>HYOJIN AHN</h2>
          <p className="about-role">
            SERVICE PLANNING · UI/UX DESIGN · INTERACTIVE WEB · WEB PUBLISHER
          </p>
          <p>
            사용자의 흐름을 설계하고 아이디어를 구체화해
            <br />
            실제로 작동하는 디지털 경험으로 만듭니다
          </p>
        </div>

        <dl className="profile-meta">
          <div>
            <dt>EMAIL</dt>
            <dd className="email-actions">
              <a href={`mailto:${email}`}>{email}</a>

              <button
                type="button"
                className={`copy-email-button ${emailCopied ? 'is-copied' : ''}`}
                onClick={copyEmail}
                aria-label="이메일 주소 복사"
                title="이메일 주소 복사"
              >
                <svg
                  viewBox="0 0 24 24"
                  width="15"
                  height="15"
                  aria-hidden="true"
                >
                  <rect x="8" y="8" width="11" height="11" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                </svg>
                <span>{emailCopied ? 'COPIED' : 'COPY'}</span>
              </button>
            </dd>
          </div>

          <div>
            <dt>INSTAGRAM</dt>
            <dd>
              <a
                href="https://www.instagram.com/hyoguzip/"
                target="_blank"
                rel="noreferrer"
              >
                @hyoguzip
              </a>
            </dd>
          </div>

          <div>
            <dt>FOCUS</dt>
            <dd>Service Planning · UI/UX</dd>
          </div>

          <div>
            <dt>STATUS</dt>
            <dd>Open to work</dd>
          </div>
        </dl>
      </div>
    </section>
  )
}