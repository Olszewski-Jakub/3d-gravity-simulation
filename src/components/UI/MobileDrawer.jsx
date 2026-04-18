'use client';

const TAB_TITLES = {
  info: 'System Info',
  controls: 'Simulation Controls',
  create: 'Celestial Bodies',
  presets: 'System Presets',
};

export default function MobileDrawer({ activeTab, onClose, children }) {
  if (!activeTab) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 md:hidden bg-black/40"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed bottom-16 left-0 right-0 z-50 md:hidden h-[55vh] bg-space-medium/95 backdrop-blur-md rounded-t-2xl border border-white/10 overflow-hidden flex flex-col animate-slide-up">
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-white/10 flex-shrink-0">
          <h2 className="text-sm font-semibold text-white">{TAB_TITLES[activeTab]}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-1 rounded"
            aria-label="Close panel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </>
  );
}
