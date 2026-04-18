'use client';

function formatSci(value) {
  if (value === 0) return '0';
  const exp = Math.floor(Math.log10(Math.abs(value)));
  const coeff = value / Math.pow(10, exp);
  return `${coeff.toFixed(2)}×10^${exp}`;
}

export default function StatsOverlay({ celestialBodies }) {
  if (!celestialBodies || celestialBodies.length === 0) return null;

  let kineticEnergy = 0;
  let px = 0, py = 0, pz = 0;

  for (const body of celestialBodies) {
    const [vx, vy, vz] = body.velocity || [0, 0, 0];
    const v2 = vx * vx + vy * vy + vz * vz;
    kineticEnergy += 0.5 * body.mass * v2;
    px += body.mass * vx;
    py += body.mass * vy;
    pz += body.mass * vz;
  }

  const momentum = Math.sqrt(px * px + py * py + pz * pz);

  return (
    <div className="absolute bottom-4 left-4 mb-16 md:mb-0 z-10 pointer-events-none">
      <div className="bg-black/50 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 space-y-0.5 font-mono">
        <div className="text-gray-400 text-[10px] font-sans uppercase tracking-wider mb-1">System Stats</div>
        <div><span className="text-gray-500">Bodies</span> <span className="text-white">{celestialBodies.length}</span></div>
        <div><span className="text-gray-500">KE</span> <span className="text-yellow-300">{formatSci(kineticEnergy)} J</span></div>
        <div><span className="text-gray-500">|p|</span> <span className="text-blue-300">{formatSci(momentum)} kg·m/s</span></div>
      </div>
    </div>
  );
}
