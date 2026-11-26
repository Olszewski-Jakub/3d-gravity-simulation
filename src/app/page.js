'use client';

import { useEffect, useRef, useState } from 'react';
import OrbitViewport, { initialCamera, zoomBy } from '../components/GravitySimulation/OrbitViewport';
import OrbitIcon from '../components/UI/OrbitIcon';
import { ASTRONOMICAL_UNIT, GRAVITATIONAL_CONSTANT } from '../lib/physics/constants';
import { presets, setupPreset } from '../lib/presets';
import { DAY, useSimulation } from '../lib/useSimulation';
import { exportSystem, importSystem, validateSystem } from '../lib/util/systemLoader';

const initialSystem = setupPreset('solarSystem');
const speeds = [0.25, 1, 5, 20];
const bodyTypes = { star: 'Star', planet: 'Planet', moon: 'Moon', blackhole: 'Black hole', asteroid: 'Asteroid', comet: 'Comet' };
const format = new Intl.NumberFormat('en', { maximumFractionDigits: 2 });
const bodyId = () => 'body-' + crypto.getRandomValues(new Uint32Array(4)).join('-');
const scientific = value => value.toExponential(2).replace('e+', 'e');
const bodyColor = body => /^#[\da-f]{6}$/i.test(body.color) ? body.color : '#d5b995';

function Button({ icon, label, children, ...props }) {
    return <button type="button" title={label} aria-label={label} {...props}>
        {icon && <OrbitIcon name={icon}/>}
        {children}
    </button>;
}

function Dialog({ title, close, children }) {
    const dialog = useRef(null);
    useEffect(() => {
        const element = dialog.current;
        element.showModal();
        return () => element.close();
    }, []);
    return <dialog ref={dialog} aria-labelledby="dialog-title" className="dialog" onCancel={close}
        onClick={event => { if (event.target === dialog.current) close(); }}>
        <div className="dialog-inner">
            <div className="panel-head"><h2 id="dialog-title">{title}</h2><Button className="icon-button" icon="close" label="Close dialog" onClick={close}/></div>
            {children}
        </div>
    </dialog>;
}

function BodyEditor({ body, save, remove, close }) {
    const defaults = body ?? {
        name: '', type: 'planet', color: '#7faff1', mass: 5.972e24, radius: 6371e3,
        position: [ASTRONOMICAL_UNIT, 0, 0], velocity: [0, 29780, 0]
    };
    const [error, setError] = useState('');

    function submit(event) {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        const next = {
            ...defaults, id: body?.id ?? bodyId(), name: values.get('name').trim(),
            type: values.get('type'), color: values.get('color'),
            mass: Number(values.get('mass')), radius: Number(values.get('radius')) * 1000,
            position: ['x', 'y', 'z'].map(axis => Number(values.get('p' + axis)) * ASTRONOMICAL_UNIT),
            velocity: ['x', 'y', 'z'].map(axis => Number(values.get('v' + axis)) * 1000)
        };
        const validation = validateSystem([next]);
        if (!validation.valid) { setError(validation.errors[0]); return; }
        save(next);
    }

    return <Dialog title={body ? 'Edit celestial body' : 'Add celestial body'} close={close}>
        <form className="dialog-form" onSubmit={submit}>
            <label>Name<input name="name" required maxLength={60} defaultValue={defaults.name}/></label>
            <div className="form-pair">
                <label>Type<select name="type" defaultValue={defaults.type}>{Object.entries(bodyTypes).map(([id, name]) => <option key={id} value={id}>{name}</option>)}{!bodyTypes[defaults.type] && <option value={defaults.type}>{defaults.type}</option>}</select></label>
                <label>Color<input name="color" type="color" defaultValue={bodyColor(defaults)}/></label>
                <label>Mass (kg)<input name="mass" type="number" min="0" step="any" required defaultValue={defaults.mass}/></label>
                <label>Radius (km)<input name="radius" type="number" min="0" step="any" required defaultValue={defaults.radius / 1000}/></label>
            </div>
            {[['Position (AU)', 'p', defaults.position, ASTRONOMICAL_UNIT], ['Velocity (km/s)', 'v', defaults.velocity, 1000]].map(([name, prefix, values, unit]) =>
                <fieldset key={prefix}><legend>{name}</legend><div className="vector-fields">
                    {['x', 'y', 'z'].map((axis, index) => <label key={axis}>{axis.toUpperCase()}<input aria-label={name + ' ' + axis.toUpperCase()}
                        required name={prefix + axis} type="number" step="any" defaultValue={values[index] / unit}/></label>)}
                </div></fieldset>)}
            {error && <p className="notice error" role="alert">{error}</p>}
            <div className="dialog-actions">
                {remove && <Button className="outline danger" onClick={remove}>Remove body</Button>}
                <button type="submit" className="accent">{body ? 'Save changes' : 'Add body'}</button>
            </div>
        </form>
    </Dialog>;
}

export default function Home() {
    const [system, setSystem] = useState(initialSystem);
    const [presetId, setPresetId] = useState('solarSystem');
    const [settings, setSettings] = useState({ paused: false, pace: 1, method: 'verlet', gravity: GRAVITATIONAL_CONSTANT, collisions: true });
    const [display, setDisplay] = useState({ labels: true, guides: true, trails: true });
    const [camera, setCamera] = useState(initialCamera);
    const [selected, setSelected] = useState('sun');
    const [dialog, setDialog] = useState(null);
    const [editingBody, setEditingBody] = useState(null);
    const [notice, setNotice] = useState(null);
    const viewport = useRef(null);
    const fileInput = useRef(null);
    const frame = useSimulation(system, { ...settings, paused: settings.paused || dialog === 'editor' });

    const body = frame.bodies.find(item => item.id === selected) ?? frame.bodies[0];
    const reference = frame.bodies.reduce((a, b) => !a || b.mass > a.mass ? b : a, null);
    const presetName = presets.find(preset => preset.id === presetId)?.name ?? 'Custom System';
    const distance = body && reference ? Math.hypot(...body.position.map((value, i) => value - reference.position[i])) : 0;
    const togglePlay = () => setSettings(current => ({ ...current, paused: !current.paused }));
    const patchSettings = patch => setSettings(current => ({ ...current, ...patch }));
    const toggleDisplay = key => setDisplay(current => ({ ...current, [key]: !current[key] }));
    const zoom = factor => setCamera(current => ({ ...current, zoom: zoomBy(current.zoom, factor) }));
    const close = () => { setDialog(null); setEditingBody(null); };

    useEffect(() => {
        function onKey(event) {
            if (dialog || event.repeat || event.altKey || event.ctrlKey || event.metaKey ||
                event.target.closest?.('button, input, select, a, textarea, [contenteditable]')) return;
            if (event.code === 'Space') {
                event.preventDefault();
                setSettings(current => ({ ...current, paused: !current.paused }));
            } else if (event.key.toLowerCase() === 'r') {
                setCamera(initialCamera);
            }
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [dialog]);

    function load(bodies, id) {
        setSystem(bodies);
        setPresetId(id);
        setSelected(bodies[0]?.id);
        setCamera(initialCamera);
        frame.reset(bodies);
    }

    function choosePreset(id) {
        setNotice(null);
        load(setupPreset(id), id);
    }

    async function upload(event) {
        const file = event.target.files[0];
        event.target.value = '';
        if (!file) return;
        try {
            if (file.size > 1_000_000) throw new Error('Choose a JSON file smaller than 1 MB.');
            const bodies = await importSystem(file);
            const checked = validateSystem(bodies);
            if (!checked.valid) throw new Error(checked.errors[0]);
            load(bodies.map(item => ({ ...item, id: String(item.id) })), 'custom');
            setNotice({ text: checked.warnings[0] ?? 'System imported.', error: false });
        } catch (error) {
            setNotice({ text: error.message, error: true });
        }
    }

    function saveBody(next) {
        const update = bodies => {
            if (bodies.some(item => item.id === next.id)) return bodies.map(item => item.id === next.id ? next : item);
            return [...bodies, next];
        };
        setSystem(update);
        frame.edit(update, next.id);
        setPresetId('custom');
        setSelected(next.id);
        close();
    }

    function removeBody() {
        const update = bodies => bodies.filter(item => item.id !== editingBody.id);
        setSystem(update);
        frame.edit(update, editingBody.id);
        setPresetId('custom');
        setCamera(current => current.focus === editingBody.id ? { ...current, focus: null } : current);
        close();
    }

    function openEditor(item) {
        setEditingBody(item);
        setDialog('editor');
    }

    async function toggleFullscreen() {
        try {
            if (document.fullscreenElement) await document.exitFullscreen();
            else if (viewport.current.requestFullscreen) await viewport.current.requestFullscreen();
            else setNotice({ text: 'Full screen is unavailable in this browser.', error: true });
        } catch {
            setNotice({ text: 'Full screen is unavailable in this browser.', error: true });
        }
    }

    return (
        <>
            <header className="topbar">
                <div className="topbar-inner">
                    <div className="brand"><span className="brand-mark"><OrbitIcon name="orbit" size={25}/></span><span>Orbit<span className="brand-accent">Lab</span><small>GRAVITY SIMULATOR</small></span></div>
                    <div className="header-actions">
                        <Button className="outline" icon="help" onClick={() => setDialog('help')}>Guide</Button>
                        <Button className="outline" icon="settings" onClick={() => setDialog('settings')}>Settings</Button>
                    </div>
                </div>
            </header>
            <main className="shell">
                <div className="intro">
                    <div><h1>Simulation workspace</h1><p>Explore how gravity shapes the motion of celestial bodies.</p></div>
                    <div className="status"><i className={settings.paused || frame.error ? 'idle' : ''}/>{frame.error ? 'Simulation stopped' : settings.paused ? 'Simulation paused' : 'Simulation running'}</div>
                </div>

                {(notice || frame.error) && <div className={'notice ' + (frame.error || notice?.error ? 'error' : '')} role={frame.error || notice?.error ? 'alert' : 'status'}>
                    {frame.error || notice?.text}
                    {notice && <Button className="icon-button" icon="close" label="Dismiss message" onClick={() => setNotice(null)}/>}
                </div>}
                <div className="workspace">
                    <section className="panel view-panel" aria-labelledby="viewport-title">
                        <div className="panel-head">
                            <h2 id="viewport-title"><OrbitIcon name="orbit"/> Orbital view</h2>
                            <div className="view-actions">
                                <Button className="chip" disabled={!["solarSystem", "earthMoonSystem"].includes(presetId)} aria-pressed={display.guides && ["solarSystem", "earthMoonSystem"].includes(presetId)} onClick={() => toggleDisplay('guides')}>Orbits</Button>
                                <Button className="chip" aria-pressed={display.labels} onClick={() => toggleDisplay('labels')}>Labels</Button>
                            </div>
                        </div>
                        <div className="viewport" ref={viewport}>
                            <OrbitViewport frame={frame} system={system} camera={camera} setCamera={setCamera} presetId={presetId}
                                selected={body?.id} onSelect={setSelected} {...display}/>
                            <div className="view-caption"><strong>{presetName}</strong><span>3D VIEW · DISPLAY SCALED</span></div>
                            <div className="camera-actions" aria-label="Camera controls">
                                <Button className="icon-button" icon="plus" label="Zoom in" onClick={() => zoom(1.28)}/>
                                <Button className="icon-button" icon="minus" label="Zoom out" onClick={() => zoom(1 / 1.28)}/>
                                <Button className="icon-button" icon="target" label="Reset camera" onClick={() => setCamera(initialCamera)}/>
                                <Button className="icon-button fullscreen" icon="expand" label="Toggle full screen" onClick={toggleFullscreen}/>
                            </div>
                            <div className="canvas-hint"><span className="mouse-hint">Drag to rotate · Scroll to zoom</span><span className="touch-hint">Drag to rotate · Pinch to zoom</span></div>
                        </div>
                        <div className="transport" aria-label="Playback controls">
                            <div className="playback">
                                <Button className="accent play" icon={settings.paused ? 'play' : 'pause'} label={settings.paused ? 'Play simulation' : 'Pause simulation'} disabled={!!frame.error} onClick={togglePlay}/>
                                <Button className="icon-button" icon="step" label="Advance up to one simulated hour" disabled={!settings.paused || !!frame.error} onClick={frame.step}/>
                                <Button className="icon-button" icon="reset" label="Reset simulation" onClick={() => { frame.reset(system); setCamera(initialCamera); }}/>
                            </div>
                            <div className="sim-clock"><span>SIMULATED TIME</span><strong>{(frame.elapsed / DAY).toFixed(2)} <small>days</small></strong></div>
                            <div className="speed-control">
                                <label htmlFor="pace">Time scale</label>
                                <select id="pace" value={settings.pace} onChange={event => patchSettings({ pace: Number(event.target.value) })}>
                                    {speeds.map(speed => <option key={speed} value={speed}>{speed} day/s</option>)}
                                </select>
                            </div>
                        </div>
                    </section>

                    <aside className="panel inspector" aria-labelledby="inspector-title">
                        <div className="panel-head"><h2 id="inspector-title"><OrbitIcon name="target"/> Body inspector</h2><span className="count">{frame.bodies.length} bodies</span></div>
                        {body && <>
                            <div className="body-identity" style={{ '--body-color': bodyColor(body) }}>
                                <span className={'body-avatar ' + (body.type === 'star' ? 'star-avatar' : '')}>{body.type === 'star' && <OrbitIcon name="sun" size={27}/>}</span>
                                <div><p>{bodyTypes[body.type] ?? body.type}</p><h3>{body.name}</h3></div>
                                <Button className="icon-button" icon="edit" label="Edit selected body" onClick={() => openEditor(body)}/>
                            </div>
                            <dl className="metrics">
                                <div><dt>Mass</dt><dd>{scientific(body.mass)} <span>kg</span></dd></div>
                                <div><dt>Radius</dt><dd>{format.format(body.radius / 1000)} <span>km</span></dd></div>
                                <div><dt>Speed</dt><dd>{format.format(Math.hypot(...body.velocity) / 1000)} <span>km/s</span></dd></div>
                                <div><dt>{'Distance to ' + reference.name}</dt><dd>{format.format(distance / ASTRONOMICAL_UNIT)} <span>AU</span></dd></div>
                            </dl>
                            <Button className="outline focus" icon="target" aria-pressed={camera.focus === body.id}
                                onClick={() => setCamera(current => current.focus === body.id ? initialCamera : { ...current, focus: body.id, zoom: 1.7 })}>
                                {camera.focus === body.id ? 'Release camera' : 'Focus camera'}
                            </Button>
                        </>}
                        <div className="objects">
                            <h3>System objects</h3>
                            <div className="object-list" role="group" aria-label="System objects">
                                {frame.bodies.map(item => <button type="button" className="object" key={item.id} aria-pressed={item.id === body?.id} onClick={() => setSelected(item.id)}>
                                    <i style={{ '--body-color': bodyColor(item) }}/><span>{item.name}</span><small>{bodyTypes[item.type] ?? item.type}</small>
                                </button>)}
                            </div>
                            <Button className="outline add" icon="plus" disabled={frame.bodies.length >= 60 || system.length >= 60} onClick={() => openEditor(null)}>Add body</Button>
                        </div>
                    </aside>
                </div>

                <section className="library" aria-labelledby="presets-title">
                    <div className="library-heading"><h2 id="presets-title">System presets</h2>
                        <div className="file-actions">
                            <Button className="outline" icon="upload" onClick={() => fileInput.current.click()}>Import</Button>
                            <Button className="outline" icon="download" onClick={() => exportSystem(frame.bodies, presetName.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-'))}>Export</Button>
                            <input ref={fileInput} type="file" accept=".json,application/json" onChange={upload} hidden/>
                        </div>
                    </div>
                    <div className="presets">
                        {presets.map(preset => <button key={preset.id} type="button" className="preset" style={{ '--preset-color': preset.color }}
                            aria-pressed={presetId === preset.id} onClick={() => choosePreset(preset.id)}>
                            <span className="preset-icon"><OrbitIcon name={preset.icon} size={21}/></span>
                            <span><strong>{preset.name}</strong><small>{preset.description}</small></span>
                        </button>)}
                    </div>
                </section>
            </main>
            <footer className="footer"><span>Orbit Lab</span><span>Newtonian gravity · Scaled visualization</span><a href="https://github.com/Olszewski-Jakub/3d-gravity-simulation">GitHub</a></footer>

            {dialog === 'editor' && <BodyEditor body={editingBody} save={saveBody} close={close}
                remove={editingBody && frame.bodies.length > 1 && system.length > 1 ? removeBody : undefined}/>}
            {dialog === 'settings' && <Dialog title="Simulation settings" close={close}>
                <div className="dialog-form">
                    <label>Integration method<select value={settings.method} onChange={event => patchSettings({ method: event.target.value })}>
                        <option value="verlet">Velocity Verlet</option><option value="euler">Euler</option><option value="rk4">Runge–Kutta 4</option>
                    </select></label>
                    <label>Gravity strength <output>{(settings.gravity / GRAVITATIONAL_CONSTANT).toFixed(2)}×</output>
                        <input type="range" min="-2" max="2" step="0.01" value={Math.log10(settings.gravity / GRAVITATIONAL_CONSTANT)}
                            onChange={event => patchSettings({ gravity: GRAVITATIONAL_CONSTANT * 10 ** Number(event.target.value) })}/>
                    </label>
                    <label className="check"><input type="checkbox" checked={settings.collisions} onChange={event => patchSettings({ collisions: event.target.checked })}/> Merge colliding bodies</label>
                    <label className="check"><input type="checkbox" checked={display.trails} onChange={() => toggleDisplay('trails')}/> Show motion trails</label>
                    <Button className="outline" onClick={() => patchSettings({ gravity: GRAVITATIONAL_CONSTANT, method: 'verlet', collisions: true })}>Reset physics settings</Button>
                </div>
            </Dialog>}
            {dialog === 'help' && <Dialog title="Workspace guide" close={close}>
                <div className="guide">
                    <p>Drag the view to rotate the system. Scroll or pinch to zoom. With the view focused, use the arrow keys to rotate. Select an object in the view or inspector to see its live measurements.</p>
                    <p>Pause playback to advance up to one simulated hour at a time. Reset returns the bodies to the starting state of your experiment.</p>
                    <p>Orbit guides mark starting distances in the Solar System and Earth–Moon presets. Trails show the actual paths bodies have taken. Sizes and distances in the view are scaled for readability.</p>
                    <p><kbd>Space</kbd> Play or pause <kbd>R</kbd> Reset camera</p>
                </div>
            </Dialog>}
        </>
    );
}
