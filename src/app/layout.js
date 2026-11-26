import './globals.css';

export const metadata = {
    title: 'Orbit Lab — 3D Gravity Simulator',
    description: 'Explore gravitational systems, inspect celestial bodies, and build your own orbital experiments.'
};

export default function RootLayout({ children }) {
    return <html lang="en"><body>{children}</body></html>;
}
