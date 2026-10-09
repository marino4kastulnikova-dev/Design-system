// BaaS design system — Sidebar and SidebarCollapsed. Source: Figma page "sidebar", components 364:943 and 645:5029.
// Portal implementation, pending developer validation.
import { Avatar } from './Avatar';
import { Divider } from './Divider';
import { Icon, type IconName } from './Icon';
import { IconButton } from './IconButton';
import { NavigationItem } from './NavigationItem';
import { WithTooltip } from './Tooltip';

export interface SidebarItem { id: string; label: string; icon: IconName }
export interface SidebarSection { title?: string; items: SidebarItem[] }

/** The navigation drawn in Figma: Home, then four titled sections. */
export const sidebarSections: SidebarSection[] = [
  { items: [{ id: 'home', label: 'Home', icon: 'house' }] },
  { title: 'Management', items: [{ id: 'users', label: 'Users', icon: 'users' }, { id: 'transactions', label: 'Transactions', icon: 'arrow-left-right' }] },
  { title: 'Accounts', items: [{ id: 'iban', label: 'IBAN', icon: 'landmark' }, { id: 'wallets', label: 'Wallets', icon: 'wallet-cards' }, { id: 'cards', label: 'Cards', icon: 'credit-card' }, { id: 'crypto', label: 'Crypto', icon: 'wallet' }] },
  { title: 'Pricing & Billing', items: [{ id: 'fee-plans', label: 'Fee plans', icon: 'euro' }, { id: 'tariff', label: 'Tariff', icon: 'sliders-horizontal' }, { id: 'billing', label: 'Billing', icon: 'file-text' }] },
  { title: 'Workspace', items: [{ id: 'docs', label: 'Docs', icon: 'notebook-tabs' }, { id: 'logs', label: 'Logs', icon: 'layout-list' }] },
];

export interface SidebarProps {
  sections?: SidebarSection[]; selected?: string; onSelect?: (id: string) => void;
  userName?: string; userRole?: string; initials?: string;
  /** Figma component SidebarCollapsed: icons only, names in a Tooltip to the right. */ collapsed?: boolean;
  /** The panel button at the top expands or collapses the menu. */ onToggle?: () => void;
}
export function Sidebar({ sections = sidebarSections, selected = 'home', onSelect, userName = 'Emily Gibson', userRole = 'Admin', initials = 'EG', collapsed = false, onToggle }: SidebarProps) {
  return (
    <nav className={`baas-sidebar${collapsed ? ' baas-sidebar--collapsed' : ''}`} aria-label="Main">
      <div className="baas-sidebar__top">
        <div className="baas-sidebar__logo">
          {/* The logo is an external library instance in Figma: the word OpenBaaS in Orbitron SemiBold 20. */}
          {!collapsed && <span className="baas-sidebar__wordmark">OpenBaaS</span>}
          <button type="button" className="baas-sidebar__toggle" aria-label={collapsed ? 'Expand menu' : 'Collapse menu'} aria-expanded={!collapsed} onClick={onToggle}><Icon name="panel-right" size="lg" color="inverse" /></button>
        </div>
        <div className="baas-sidebar__nav">
          {sections.map((s, i) => (
            <div key={s.title ?? i} className="baas-sidebar__section">
              {s.title && !collapsed && <p className="baas-sidebar__title ts-overline">{s.title}</p>}
              <div className="baas-sidebar__items">
                {s.items.map((it) => {
                  const item = <NavigationItem key={it.id} icon={it.icon} selected={it.id === selected} collapsed={collapsed} onClick={(e) => { e.preventDefault(); onSelect?.(it.id); }}>{it.label}</NavigationItem>;
                  return collapsed ? <WithTooltip key={it.id} label={it.label} side="right">{item}</WithTooltip> : item;
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="baas-sidebar__footer">
        <Divider appearance="inverse" />
        <div className="baas-sidebar__profile">
          <Avatar initials={initials} />
          {!collapsed && <><div className="baas-sidebar__user"><span>{userName}</span><span>{userRole}</span></div><IconButton appearance="ghost" icon="chevron-right" aria-label={`Open profile of ${userName}`} /></>}
        </div>
      </div>
    </nav>
  );
}
