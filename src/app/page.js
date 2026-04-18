'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SimulationControls from '../components/UI/SimulationControls';
import PlanetCreator from '../components/UI/PlanetCreator';
import SystemPresets from '../components/UI/SystemPresets';
import InfoPanel from '../components/UI/InfoPanel';
import ExportImport from '../components/UI/ExportImport';
import TutorialModal from '../components/UI/TutorialModal';
import StatsOverlay from '../components/UI/StatsOverlay';
import MobileTabBar from '../components/UI/MobileTabBar';
import MobileDrawer from '../components/UI/MobileDrawer';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import LoadingFallback from '../components/UI/LoadingFallback';

// Dynamically import the GravitySimulation component with no SSR
const GravitySimulation = dynamic(
    () => import('../components/GravitySimulation'),
    { ssr: false, loading: () => <LoadingFallback /> }
);

const TAB_TITLES = {
  info: 'System Info',
  controls: 'Simulation Controls',
  create: 'Celestial Bodies',
  presets: 'System Presets',
};

export default function Home() {
  const [activeTab, setActiveTab] = useState(null);

  const [simulationState, setSimulationState] = useState({
    timeScale: 20,
    paused: false,
    integrationMethod: 'verlet',
    gravitationalConstant: 6.67430e-11,
    showOrbitalPaths: true,
    enableCollisions: true,
    selectedBody: null,
    focusLock: false,
  });

  const [celestialBodies, setCelestialBodies] = useState([
    {
      id: 'sun',
      name: 'Sun',
      type: 'star',
      mass: 1.989e30,
      radius: 696340000,
      position: [0, 0, 0],
      velocity: [0, 0, 0],
      color: '#FFB142',
      texture: 'sun.jpg',
    },
    {
      id: 'mercury',
      name: 'Mercury',
      type: 'planet',
      mass: 3.3011e23,
      radius: 2439700,
      position: [57.9e9, 0, 0],
      velocity: [0, 47.36e3, 0],
      color: '#A5A5A5',
      texture: 'mercury.jpg',
    },
    {
      id: 'venus',
      name: 'Venus',
      type: 'planet',
      mass: 4.8675e24,
      radius: 6051800,
      position: [108.2e9, 0, 0],
      velocity: [0, 35.02e3, 0],
      color: '#E6C35A',
      texture: 'venus.jpg',
    },
    {
      id: 'earth',
      name: 'Earth',
      type: 'planet',
      mass: 5.972e24,
      radius: 6371000,
      position: [149.6e9, 0, 0],
      velocity: [0, 29.78e3, 0],
      color: '#1289A7',
      texture: 'earth.jpg',
    },
    {
      id: 'mars',
      name: 'Mars',
      type: 'planet',
      mass: 6.39e23,
      radius: 3389500,
      position: [227.9e9, 0, 0],
      velocity: [0, 24.077e3, 0],
      color: '#D0312D',
      texture: 'mars.jpg',
    },
    {
      id: 'jupiter',
      name: 'Jupiter',
      type: 'planet',
      mass: 1.898e27,
      radius: 69911000,
      position: [778.6e9, 0, 0],
      velocity: [0, 13.07e3, 0],
      color: '#E39E5B',
      texture: 'jupiter.jpg',
    },
    {
      id: 'saturn',
      name: 'Saturn',
      type: 'planet',
      mass: 5.683e26,
      radius: 58232000,
      position: [1433.5e9, 0, 0],
      velocity: [0, 9.69e3, 0],
      color: '#F4D4A9',
      texture: 'saturn.jpg',
    },
    {
      id: 'uranus',
      name: 'Uranus',
      type: 'planet',
      mass: 8.681e25,
      radius: 25362000,
      position: [2872.5e9, 0, 0],
      velocity: [0, 6.81e3, 0],
      color: '#A4D2E0',
      texture: 'uranus.jpg',
    },
    {
      id: 'neptune',
      name: 'Neptune',
      type: 'planet',
      mass: 1.024e26,
      radius: 24622000,
      position: [4495.1e9, 0, 0],
      velocity: [0, 5.43e3, 0],
      color: '#4B70DD',
      texture: 'neptune.jpg',
    }
  ]);

  const handleTabChange = (tab) => {
    setActiveTab(prev => prev === tab ? null : tab);
  };

  const updateTimeScale = (scale) => {
    setSimulationState(s => ({ ...s, timeScale: scale }));
  };

  const togglePause = () => {
    setSimulationState(s => ({ ...s, paused: !s.paused }));
  };

  const updateIntegrationMethod = (method) => {
    setSimulationState(s => ({ ...s, integrationMethod: method }));
  };

  const toggleOrbitalPaths = () => {
    setSimulationState(s => ({ ...s, showOrbitalPaths: !s.showOrbitalPaths }));
  };

  const toggleCollisions = () => {
    setSimulationState(s => ({ ...s, enableCollisions: !s.enableCollisions }));
  };

  const updateGravitationalConstant = (value) => {
    setSimulationState(s => ({ ...s, gravitationalConstant: value }));
  };

  const toggleFocusLock = () => {
    setSimulationState(s => ({ ...s, focusLock: !s.focusLock }));
  };

  const addCelestialBody = (newBody) => {
    setCelestialBodies(prev => [...prev, { ...newBody, id: Date.now().toString() }]);
  };

  const removeCelestialBody = (bodyId) => {
    setCelestialBodies(prev => prev.filter(body => body.id !== bodyId));
  };

  const updateCelestialBody = (bodyId, updates) => {
    setCelestialBodies(prev =>
        prev.map(body => body.id === bodyId ? { ...body, ...updates } : body)
    );
  };

  const loadPresetSystem = (presetBodies) => {
    setCelestialBodies(presetBodies);
    setSimulationState(s => ({ ...s, selectedBody: null, focusLock: false }));
  };

  const clearAllBodies = () => {
    setCelestialBodies([]);
    setSimulationState(s => ({ ...s, selectedBody: null, focusLock: false }));
  };

  const selectCelestialBody = (bodyId) => {
    setSimulationState(s => ({ ...s, selectedBody: bodyId }));
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setActiveTab('info');
    }
  };

  const simulationControlsProps = {
    timeScale: simulationState.timeScale,
    paused: simulationState.paused,
    integrationMethod: simulationState.integrationMethod,
    showOrbitalPaths: simulationState.showOrbitalPaths,
    enableCollisions: simulationState.enableCollisions,
    gravitationalConstant: simulationState.gravitationalConstant,
    focusLock: simulationState.focusLock,
    selectedBody: simulationState.selectedBody,
    onUpdateTimeScale: updateTimeScale,
    onTogglePause: togglePause,
    onUpdateIntegrationMethod: updateIntegrationMethod,
    onToggleOrbitalPaths: toggleOrbitalPaths,
    onToggleCollisions: toggleCollisions,
    onUpdateGravitationalConstant: updateGravitationalConstant,
    onToggleFocusLock: toggleFocusLock,
  };

  const planetCreatorProps = {
    onAdd: addCelestialBody,
    onUpdate: updateCelestialBody,
    onRemove: removeCelestialBody,
    onClearAll: clearAllBodies,
    selectedBody: simulationState.selectedBody,
    celestialBodies: celestialBodies,
  };

  const infoPanelProps = {
    selectedBody: simulationState.selectedBody,
    celestialBodies: celestialBodies,
  };

  return (
      <main className="flex flex-col min-h-screen bg-space-dark text-white">
        <Header />

        <div className="flex flex-grow">
          {/* 3D Simulation Area */}
          <div className="relative w-full h-full">
            <GravitySimulation
                celestialBodies={celestialBodies}
                simulationState={simulationState}
                onSelectBody={selectCelestialBody}
                heightClass="h-[calc(100dvh-56px-64px)] md:h-screen"
            />

            {/* SimulationControls overlay — desktop only */}
            <div className="absolute top-4 right-4 hidden md:block max-w-xs">
              <SimulationControls {...simulationControlsProps} />
            </div>

            {/* Stats overlay — always visible */}
            <StatsOverlay celestialBodies={celestialBodies} />
          </div>

          {/* Desktop sidebar — hidden on mobile */}
          <div className="hidden md:flex md:flex-col w-80 bg-space-medium p-4 overflow-y-auto">
            <div className="space-y-6">
              <SystemPresets onSelect={loadPresetSystem} />

              <PlanetCreator {...planetCreatorProps} />

              <InfoPanel {...infoPanelProps} />

              <ExportImport
                  celestialBodies={celestialBodies}
                  onImport={loadPresetSystem}
              />
            </div>
          </div>
        </div>

        {/* Footer — desktop only */}
        <Footer className="hidden md:flex" />

        {/* Mobile bottom tab bar */}
        <MobileTabBar activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Mobile slide-up drawer */}
        <MobileDrawer activeTab={activeTab} onClose={() => setActiveTab(null)}>
          {activeTab === 'info' && <InfoPanel {...infoPanelProps} compact />}
          {activeTab === 'controls' && <SimulationControls {...simulationControlsProps} />}
          {activeTab === 'create' && <PlanetCreator {...planetCreatorProps} />}
          {activeTab === 'presets' && (
              <SystemPresets
                  onSelect={(preset) => {
                    loadPresetSystem(preset);
                    setActiveTab(null);
                  }}
              />
          )}
        </MobileDrawer>

        <TutorialModal />
      </main>
  );
}
