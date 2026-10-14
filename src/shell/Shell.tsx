import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Flow } from '../flows/types';
import { useFlowNav } from './useFlowNav';
import { DeviceFrame } from './DeviceFrame';
import { ScreenStage } from './ScreenStage';
import { FlowRail, FlowStrip } from './FlowRail';
import { AnnotationPanel } from './AnnotationPanel';
import { useWindowWidth } from './useWindowWidth';

function readHash(fallback: string): { flowId: string; stepId: string | null } {
  if (typeof window === 'undefined') return { flowId: fallback, stepId: null };
  const parts = window.location.hash.replace(/^#\/?/, '').split('/');
  return { flowId: parts[0] || fallback, stepId: parts[1] || null };
}

/** Below this width the shell stacks: controls above the device, annotations below it. */
const STACK_AT = 980;
/** Below this width the annotation panel starts collapsed. */
const ANNO_COLLAPSE_AT = 1280;

/**
 * The workbench: flow selector → device → annotations.
 * Adapts to narrow preview panes so the phone is never squeezed out of view.
 */
export default function Shell({ flows }: { flows: Flow[] }) {
  const initial = readHash(flows[0].id);
  const [flowId, setFlowId] = useState(initial.flowId);
  const flow = flows.find((f) => f.id === flowId) ?? flows[0];
  const nav = useFlowNav(flow, initial.stepId);
  const width = useWindowWidth();
  const stacked = width < STACK_AT;
  const [annoOpen, setAnnoOpen] = useState(() =>
    typeof window === 'undefined' ? true : window.innerWidth >= ANNO_COLLAPSE_AT,
  );

  const activeStep = nav.top.stepId ? flow.steps.find((s) => s.id === nav.top.stepId) ?? null : null;

  /* Keyboard: ← → step through the flow, R resets. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nav.next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nav.back();
      } else if (e.key.toLowerCase() === 'r') {
        nav.reset();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [nav]);

  /* Deep-linkable URL. */
  useEffect(() => {
    const target = `${flow.id}/${nav.top.stepId ?? nav.top.screenId}`;
    if (window.location.hash.replace(/^#\/?/, '') !== target) {
      window.history.replaceState(null, '', `#/${target}`);
    }
  }, [flow.id, nav.top]);

  const railProps = {
    flows,
    activeFlow: flow,
    onSelectFlow: (id: string) => {
      setFlowId(id);
      window.history.replaceState(null, '', `#/${id}`);
    },
    activeStepId: nav.top.stepId,
    onSelectStep: (id: string) => nav.goToStep(id),
    state: nav.state,
    onState: nav.setState,
    onReset: nav.reset,
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0d1117] text-white">
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-white/8 bg-[#0f131a] px-4">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-gradient-to-br from-brand-sky to-brand-navy text-[13px] font-extrabold text-brand-navy">
          ₹
        </div>
        <div className="min-w-0">
          <div className="truncate text-[13.5px] font-semibold leading-4">
            Paytm Rewards <span className="text-white/35">/</span>{' '}
            <span className="text-white/60">Prototype shell</span>
          </div>
          <div className="truncate text-[11px] text-white/35">
            {flow.name} · step {(nav.topIndex ?? 0) + 1} of {flow.steps.length}
          </div>
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <span className="hidden rounded-pill border border-reward-gold/30 bg-reward-gold/10 px-2.5 py-1 text-[10.5px] font-semibold text-reward-gold xl:inline">
            PLACEHOLDER SCREENS — awaiting PRD
          </span>
          <span className="hidden rounded-pill border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[10.5px] text-white/45 lg:inline">
            {width} × {typeof window === 'undefined' ? 0 : window.innerHeight}
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        {!stacked && <FlowRail {...railProps} />}

        <main className="flex min-h-0 min-w-0 flex-1 flex-col">
          {stacked && <FlowStrip {...railProps} />}

          {/* Stage */}
          <div className="relative min-h-0 flex-1 overflow-hidden bg-[radial-gradient(circle_at_50%_20%,#1b2230_0%,#0d1117_60%)]">
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.14) 1px, transparent 1px)',
                backgroundSize: '28px 28px',
              }}
            />
            <DeviceFrame screenId={nav.top.screenId}>
              <ScreenStage
                entry={nav.top}
                direction={nav.direction}
                state={nav.state}
                nav={{
                  flowId: flow.id,
                  canGoBack: nav.canGoBack,
                  goToStep: nav.goToStep,
                  navigate: nav.navigate,
                  back: nav.back,
                  next: nav.next,
                }}
              />
            </DeviceFrame>
          </div>

          {/* Stage footer: step transport */}
          <footer className="flex h-16 shrink-0 items-center gap-3 border-t border-white/8 bg-[#0f131a] px-4">
            <TransportButton onClick={nav.back} disabled={!nav.canGoBack} label="Back">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </TransportButton>

            <div className="flex min-w-0 flex-1 items-center gap-1.5">
              {flow.steps.map((s, i) => {
                const on = s.id === nav.top.stepId;
                return (
                  <button
                    key={s.id}
                    onClick={() => nav.goToStep(s.id)}
                    title={s.label}
                    className="group relative h-6 min-w-4 flex-1"
                  >
                    <span
                      className={`absolute inset-x-0 top-2.5 h-1 rounded-pill transition-all ${
                        on ? 'bg-brand-sky' : i <= nav.topIndex ? 'bg-white/35' : 'bg-white/12 group-hover:bg-white/25'
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <div className="hidden min-w-0 shrink-0 text-right md:block">
              <div className="truncate text-[12px] font-medium text-white/80">
                {activeStep?.label ?? nav.top.label}
              </div>
              <div className="truncate font-mono text-[10px] text-white/35">
                {nav.top.screenId} · {nav.top.transition}
              </div>
            </div>

            <TransportButton onClick={nav.next} disabled={!nav.hasNext} label="Next step" primary>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M9 5l7 7-7 7" />
              </svg>
            </TransportButton>
          </footer>

          {stacked && (
            <div className="h-[32vh] max-h-[400px] min-h-[150px] shrink-0">
              <AnnotationPanel
                flow={flow}
                step={activeStep}
                entry={nav.top}
                stack={nav.stack}
                open
                onToggle={() => setAnnoOpen((o) => !o)}
                variant="below"
              />
            </div>
          )}
        </main>

        {!stacked && (
          <AnnotationPanel
            flow={flow}
            step={activeStep}
            entry={nav.top}
            stack={nav.stack}
            open={annoOpen}
            onToggle={() => setAnnoOpen((o) => !o)}
          />
        )}
      </div>
    </div>
  );
}

function TransportButton({
  children,
  onClick,
  disabled,
  label,
  primary = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  primary?: boolean;
}) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.92 }}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-md border transition ${
        primary
          ? 'border-brand-sky bg-brand-sky text-brand-navy hover:brightness-110'
          : 'border-white/12 bg-white/[0.04] text-white/75 hover:bg-white/[0.09]'
      } ${disabled ? 'cursor-not-allowed opacity-30' : ''}`}
    >
      {children}
    </motion.button>
  );
}
