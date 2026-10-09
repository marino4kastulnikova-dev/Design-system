// Isolated preview frame. This document loads the BaaS tokens, fonts and component styles and nothing
// from the portal shell, so portal CSS cannot leak in and overlays stay inside the frame.
import { StrictMode, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import '../ds/fonts.css';
import '../tokens/generated/tokens.css';
import '../ds/ds.css';
import './preview.css';
import { examples, type Args, type SurfaceId } from '../examples';

const params = new URLSearchParams(location.search);
const example = examples[params.get('c') ?? ''];
const view = params.get('view') === 'matrix' ? 'matrix' : 'playground';
const surfaceVar = (s: SurfaceId) => `var(--${s.replace('/', '-')})`;
const post = (msg: Record<string, unknown>) => parent.postMessage({ source: 'baas-preview', ...msg }, location.origin);

function Playground() {
  const [args, setArgs] = useState<Args>(example.defaults);
  const [surface, setSurface] = useState<SurfaceId>((params.get('surface') as SurfaceId) || example.surfaces[0]);
  const inner = useRef<HTMLDivElement>(null);
  const thumb = params.has('thumb');
  const [scale, setScale] = useState(1);
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== location.origin || e.data?.source !== 'baas-portal') return;
      if (e.data.type === 'args') setArgs(e.data.args);
      if (e.data.type === 'surface') setSurface(e.data.surface);
    };
    addEventListener('message', onMessage);
    post({ type: 'ready' });
    // Report the content height so the portal can size the stage; thumbnails scale down to fit instead.
    const measure = () => {
      const el = inner.current; if (!el) return;
      if (thumb) { setScale(Math.min(1, (innerHeight - 24) / el.offsetHeight, (innerWidth - 24) / el.offsetWidth)); return; }
      // Large compositions keep their design width and are zoomed to fit the stage.
      const z = example.naturalWidth ? Math.min(1, (innerWidth - 48) / example.naturalWidth) : 1;
      setZoom(z);
      post({ type: 'height', height: el.offsetHeight * z + 96, zoom: z });
    };
    const ro = new ResizeObserver(measure);
    if (inner.current) ro.observe(inner.current);
    addEventListener('resize', measure);
    return () => { removeEventListener('message', onMessage); removeEventListener('resize', measure); ro.disconnect(); };
  }, [thumb]);
  return (
    <div className={`pv-stage baas-root${thumb ? ' pv-stage--thumb' : ''}`} style={{ background: surfaceVar(surface) }}>
      <div ref={inner} className="pv-stage__inner" style={{ ...(example.naturalWidth ? { width: example.naturalWidth, maxWidth: 'none', flex: 'none' } : {}), ...(thumb ? { transform: `scale(${scale})` } : zoom < 1 ? { zoom } : {}) }}>
        {example.render(args, (patch) => { setArgs((a) => ({ ...a, ...patch })); post({ type: 'args', args: patch }); })}
      </div>
    </div>
  );
}

function Matrix() {
  useEffect(() => {
    const report = () => post({ type: 'height', height: document.documentElement.scrollHeight });
    const ro = new ResizeObserver(report);
    ro.observe(document.body);
    document.fonts.ready.then(report);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="pv-matrix">
      {example.matrix().map((g, gi) => (
        <section key={gi} className={`pv-group${g.surface === 'surface/sidebar' ? ' pv-group--dark' : ''}`} style={{ background: surfaceVar(g.surface) }}>
          <table>
            <caption>{g.title}</caption>
            <thead><tr><th scope="col" />{g.columns.map((c) => <th scope="col" key={c}>{c}</th>)}</tr></thead>
            <tbody>
              {g.rows.map((r, ri) => (
                <tr key={r.label + ri}><th scope="row">{r.label}</th>{r.cells.map((n, i) => <td key={i} className="baas-root" style={g.zoom ? { zoom: g.zoom } : undefined}>{n}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
      {example.gallery?.()}
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>{!example ? <p className="pv-missing">No preview is registered for this component.</p> : view === 'matrix' ? <Matrix /> : <Playground />}</StrictMode>,
);
