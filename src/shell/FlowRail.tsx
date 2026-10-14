import { motion } from 'framer-motion';
import type { Flow } from '../flows/types';
import type { ScreenState } from '../screens/types';

const STATES: { id: ScreenState; label: string }[] = [
  { id: 'default', label: 'Default' },
  { id: 'loading', label: 'Loading' },
  { id: 'empty', label: 'Empty' },
  { id: 'error', label: 'Error' },
  { id: 'success', label: 'Success' },
];

export interface RailProps {
  flows: Flow[];
  activeFlow: Flow;
  onSelectFlow: (id: string) => void;
  activeStepId: string | null;
  onSelectStep: (id: string) => void;
  state: ScreenState;
  onState: (s: ScreenState) => void;
  onReset: () => void;
}

/* ------------------------------------------------------------------ */
/* Side rail (wide viewports)                                          */
/* ------------------------------------------------------------------ */

export function FlowRail(p: RailProps) {
  const { flows, activeFlow, onSelectFlow, activeStepId, onSelectStep, state, onState, onReset } = p;
  const allowed = activeFlow.steps.find((s) => s.id === activeStepId)?.states;

  return (
    <aside className="flex h-full w-[clamp(240px,22vw,330px)] shrink-0 flex-col border-r border-white/8 bg-[#11151c]">
      <div className="thin-scrollbar flex-1 overflow-y-auto pb-2">
        <SectionTitle>
          Flows{' '}
          <span className="ml-1 rounded-pill bg-white/8 px-1.5 py-0.5 text-[10px] font-semibold text-white/50">
            {flows.length}
          </span>
        </SectionTitle>
        <div className="space-y-1.5 px-3">
          {flows.map((f) => {
            const on = f.id === activeFlow.id;
            return (
              <button
                key={f.id}
                onClick={() => onSelectFlow(f.id)}
                className={`w-full rounded-lg border p-3 text-left transition ${
                  on
                    ? 'border-brand-sky/50 bg-brand-sky/10'
                    : 'border-white/8 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-pill ${on ? 'bg-brand-sky' : 'bg-white/25'}`} />
                  <span className={`min-w-0 flex-1 truncate text-[13px] font-semibold ${on ? 'text-white' : 'text-white/85'}`}>
                    {f.name}
                  </span>
                  <span className="shrink-0 text-[10px] font-medium text-white/40">{f.steps.length} steps</span>
                </div>
                <p className="mt-1 pl-3.5 text-[11px] leading-4 text-white/50">{f.summary}</p>
              </button>
            );
          })}
        </div>

        <SectionTitle>Steps in this flow</SectionTitle>
        <ol className="space-y-0.5 px-3">
          {activeFlow.steps.map((s, i) => {
            const on = s.id === activeStepId;
            return (
              <li key={s.id}>
                <button
                  onClick={() => onSelectStep(s.id)}
                  className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition ${
                    on ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold ${
                      on ? 'bg-brand-sky text-brand-navy' : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={`block truncate text-[12.5px] font-medium ${on ? 'text-white' : 'text-white/75'}`}>
                      {s.label}
                    </span>
                    <span className="block truncate font-mono text-[10px] text-white/35">
                      {s.screen}
                      {s.transition && s.transition !== 'push' ? ` · ${s.transition}` : ''}
                    </span>
                  </span>
                  {on && <span className="h-4 w-1 shrink-0 rounded-pill bg-brand-sky" />}
                </button>
              </li>
            );
          })}
        </ol>

        <SectionTitle>Screen state</SectionTitle>
        <div className="flex flex-wrap gap-1.5 px-3">
          {STATES.map((s) => (
            <StateChip key={s.id} s={s} on={state === s.id} allowed={allowed} onState={onState} />
          ))}
        </div>
        <p className="px-3 pt-2 text-[10.5px] leading-4 text-white/35">
          States not modelled for this screen are dimmed. State is remembered per step.
        </p>

        {(activeFlow.actor || activeFlow.outcome) && (
          <>
            <SectionTitle>Flow meta</SectionTitle>
            <div className="mx-3 mb-4 space-y-2 rounded-lg border border-white/8 bg-white/[0.03] p-3">
              {activeFlow.actor && <Meta label="Actor" value={activeFlow.actor} />}
              {activeFlow.outcome && <Meta label="Outcome" value={activeFlow.outcome} />}
              {activeFlow.tags && (
                <div className="flex flex-wrap gap-1 pt-0.5">
                  {activeFlow.tags.map((t) => (
                    <span key={t} className="rounded-xs bg-white/8 px-1.5 py-0.5 font-mono text-[10px] text-white/50">
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <div className="shrink-0 border-t border-white/8 p-3">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onReset}
          className="w-full rounded-md border border-white/12 bg-white/[0.04] py-2 text-[12px] font-semibold text-white/80 transition hover:bg-white/[0.08]"
        >
          Reset flow
        </motion.button>
        <p className="mt-2 text-center text-[10px] text-white/30">← → move steps · R resets</p>
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/* Strip rail (narrow viewports / small preview panes)                 */
/* ------------------------------------------------------------------ */

export function FlowStrip(p: RailProps) {
  const { flows, activeFlow, onSelectFlow, activeStepId, onSelectStep, state, onState, onReset } = p;
  const allowed = activeFlow.steps.find((s) => s.id === activeStepId)?.states;

  return (
    <div className="shrink-0 space-y-2 border-b border-white/8 bg-[#11151c] px-3 py-2.5">
      <div className="flex items-center gap-2">
        <select
          value={activeFlow.id}
          onChange={(e) => onSelectFlow(e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-white/12 bg-[#1a2029] px-2 py-1.5 text-[12px] font-medium text-white outline-none"
        >
          {flows.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </select>
        <button
          onClick={onReset}
          className="shrink-0 rounded-md border border-white/12 bg-white/[0.04] px-2.5 py-1.5 text-[11.5px] font-semibold text-white/75"
        >
          Reset
        </button>
      </div>

      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
        {activeFlow.steps.map((s, i) => {
          const on = s.id === activeStepId;
          return (
            <button
              key={s.id}
              onClick={() => onSelectStep(s.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-pill border px-2.5 py-1 text-[11.5px] font-medium transition ${
                on ? 'border-brand-sky bg-brand-sky text-brand-navy' : 'border-white/12 text-white/65'
              }`}
            >
              <span className="text-[10px] opacity-70">{i + 1}</span>
              {s.label}
            </button>
          );
        })}
      </div>

      <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto">
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-white/30">State</span>
        {STATES.map((s) => (
          <StateChip key={s.id} s={s} on={state === s.id} allowed={allowed} onState={onState} />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function StateChip({
  s,
  on,
  allowed,
  onState,
}: {
  s: { id: ScreenState; label: string };
  on: boolean;
  allowed?: ScreenState[];
  onState: (s: ScreenState) => void;
}) {
  const disabled = allowed ? !allowed.includes(s.id) : false;
  return (
    <button
      onClick={() => !disabled && onState(s.id)}
      disabled={disabled}
      className={`shrink-0 rounded-pill border px-2.5 py-1 text-[11px] font-medium transition ${
        on
          ? 'border-brand-sky bg-brand-sky text-brand-navy'
          : disabled
            ? 'cursor-not-allowed border-white/5 text-white/20'
            : 'border-white/12 text-white/65 hover:border-white/25 hover:text-white'
      }`}
    >
      {s.label}
    </button>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="px-4 pb-1.5 pt-5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-white/35">
      {children}
    </h3>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-white/35">{label}</div>
      <div className="text-[12px] leading-4 text-white/75">{value}</div>
    </div>
  );
}
