import { AnimatePresence, motion } from 'framer-motion';
import type { Flow, FlowStep } from '../flows/types';
import type { NavEntry } from './useFlowNav';

/**
 * The written layer of the prototype: what the screen is, why it exists,
 * and the design/motion/PRD notes attached to it.
 * All text is authored in src/flows/index.ts — no code changes needed to edit.
 */
export function AnnotationPanel({
  flow,
  step,
  entry,
  stack,
  open,
  onToggle,
}: {
  flow: Flow;
  step: FlowStep | null;
  entry: NavEntry;
  stack: NavEntry[];
  open: boolean;
  onToggle: () => void;
}) {
  const a = step?.annotation;

  return (
    <aside
      className={`relative flex h-full shrink-0 flex-col border-l border-white/8 bg-[#11151c] transition-[width] duration-200 ${
        open ? 'w-[420px]' : 'w-[46px]'
      }`}
    >
      <button
        onClick={onToggle}
        aria-label={open ? 'Collapse annotations' : 'Expand annotations'}
        className="absolute -left-0 top-3 z-10 grid h-8 w-[46px] place-items-center text-white/45 transition hover:text-white"
      >
        <motion.span animate={{ rotate: open ? 0 : 180 }} transition={{ duration: 0.2 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </motion.span>
      </button>

      {!open ? (
        <div className="flex h-full items-center justify-center">
          <span className="rotate-90 whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
            Annotations
          </span>
        </div>
      ) : (
        <>
          <div className="shrink-0 border-b border-white/8 py-3 pl-[54px] pr-4">
            <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
              {flow.name}
            </div>
            <div className="mt-1 truncate text-[15px] font-semibold text-white">
              {step?.label ?? entry.label}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <Pill mono>{entry.screenId}</Pill>
              <Pill mono>{entry.transition}</Pill>
              {stack.length > 1 && <Pill>depth {stack.length}</Pill>}
            </div>
            {/* Breadcrumb */}
            <div className="mt-2 flex flex-wrap items-center gap-1 text-[10.5px] text-white/40">
              {stack.map((s, i) => (
                <span key={s.key} className="flex items-center gap-1">
                  {i > 0 && <span className="text-white/20">›</span>}
                  <span className={i === stack.length - 1 ? 'text-white/70' : ''}>{s.label}</span>
                </span>
              ))}
            </div>
          </div>

          <div className="thin-scrollbar flex-1 overflow-y-auto px-4 py-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={entry.key}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="space-y-4"
              >
                {!a && (
                  <div className="rounded-lg border border-white/8 bg-white/[0.03] p-3 text-[12px] leading-5 text-white/50">
                    No annotation authored for this entry yet. Add an{' '}
                    <code className="font-mono text-white/70">annotation</code> block to the step in{' '}
                    <code className="font-mono text-white/70">src/flows/index.ts</code>.
                  </div>
                )}

                {a?.what && <Block title="What happens" body={a.what} />}
                {a?.why && <Block title="Why it exists" body={a.why} accent />}
                {a?.details && <List title="Rules & behaviour" items={a.details} />}
                {a?.design && <List title="Design notes" items={a.design} dot="bg-brand-sky" />}
                {a?.motion && <Block title="Motion" body={a.motion} />}
                {a?.copy && <Block title="Copy" body={a.copy} />}

                {a?.prd && (
                  <div>
                    <Label>PRD excerpt</Label>
                    <pre className="mt-1.5 whitespace-pre-wrap rounded-lg border border-white/8 bg-black/30 p-3 font-mono text-[11px] leading-[1.6] text-white/70">
                      {a.prd}
                    </pre>
                  </div>
                )}

                {a?.openQuestions && a.openQuestions.length > 0 && (
                  <div>
                    <Label>Open questions</Label>
                    <ul className="mt-1.5 space-y-1.5">
                      {a.openQuestions.map((q) => (
                        <li
                          key={q}
                          className="flex gap-2 rounded-md border border-reward-gold/25 bg-reward-gold/10 px-2.5 py-2 text-[11.5px] leading-4 text-white/80"
                        >
                          <span className="mt-0.5 text-reward-gold">?</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </>
      )}
    </aside>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">{children}</div>
  );
}

function Block({ title, body, accent = false }: { title: string; body: string; accent?: boolean }) {
  return (
    <div>
      <Label>{title}</Label>
      <p
        className={`mt-1.5 text-[12.5px] leading-[1.65] ${
          accent ? 'border-l-2 border-brand-sky/60 pl-2.5 text-white/85' : 'text-white/65'
        }`}
      >
        {body}
      </p>
    </div>
  );
}

function List({ title, items, dot = 'bg-white/35' }: { title: string; items: string[]; dot?: string }) {
  return (
    <div>
      <Label>{title}</Label>
      <ul className="mt-1.5 space-y-1.5">
        {items.map((i) => (
          <li key={i} className="flex gap-2 text-[12.5px] leading-[1.6] text-white/65">
            <span className={`mt-[7px] h-1 w-1 shrink-0 rounded-pill ${dot}`} />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pill({ children, mono = false }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <span
      className={`rounded-xs border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-white/55 ${
        mono ? 'font-mono' : ''
      }`}
    >
      {children}
    </span>
  );
}
