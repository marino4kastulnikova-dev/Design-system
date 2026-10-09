import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <article className="p-article">
      <header className="p-title"><h1>Page not found</h1><p className="p-lede">Nothing in the verified inventory lives at this address.</p></header>
      <p><Link to="/">Overview</Link> · <Link to="/components">All components</Link></p>
    </article>
  );
}
