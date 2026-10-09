import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { examples, type Args, type SurfaceId } from '../examples';
import { CopyButton } from './ui';

const VIEWPORTS: { label: string; width: number | null }[] = [
  { label: 'Fit', width: null }, { label: '375', width: 375 }, { label: '768', width: 768 }, { label: '1280', width: 1280 },
];

/** Posts messages to a preview frame and listens to it. The frame is a separate document (preview.html). */
function useFrame(onMessage: (data: { type: string; [k: string]: unknown }) => void) {
  const ref = useRef<HTMLIFrameElement>(null);
  const handler = useRef(onMessage);
  handler.current = onMessage;
  useEffect(() => {
    const listen = (e: MessageEvent) => {
      if (e.source !== ref.current?.contentWindow || e.data?.source !== 'baas-preview') return;
      handler.current(e.data);
    };
    addEventListener('message', listen);
    return () => removeEventListener('message', listen);
  }, []);
  const post = useCallback((msg: Record<string, unknown>) => {
    ref.current?.contentWindow?.postMessage({ source: 'baas-portal', ...msg }, location.origin);
  }, []);
  return { ref, post };
}

export function Playground({ slug }: { slug: string }) {
  const example = examples[slug];
  const [args, setArgs] = useState<Args>(example.defaults);
  const [surface, setSurface] = useState<SurfaceId>(example.surfaces[0]);
  const [viewport, setViewport] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const autoSurface = useRef(false);
  const uid = useId();

  const [stageHeight, setStageHeight] = useState(280);
  const [zoom, setZoom] = useState(1);
  const { ref, post } = useFrame((data) => {
    if (data.type === 'ready') setReady(true);
    if (data.type === 'height') { setStageHeight(Math.max(280, Math.min(1200, Number(data.height)))); setZoom(Number(data.zoom ?? 1)); }
    if (data.type === 'args') setArgs((a) => ({ ...a, ...(data.args as Args) }));
  });
  useEffect(() => { if (ready) post({ type: 'args', args }); }, [ready, args, post]);
  useEffect(() => { if (ready) post({ type: 'surface', surface }); }, [ready, surface, post]);

  // Follow the component's own rule for surfaces (inverse appearance belongs on a dark surface).
  const suggested = example.surfaceFor?.(args);
  useEffect(() => {
    if (suggested) { setSurface(suggested); autoSurface.current = true; }
    else if (autoSurface.current) { setSurface(example.surfaces[0]); autoSurface.current = false; }
  }, [suggested, example]);

  const reset = () => { setArgs(example.defaults); setSurface(example.surfaces[0]); setViewport(null); autoSurface.current = false; };
  const code = example.code(args);
  const visible = example.controls.filter((c) => !c.when || c.when(args));

  return (
    <div className="p-play">
      <div className="p-play__toolbar">
        <div className="p-seg" role="group" aria-label="Preview surface">
          {example.surfaces.map((s) => (
            <button key={s} type="button" aria-pressed={surface === s} onClick={() => { setSurface(s); autoSurface.current = false; }}>{s}</button>
          ))}
        </div>
        <div className="p-seg" role="group" aria-label="Viewport width">
          {VIEWPORTS.map((v) => <button key={v.label} type="button" aria-pressed={viewport === v.width} onClick={() => setViewport(v.width)}>{v.label}</button>)}
        </div>
        <button type="button" className="p-btn" onClick={reset}>Reset</button>
      </div>

      <div className="p-play__body">
        <div className="p-play__stage">
          <iframe ref={ref} title={`${slug} live preview`} src={`${import.meta.env.BASE_URL}preview.html?c=${slug}&view=playground`} style={{ width: viewport ?? '100%', minHeight: stageHeight }} />
        </div>
        <form className="p-play__controls" aria-label="Preview controls" onSubmit={(e) => e.preventDefault()}>
          {visible.map((c) => {
            const id = `${uid}-${c.name}`;
            const set = (value: string | boolean) => setArgs((a) => ({ ...a, [c.name]: value }));
            return (
              <div className="p-field" key={c.name} data-type={c.type}>
                <label htmlFor={id}>{c.label}</label>
                {c.type === 'select' && <select id={id} value={String(args[c.name])} onChange={(e) => set(e.target.value)}>{c.options!.map((o) => <option key={o}>{o}</option>)}</select>}
                {c.type === 'text' && <input id={id} type="text" value={String(args[c.name])} onChange={(e) => set(e.target.value)} />}
                {c.type === 'boolean' && <input id={id} type="checkbox" role="switch" className="p-switch" checked={args[c.name] === true} onChange={(e) => set(e.target.checked)} />}
                {c.note && <p className="p-field__note">{c.note}</p>}
              </div>
            );
          })}
        </form>
      </div>
      {(example.hint || zoom < 1) && <p className="p-play__hint">{zoom < 1 && <>Shown at {Math.round(zoom * 100)}% to fit: the design width is {example.naturalWidth} px. </>}{example.hint}</p>}

      <div className="p-code">
        <div className="p-code__bar">
          <span>Usage · <strong>Portal implementation</strong>, pending developer validation</span>
          <CopyButton value={code} label="Copy code" />
        </div>
        <pre tabIndex={0}><code>{code}</code></pre>
      </div>
    </div>
  );
}

/** Static matrix of every variant and state, rendered in its own frame and sized to its content. */
export function Matrix({ slug }: { slug: string }) {
  const [height, setHeight] = useState(320);
  const { ref } = useFrame((data) => { if (data.type === 'height') setHeight(Number(data.height)); });
  return <iframe ref={ref} className="p-matrix" title={`${slug} variants and states`} src={`${import.meta.env.BASE_URL}preview.html?c=${slug}&view=matrix`} style={{ height }} />;
}

/** Non-interactive thumbnail for catalog cards. */
export function Thumb({ slug }: { slug: string }) {
  return <iframe className="p-thumb" title="" aria-hidden="true" tabIndex={-1} loading="lazy" src={`${import.meta.env.BASE_URL}preview.html?c=${slug}&view=playground&thumb=1`} />;
}
