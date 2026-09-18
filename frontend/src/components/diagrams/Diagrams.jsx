import { motion } from "framer-motion";

// Sovereign 3 Data Center architecture - clean enterprise diagram
export const ThreeDCDiagram = ({ labels }) => {
  const l = labels || { primary: "Primary DC", secondary: "Secondary DC", dr: "DR Site", fabric: "Sovereign Fabric", edges: ["Branch", "Factory", "Campus", "BTS / 5G"] };

  return (
    <svg viewBox="0 0 720 420" className="w-full h-auto" role="img" data-testid="arch-3dc-diagram">
      {/* backdrop grid */}
      <defs>
        <pattern id="dotgrid" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.8" fill="rgba(10,17,40,0.12)" />
        </pattern>
        <linearGradient id="fabricStroke" x1="0" x2="1">
          <stop offset="0" stopColor="#0055FF" />
          <stop offset="1" stopColor="#0A1128" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="720" height="420" fill="url(#dotgrid)" opacity="0.6" />

      {/* Sovereign Fabric ring (animated) */}
      <motion.ellipse
        cx="360"
        cy="180"
        rx="240"
        ry="80"
        fill="none"
        stroke="url(#fabricStroke)"
        strokeWidth="1.5"
        strokeDasharray="6 6"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: "easeOut" }}
      />
      <text x="360" y="92" textAnchor="middle" className="fill-signal-600" fontFamily="Outfit" fontSize="11" letterSpacing="2">
        {l.fabric.toUpperCase()}
      </text>

      {/* 3 DC nodes */}
      {[
        { x: 160, y: 180, label: l.primary, tag: "DC-A" },
        { x: 360, y: 140, label: l.secondary, tag: "DC-B" },
        { x: 560, y: 180, label: l.dr, tag: "DC-C" },
      ].map((n, i) => (
        <motion.g
          key={n.tag}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 * i, duration: 0.5 }}
        >
          <rect x={n.x - 60} y={n.y - 30} width="120" height="60" rx="10" className="diagram-node" />
          <text x={n.x} y={n.y - 8} textAnchor="middle" fontFamily="Outfit" fontWeight="600" fontSize="13" fill="#0A1128">
            {n.label}
          </text>
          <text x={n.x} y={n.y + 12} textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#0055FF">
            {n.tag}
          </text>
        </motion.g>
      ))}

      {/* Edge sites */}
      {l.edges.map((label, i) => {
        const x = 80 + i * 180;
        const y = 340;
        return (
          <motion.g
            key={label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 + i * 0.08, duration: 0.4 }}
          >
            <line x1={x} y1="240" x2={x} y2="320" className="diagram-line-dashed" />
            <rect x={x - 50} y={y - 18} width="100" height="36" rx="8" fill="#F1F5F9" stroke="#0A1128" strokeWidth="1" />
            <text x={x} y={y + 4} textAnchor="middle" fontFamily="Inter" fontWeight="500" fontSize="11" fill="#0A1128">
              {label}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
};

export const EdgeFabricDiagram = ({ labels }) => {
  const l = labels || { core: "Core Cloud", fabric: "Edge-to-Core Fabric", edges: ["Smart City", "Telco / 5G", "Industrial / IoT", "Branch / Retail"] };
  return (
    <svg viewBox="0 0 720 360" className="w-full h-auto" role="img" data-testid="arch-edge-fabric-diagram">
      {/* core */}
      <motion.rect
        x="280" y="40" width="160" height="64" rx="12"
        className="diagram-node-accent"
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
      />
      <text x="360" y="68" textAnchor="middle" fontFamily="Outfit" fontWeight="700" fontSize="14" fill="#0A1128">
        {l.core}
      </text>
      <text x="360" y="86" textAnchor="middle" fontFamily="JetBrains Mono" fontSize="10" fill="#0055FF">
        EVPN-VXLAN · BGP
      </text>

      {/* Fabric label */}
      <text x="360" y="156" textAnchor="middle" className="fill-signal-600" fontFamily="Outfit" fontSize="11" letterSpacing="2">
        {l.fabric.toUpperCase()}
      </text>

      {/* Connecting lines + edges */}
      {l.edges.map((label, i) => {
        const x = 80 + i * 180;
        const y = 270;
        return (
          <motion.g
            key={label}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 * i, duration: 0.4 }}
          >
            <motion.path
              d={`M360,104 C360,170 ${x},180 ${x},${y - 22}`}
              className="diagram-line-dashed"
              fill="none"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.05 }}
            />
            <rect x={x - 65} y={y - 22} width="130" height="48" rx="10" className="diagram-node" />
            <text x={x} y={y + 8} textAnchor="middle" fontFamily="Inter" fontWeight="500" fontSize="12" fill="#0A1128">
              {label}
            </text>
          </motion.g>
        );
      })}
    </svg>
  );
};

// Stack diagram (used inside platform overview)
export const StackDiagram = ({ rows }) => {
  return (
    <div className="flex flex-col gap-2" data-testid="stack-diagram">
      {rows.map((r, i) => (
        <motion.div
          key={r.title}
          initial={{ opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.05 * i, duration: 0.35 }}
          className="grid grid-cols-12 items-center gap-3 rounded-lg border border-ink-100 bg-white px-4 py-3"
        >
          <div className="col-span-3 sm:col-span-2 font-mono text-[10px] uppercase tracking-wider text-signal-600">
            L{rows.length - i}
          </div>
          <div className="col-span-9 sm:col-span-4 font-display font-semibold text-ink text-sm">{r.title}</div>
          <div className="col-span-12 sm:col-span-6 text-xs text-ink-500">{r.body}</div>
        </motion.div>
      ))}
    </div>
  );
};
