import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { motion as motionTokens } from '../design/tokens';

/* ------------------------------------------------------------------ */
/* Status bar                                                          */
/* ------------------------------------------------------------------ */

export function PhoneStatusBar({ dark = false }: { dark?: boolean }) {
  const c = dark ? 'text-white' : 'text-brand-ink';
  return (
    <div
      className={`relative z-30 flex h-11 shrink-0 items-center justify-between px-6 pt-1 text-xs font-semibold ${c}`}
    >
      <span className="tabular">9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" opacity="0.35" />
        </svg>
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
          <path d="M7.5 9.6l1.7-2.1a2.7 2.7 0 00-3.4 0l1.7 2.1z" />
          <path d="M4.1 6.1a5 5 0 016.8 0l1.3-1.6a6.9 6.9 0 00-9.4 0l1.3 1.6z" opacity="0.8" />
          <path d="M1.6 3.1a8.6 8.6 0 0111.8 0L14.7 1.5a10.6 10.6 0 00-14.4 0L1.6 3.1z" opacity="0.55" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity="0.4" />
          <rect x="2" y="2" width="16" height="8" rx="1.8" fill="currentColor" />
          <path d="M23 4.2v3.6a2 2 0 000-3.6z" fill="currentColor" opacity="0.4" />
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Screen shell                                                        */
/* ------------------------------------------------------------------ */

export function ScreenShell({
  children,
  className = '',
  bg = 'bg-surface-app',
  scroll = true,
}: {
  children: ReactNode;
  className?: string;
  bg?: string;
  scroll?: boolean;
}) {
  return (
    <div className={`flex h-full w-full flex-col ${bg} ${className}`}>
      {scroll ? (
        <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain">{children}</div>
      ) : (
        <div className="flex flex-1 flex-col overflow-hidden">{children}</div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

export function AppHeader({
  title,
  subtitle,
  onBack,
  right,
  tone = 'light',
  className = '',
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  onBack?: () => void;
  right?: ReactNode;
  tone?: 'light' | 'brand' | 'transparent';
  className?: string;
}) {
  const tones = {
    light: 'bg-surface-card text-text-primary border-b border-border-hairline',
    brand: 'bg-brand-navy text-white border-b border-transparent',
    // no text colour here on purpose: it inherits, so callers can override
    transparent: 'bg-transparent border-b border-transparent',
  }[tone];

  return (
    <header
      className={`relative z-20 flex shrink-0 items-center gap-2 px-4 py-2.5 ${tones} ${className}`}
    >
      {onBack && (
        <button
          onClick={onBack}
          aria-label="Back"
          className="-ml-1.5 grid h-9 w-9 place-items-center rounded-full text-current transition active:scale-90 active:bg-black/5"
        >
          <BackGlyph />
        </button>
      )}
      <div className="min-w-0 flex-1">
        {title && <div className="truncate text-lg font-semibold leading-6">{title}</div>}
        {subtitle && (
          <div className={`truncate text-xs ${tone === 'brand' ? 'text-white/70' : 'text-text-secondary'}`}>
            {subtitle}
          </div>
        )}
      </div>
      {right && <div className="flex shrink-0 items-center gap-1">{right}</div>}
    </header>
  );
}

function BackGlyph() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function HeaderIconButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid h-9 w-9 place-items-center rounded-full transition active:scale-90 active:bg-black/5"
    >
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

export function Card({
  children,
  className = '',
  onClick,
  pad = true,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  pad?: boolean;
}) {
  const Tag = onClick ? motion.button : motion.div;
  return (
    <Tag
      {...(onClick ? { onClick, whileTap: { scale: 0.985 } } : {})}
      className={`w-full overflow-hidden rounded-lg bg-surface-card shadow-card ${
        pad ? 'p-3.5' : ''
      } ${onClick ? 'text-left' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}

export function SectionHeader({
  title,
  action,
  onAction,
  className = '',
}: {
  title: ReactNode;
  action?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div className={`flex items-baseline justify-between gap-3 px-4 ${className}`}>
      <h2 className="text-md font-semibold text-text-primary">{title}</h2>
      {action && (
        <button
          onClick={onAction}
          className="shrink-0 text-sm font-semibold text-brand-sky transition active:opacity-60"
        >
          {action}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'reward' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  block?: boolean;
  disabled?: boolean;
  className?: string;
};

export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  block = true,
  disabled = false,
  className = '',
}: ButtonProps) {
  const variants: Record<string, string> = {
    primary: 'bg-brand-sky text-brand-navy hover:brightness-105',
    secondary: 'bg-white text-brand-navy border border-border-strong',
    // ghost inherits colour so it works on light and dark surfaces
    ghost: 'bg-transparent',
    reward: 'bg-brand-navy text-white',
    danger: 'bg-danger text-white',
  };
  const sizes: Record<string, string> = {
    sm: 'h-8 px-3 text-sm rounded-sm',
    md: 'h-10 px-4 text-md rounded-sm',
    lg: 'h-12 px-5 text-lg rounded-md',
  };
  return (
    <motion.button
      onClick={disabled ? undefined : onClick}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      transition={motionTokens.spring}
      disabled={disabled}
      className={`${block ? 'w-full' : ''} inline-flex items-center justify-center gap-2 font-semibold transition
        ${sizes[size]} ${variants[variant]} ${
          disabled ? 'cursor-not-allowed opacity-40' : 'active:brightness-95'
        } ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function Chip({
  children,
  active = false,
  onClick,
  tone = 'neutral',
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  tone?: 'neutral' | 'brand' | 'gold' | 'success';
}) {
  const tones: Record<string, string> = {
    neutral: active ? 'bg-brand-navy text-white' : 'bg-white text-text-secondary border border-border-hairline',
    brand: active ? 'bg-brand-sky text-brand-navy' : 'bg-brand-sky-100 text-brand-navy',
    gold: 'bg-reward-gold-100 text-warning',
    success: 'bg-success-soft text-success',
  };
  return (
    <button
      onClick={onClick}
      className={`shrink-0 whitespace-nowrap rounded-pill px-3 py-1.5 text-sm font-medium transition active:scale-95 ${tones[tone]}`}
    >
      {children}
    </button>
  );
}

export function Tag({ children, tone = 'gold' }: { children: ReactNode; tone?: 'gold' | 'brand' | 'success' | 'danger' }) {
  const tones = {
    gold: 'bg-reward-gold-100 text-warning',
    brand: 'bg-brand-sky-100 text-brand-navy',
    success: 'bg-success-soft text-success',
    danger: 'bg-danger-soft text-danger',
  }[tone];
  return (
    <span className={`inline-flex items-center gap-1 rounded-xs px-1.5 py-0.5 text-2xs font-bold uppercase tracking-wide ${tones}`}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Icon tile + list row                                                */
/* ------------------------------------------------------------------ */

export function IconTile({
  children,
  tone = 'sky',
  size = 44,
  radius = 'rounded-md',
}: {
  children: ReactNode;
  tone?: 'sky' | 'navy' | 'gold' | 'green' | 'soft' | 'white';
  size?: number;
  radius?: string;
}) {
  const tones: Record<string, string> = {
    sky: 'bg-brand-sky-100 text-brand-navy',
    navy: 'bg-brand-navy text-white',
    gold: 'bg-reward-gold-100 text-warning',
    green: 'bg-success-soft text-success',
    soft: 'bg-surface-sunken text-text-secondary',
    white: 'bg-white text-brand-navy',
  };
  return (
    <span
      className={`grid shrink-0 place-items-center ${radius} ${tones[tone]}`}
      style={{ width: size, height: size }}
    >
      {children}
    </span>
  );
}

export function ListRow({
  icon,
  title,
  subtitle,
  trailing,
  onClick,
  divider = true,
}: {
  icon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  trailing?: ReactNode;
  onClick?: () => void;
  divider?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={onClick ? { scale: 0.99, backgroundColor: '#f7f9fc' } : undefined}
      className={`flex w-full items-center gap-3 px-4 py-3 text-left ${
        divider ? 'border-b border-border-hairline last:border-b-0' : ''
      }`}
    >
      {icon}
      <div className="min-w-0 flex-1">
        <div className="truncate text-md font-medium text-text-primary">{title}</div>
        {subtitle && <div className="truncate text-sm text-text-secondary">{subtitle}</div>}
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </motion.button>
  );
}

/* ------------------------------------------------------------------ */
/* Money                                                               */
/* ------------------------------------------------------------------ */

export function Money({
  value,
  size = 'md',
  tone = 'text-text-primary',
  plus = false,
  className = '',
}: {
  value: number | string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'display';
  tone?: string;
  plus?: boolean;
  className?: string;
}) {
  const sizes = {
    xs: 'text-sm',
    sm: 'text-md',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
    display: 'text-display',
  }[size];
  const n = typeof value === 'number' ? value.toLocaleString('en-IN') : value;
  return (
    <span className={`tabular font-bold ${sizes} ${tone} ${className}`}>
      {plus ? '+' : ''}₹{n}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Banner                                                              */
/* ------------------------------------------------------------------ */

export function Banner({
  icon,
  title,
  body,
  tone = 'info',
  action,
}: {
  icon?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  tone?: 'info' | 'success' | 'warning' | 'danger' | 'gold';
  action?: ReactNode;
}) {
  const tones = {
    info: 'bg-info-soft text-info border-info/20',
    success: 'bg-success-soft text-success border-success/20',
    warning: 'bg-warning-soft text-warning border-warning/20',
    danger: 'bg-danger-soft text-danger border-danger/20',
    gold: 'bg-reward-gold-100 text-warning border-reward-gold/30',
  }[tone];
  return (
    <div className={`flex items-start gap-2.5 rounded-md border px-3 py-2.5 ${tones}`}>
      {icon && <span className="mt-0.5 shrink-0">{icon}</span>}
      <div className="min-w-0 flex-1">
        <div className="text-md font-semibold leading-5">{title}</div>
        {body && <div className="mt-0.5 text-sm font-normal leading-5 opacity-90">{body}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bottom sheet                                                        */
/* ------------------------------------------------------------------ */

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className={`absolute inset-0 z-40 bg-black/45 ${open ? '' : 'pointer-events-none'}`}
      />
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: open ? 0 : '100%' }}
        transition={{ type: 'spring', ...motionTokens.springSoft }}
        className="absolute inset-x-0 bottom-0 z-50 rounded-t-xl bg-white pb-6 shadow-sheet"
      >
        <div className="mx-auto mt-2.5 h-1 w-10 rounded-pill bg-border-strong" />
        {title && (
          <div className="flex items-center justify-between px-4 pb-1 pt-3">
            <h3 className="text-lg font-semibold">{title}</h3>
            <button onClick={onClose} aria-label="Close" className="grid h-8 w-8 place-items-center rounded-full text-text-secondary active:bg-surface-sunken">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
        )}
        <div className="no-scrollbar max-h-[70%] overflow-y-auto px-4 pt-2">{children}</div>
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Tab bar                                                             */
/* ------------------------------------------------------------------ */

export function TabBar({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; icon?: ReactNode }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <nav className="z-20 flex shrink-0 items-stretch border-t border-border-hairline bg-white px-2 pb-5 pt-2">
      {tabs.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`flex flex-1 flex-col items-center gap-1 rounded-sm py-1 text-2xs font-medium transition ${
              on ? 'text-brand-navy' : 'text-text-tertiary'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
            <span className={`h-0.5 w-6 rounded-pill ${on ? 'bg-brand-sky' : 'bg-transparent'}`} />
          </button>
        );
      })}
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/* Feedback states                                                     */
/* ------------------------------------------------------------------ */

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <motion.div
      animate={{ opacity: [0.45, 0.85, 0.45] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      className={`rounded-sm bg-surface-sunken ${className}`}
    />
  );
}

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-8 py-14 text-center">
      {icon && <div className="grid h-16 w-16 place-items-center rounded-full bg-surface-sunken text-text-tertiary">{icon}</div>}
      <div>
        <div className="text-lg font-semibold text-text-primary">{title}</div>
        {body && <p className="mt-1 text-sm leading-5 text-text-secondary">{body}</p>}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  body = 'We could not load this screen. Check your connection and try again.',
  onRetry,
}: {
  title?: string;
  body?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-8 py-14 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full bg-danger-soft text-danger">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 4l9 16H3l9-16z" />
          <path d="M12 10v4M12 17.2v.2" />
        </svg>
      </div>
      <div>
        <div className="text-lg font-semibold text-text-primary">{title}</div>
        <p className="mt-1 text-sm leading-5 text-text-secondary">{body}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" block={false} onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}

export function Spinner({ size = 28, tone = 'text-brand-sky' }: { size?: number; tone?: string }) {
  return (
    <motion.span
      className={`block ${tone}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" fill="none" width={size} height={size}>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.6" opacity="0.2" />
        <path d="M21 12a9 9 0 00-9-9" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      </svg>
    </motion.span>
  );
}

export function Centered({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`grid flex-1 place-items-center ${className}`}>{children}</div>;
}
