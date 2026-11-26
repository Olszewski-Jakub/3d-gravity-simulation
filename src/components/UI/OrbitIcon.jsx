const paths = {
    orbit: <><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-35 12 12)"/><circle cx="19" cy="6" r="1.5" fill="currentColor"/></>,
    sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></>,
    moon: <path d="M20.7 14.3A9 9 0 0 1 9.7 3.3a9 9 0 1 0 11 11Z"/>,
    binary: <><circle cx="8" cy="14" r="4"/><circle cx="17" cy="7" r="3"/><path d="m3 6 2-2m14 14 2-2"/></>,
    hole: <><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-28 12 12)"/><circle cx="12" cy="12" r="5"/></>,
    chaos: <><circle cx="5" cy="7" r="2"/><circle cx="17" cy="5" r="2"/><circle cx="19" cy="17" r="2"/><circle cx="8" cy="18" r="2"/><path d="m7 8 10 8m-1-9-7 9"/></>,
    play: <path d="m8 5 12 7-12 7Z" fill="currentColor"/>,
    pause: <path d="M9 5v14m6-14v14" strokeWidth="3"/>,
    step: <><path d="m5 5 10 7-10 7Z"/><path d="M19 5v14"/></>,
    reset: <path d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5"/>,
    target: <><circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></>,
    settings: <><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="2" fill="var(--panel)"/><circle cx="15" cy="17" r="2" fill="var(--panel)"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    minus: <path d="M5 12h14"/>,
    help: <><circle cx="12" cy="12" r="9"/><path d="M9.4 9a2.7 2.7 0 1 1 3.5 2.6c-.6.2-.9.9-.9 1.4m0 3h.01"/></>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    upload: <path d="M12 16V4m-4 4 4-4 4 4M4 16v4h16v-4"/>,
    download: <path d="M12 4v12m-4-4 4 4 4-4M4 17v3h16v-3"/>,
    expand: <path d="M4 9V4h5m6 0h5v5m0 6v5h-5m-6 0H4v-5"/>,
    edit: <path d="m5 16-1 4 4-1L20 7l-3-3Z"/>
};

export default function OrbitIcon({ name, size = 19 }) {
    return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.55" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}
