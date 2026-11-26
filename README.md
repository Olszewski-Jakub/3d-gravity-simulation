# Orbit Lab

Orbit Lab is a browser-based 3D gravity simulator for experimenting with Newtonian systems. Choose a preset, adjust the physics, or create a system with your own initial positions and velocities.

## Run locally

Requires Node.js 20 or later.

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Use `npm run build` and `npm start` for a production build.

## Explore a system

- Drag to rotate the view. Scroll or pinch to zoom. Select a body in the viewport or object list to see its live mass, radius, speed, and distance from the most massive body.
- Use the playback controls to pause, advance up to one simulated hour, or restart from the system's starting state. Use **Space** to play or pause and **R** to reset the camera.
- Scrub the recorded timeline to inspect earlier states. Use **Jump to latest** to return, or play from the selected time to continue the simulation from that point. The inspector charts the selected body's recorded speed and distance.
- Choose from five presets or add, edit, and remove bodies. Use **Export** to save current positions and velocities as JSON. **Import** loads existing exports and accepts systems of up to 60 bodies.
- In **Settings**, choose Euler, Velocity Verlet, or Runge–Kutta 4, adjust gravity, and toggle collision merging and motion trails.

The renderer projects 3D coordinates onto a Canvas 2D viewport, so the app runs without WebGL. Display sizes and distances are compressed independently of the physics. Orbit guides indicate starting distances for the Solar System and Earth–Moon presets. Motion trails show simulated positions. Near close encounters, the simulation can advance more slowly than the requested time scale to keep the integration work bounded.

The physics works in SI units. See the [mathematical foundations](documentation/mathematical-foundations.md) for the underlying equations.
