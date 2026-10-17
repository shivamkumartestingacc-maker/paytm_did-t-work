export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a className="wordmark" href="#top" aria-label="Clippings, back to top">
          <span className="wordmark__name">Clippings</span>
          <span className="wordmark__tag">jobs</span>
        </a>
        <nav aria-label="Primary">
          <ul className="site-nav">
            <li>
              <a href="#roles">Open roles</a>
            </li>
            <li>
              <a href="#about">About</a>
            </li>
            <li>
              <a href="#contact">Contact</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
