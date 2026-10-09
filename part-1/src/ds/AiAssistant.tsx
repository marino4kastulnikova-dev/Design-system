// BaaS design system — AiAssistant. Source: Figma page "ai-assistant", component "AiAssistant" (381:1879).
// Portal implementation, pending developer validation. The composer is not the Input atom ("it is a chat composer").
import { useId, useState } from 'react';
import { Chip } from './Chip';
import { IconButton } from './IconButton';

export interface AiAssistantProps {
  name?: string; suggestions?: string[]; maxLength?: number;
  /** The Figma mapping lists one callback: onSend. */ onSend?: (message: string) => void;
}
export function AiAssistant({ name = 'Emily', suggestions = ['Why was my payout declined?', "Show this month's fees", 'How do I verify KYC?'], maxLength = 300, onSend }: AiAssistantProps) {
  const [text, setText] = useState('');
  const id = useId();
  const send = () => { const t = text.trim(); if (!t) return; onSend?.(t); setText(''); };
  return (
    <section className="baas-ai" aria-label="AI Assistant">
      <h2 className="ts-heading-sm">AI Assistant</h2>
      <div className="baas-ai__body">
        <div className="baas-ai__upper">
          <div className="baas-ai__hello">
            {/* The orb is raw gradient art in Figma (seven paint styles with blurs). Approximated with the same gradient tokens. */}
            <span className="baas-ai__orb" aria-hidden="true"><i /><b><u /><s /><em /></b></span>
            <div><p>Welcome, {name}</p><p>What can I help with today?</p></div>
          </div>
          <div className="baas-ai__quick">{suggestions.map((s) => <Chip key={s} size="md" onClick={() => setText(s.slice(0, maxLength))}>{s}</Chip>)}</div>
        </div>
        <form className="baas-ai__composer" onSubmit={(e) => { e.preventDefault(); send(); }}>
          <div className="baas-ai__row">
            <label htmlFor={id} className="baas-sr-only">Message</label>
            <input id={id} type="text" placeholder="Ask me anything" value={text} maxLength={maxLength} onChange={(e) => setText(e.target.value)} autoComplete="off" />
            <IconButton appearance="tonal" icon="send" type="submit" aria-label="Send message" />
          </div>
          <div className="baas-ai__toolbar">
            <div><Chip size="sm" icon="paperclip">Attach file</Chip><Chip size="sm" iconOnly icon="mic" aria-label="Voice input" /></div>
            <span>{text.length}/{maxLength}</span>
          </div>
        </form>
      </div>
    </section>
  );
}
