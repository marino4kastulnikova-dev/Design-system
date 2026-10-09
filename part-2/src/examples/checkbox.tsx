import { Checkbox, type CheckboxState } from '../ds';
import type { ComponentExample } from './types';

const states: CheckboxState[] = ['unchecked', 'checked', 'indeterminate'];

export const checkboxExample: ComponentExample = {
  slug: 'checkbox',
  defaults: { state: 'unchecked' },
  controls: [{ name: 'state', label: 'state', type: 'select', options: states, note: 'Click the checkbox in the preview: the control follows.' }],
  surfaces: ['surface/raised', 'surface/canvas'],
  render: (a, setArgs) => <Checkbox state={a.state as CheckboxState} onChange={(next) => setArgs({ state: next })} aria-label="Select row" />,
  code: (a) => `const [state, setState] = useState<CheckboxState>('${a.state}');\n\n<Checkbox state={state} onChange={setState} aria-label="Select row" />`,
  matrix: () => [{
    title: 'state', surface: 'surface/raised', columns: states,
    rows: [{ label: 'Checkbox', cells: states.map((s) => <Checkbox state={s} aria-label={s} />) }],
  }],
};
