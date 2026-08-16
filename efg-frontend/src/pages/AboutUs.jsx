export default function AboutUs() {
  const missionImg = '/src/assets/about-us/pexels-fauxels-3228747.jpg'
  const storyImg = '/src/assets/about-us/pexels-ivan-s-8117466.jpg'
  const supportImg = '/src/assets/about-us/pexels-ivan-s-8117476.jpg'

  return (
    <div className="efg-about-wrapper">
      
      {/* ── SECTION 1: OUR MISSION (Text Left, Blob Image Right) ── */}
      <section className="efg-about-section">
        <div className="efg-about-content">
          <span className="efg-about-eyebrow">Who We Are</span>
          <h2 className="efg-about-heading">Our Mission</h2>
          <p className="efg-about-text">
            There's this notion that to choose a college or plan a career, you have to navigate a maze of financial uncertainties. But we know there's a better way to plan. One where transparency is standard, and students can see full estimations upfront.
          </p>
          <p className="efg-about-text">
            We believe that every graduating student and family deserves complete transparency of tuition fees, laboratory charges, and miscellaneous costs without hidden surprises. That's why we created the Educational Financial Guide (EFG) platform—uniting verified academic directories, robust calculators, and granular fee details to help families budget better every single day.
          </p>
        </div>
        
        <div className="efg-about-blob-container">
          <div className="efg-about-blob-bg" />
          <div className="efg-about-blob-image-wrapper">
            <img 
              src={missionImg} 
              alt="Our Mission" 
              className="efg-about-blob-image"
              onError={(e) => {
                e.target.style.display = 'none'
                const parent = e.target.parentNode
                parent.style.backgroundColor = '#f8fafc'
                parent.style.display = 'flex'
                parent.style.alignItems = 'center'
                parent.style.justifyContent = 'center'
                parent.innerHTML = '<span style="color:#94a3b8;font-size:0.9rem;font-weight:600">Our Mission Image</span>'
              }}
            />
          </div>
        </div>
      </section>

      {/* ── SECTION 2: OUR STORY (Center Title, Video/Story Left, Text Right) ── */}
      <section className="efg-about-center-header">
        <h2 className="efg-about-heading" style={{ marginBottom: '1.25rem' }}>Our Story</h2>
        <p className="efg-about-text" style={{ maxWidth: '680px', margin: '0 auto' }}>
          EFG started with a simple observation: finding out what college actually costs shouldn't require making dozens of phone calls or reading complex PDF booklets.
        </p>
      </section>

      <section className="efg-about-section reverse" style={{ gridTemplateColumns: '1.1fr 0.9fr' }}>
        <div className="efg-about-video-container">
          <img 
            src={storyImg} 
            alt="Our Story" 
            className="efg-about-video-image"
            onError={(e) => {
              e.target.style.display = 'none'
              const parent = e.target.parentNode
              parent.style.backgroundColor = '#f8fafc'
              parent.style.display = 'flex'
              parent.style.alignItems = 'center'
              parent.style.justifyContent = 'center'
              parent.innerHTML = '<span style="color:#94a3b8;font-size:0.9rem;font-weight:600">Our Story Image</span>'
            }}
          />
          <button className="efg-about-play-button" aria-label="Play Story Video">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '4px' }}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>

        <div className="efg-about-content">
          <p className="efg-about-text">
            As students planning our own academic next steps, we noticed that tuition figures published on official websites rarely matched the actual bills. Miscellaneous items, uniform fees, and succeeding-year tuition shifts were often left out.
          </p>
          <p className="efg-about-text">
            To solve this, we gathered verified institution fee structures and built a transparent cost platform. Today, EFG offers detailed multi-year charts and print-ready PDF cost reports, helping thousands of local families make confident, stress-free decisions about their educational investments.
          </p>
        </div>
      </section>

      {/* ── SECTION 3: GET IN TOUCH (Text Left, Blob Image Right) ── */}
      <section className="efg-about-section">
        <div className="efg-about-content">
          <span className="efg-about-eyebrow">Get in touch</span>
          <h2 className="efg-about-heading">Support &amp; Registry</h2>
          <p className="efg-about-text">
            We work directly with school administrations and registrars to keep our directories up to date. If you represent an academic school and want to update your pricing structures or list new courses, get in touch with our team.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(58,155,142,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3a9b8e' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>Email Us</div>
                <span style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f1b33' }}>support@educationalfinancialguide.gov</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: 'rgba(230,126,34,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#e67e22' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em' }}>Call Us</div>
                <span style={{ fontSize: '0.96rem', fontWeight: 700, color: '#0f1b33' }}>+63 (02) 8888-1234</span>
              </div>
            </div>
          </div>
        </div>

        <div className="efg-about-blob-container">
          <div className="efg-about-blob-bg" style={{ transform: 'rotate(15deg)', background: 'radial-gradient(circle, rgba(230,126,34,0.1) 0%, rgba(58,155,142,0.06) 65%, rgba(0,0,0,0) 100%)' }} />
          <div className="efg-about-blob-image-wrapper" style={{ borderRadius: '35% 65% 40% 60% / 60% 40% 60% 40%' }}>
            <img 
              src={supportImg} 
              alt="Registry & Support" 
              className="efg-about-blob-image"
              onError={(e) => {
                e.target.style.display = 'none'
                const parent = e.target.parentNode
                parent.style.backgroundColor = '#f8fafc'
                parent.style.display = 'flex'
                parent.style.alignItems = 'center'
                parent.style.justifyContent = 'center'
                parent.innerHTML = '<span style="color:#94a3b8;font-size:0.9rem;font-weight:600">Registry Image</span>'
              }}
            />
          </div>
        </div>
      </section>

    </div>
  )
}
