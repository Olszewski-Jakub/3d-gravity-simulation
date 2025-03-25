'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import SimulationControls from '../components/UI/SimulationControls';
import PlanetCreator from '../components/UI/PlanetCreator';
import SystemPresets from '../components/UI/SystemPresets';
import InfoPanel from '../components/UI/InfoPanel';
import ExportImport from '../components/UI/ExportImport';
import TutorialModal from '../components/UI/TutorialModal';
import Header from '../components/Layout/Header';
import Footer from '../components/Layout/Footer';
import LoadingFallback from '../components/UI/LoadingFallback';

// Dynamically import the GravitySimulation component with no SSR
const GravitySimulation = dynamic(
    () => import('../components/GravitySimulation'),
    { ssr: false, loading: () => <LoadingFallback /> }
);

export default function Home() {
  const [simulationState, setSimulationState] = useState({
    timeScale: 20,
    paused: false,
    integrationMethod: 'verlet', // 'euler', 'verlet', or 'rk4'
    gravitationalConstant: 6.67430e-11, // Standard value
    showOrbitalPaths: true,
    enableCollisions: true,
    selectedBody: null,
  });

  const [celestialBodies, setCelestialBodies] = useState([
    // Default solar system - initial state
    {
      id: 'sun',
      name: 'Sun',
      type: 'star',
      mass: 1.989e30, // kg
      radius: 696340000, // meters
      position: [0, 0, 0],
      velocity: [0, 0, 0],
      color: '#FFB142',
      texture: 'sun.jpg',
    },
    {
      id: 'earth',
      name: 'Earth',
      type: 'planet',
      mass: 5.972e24, // kg
      radius: 6371000, // meters
      position: [149.6e9, 0, 0], // 149.6 million km from sun
      velocity: [0, 29.78e3, 0], // 29.78 km/s orbital velocity
      color: '#1289A7',
      texture: 'earth.jpg',
    },
    {
      id: 'mars',
      name: 'Mars',
      type: 'planet',
      mass: 6.39e23, // kg
      radius: 3389500, // meters
      position: [227.9e9, 0, 0], // 227.9 million km from sun
      velocity: [0, 24.077e3, 0], // 24.077 km/s orbital velocity
      color: '#D0312D',
      texture: 'mars.jpg',
    },
  ]);

  // Functions to update the simulation
  const updateTimeScale = (scale) => {
    setSimulationState({ ...simulationState, timeScale: scale });
  };

  const togglePause = () => {
    setSimulationState({ ...simulationState, paused: !simulationState.paused });
  };

  const updateIntegrationMethod = (method) => {
    setSimulationState({ ...simulationState, integrationMethod: method });
  };

  const toggleOrbitalPaths = () => {
    setSimulationState({ ...simulationState, showOrbitalPaths: !simulationState.showOrbitalPaths });
  };

  const toggleCollisions = () => {
    setSimulationState({ ...simulationState, enableCollisions: !simulationState.enableCollisions });
  };

  const updateGravitationalConstant = (value) => {
    setSimulationState({ ...simulationState, gravitationalConstant: value });
  };

  // Functions to manage celestial bodies
  const addCelestialBody = (newBody) => {
    setCelestialBodies([...celestialBodies, { ...newBody, id: Date.now().toString() }]);
  };

  const removeCelestialBody = (bodyId) => {
    setCelestialBodies(celestialBodies.filter(body => body.id !== bodyId));
  };

  const updateCelestialBody = (bodyId, updates) => {
    setCelestialBodies(
        celestialBodies.map(body =>
            body.id === bodyId ? { ...body, ...updates } : body
        )
    );
  };

  const loadPresetSystem = (presetBodies) => {
    setCelestialBodies(presetBodies);
  };

  const selectCelestialBody = (bodyId) => {
    setSimulationState({ ...simulationState, selectedBody: bodyId });
  };

  return (
      <main className="flex flex-col min-h-screen bg-space-dark text-white">
        <Header />

        <div className="flex flex-grow">
          {/* 3D Simulation Area - takes up most of the screen */}
          <div className="relative w-full h-full">
            <GravitySimulation
                celestialBodies={celestialBodies}
                simulationState={simulationState}
                onSelectBody={selectCelestialBody}
            />

            {/* Overlay for simulation controls */}
            <div className="absolute top-4 right-4">
              <SimulationControls
                  timeScale={simulationState.timeScale}
                  paused={simulationState.paused}
                  integrationMethod={simulationState.integrationMethod}
                  showOrbitalPaths={simulationState.showOrbitalPaths}
                  enableCollisions={simulationState.enableCollisions}
                  gravitationalConstant={simulationState.gravitationalConstant}
                  onUpdateTimeScale={updateTimeScale}
                  onTogglePause={togglePause}
                  onUpdateIntegrationMethod={updateIntegrationMethod}
                  onToggleOrbitalPaths={toggleOrbitalPaths}
                  onToggleCollisions={toggleCollisions}
                  onUpdateGravitationalConstant={updateGravitationalConstant}
              />
            </div>
          </div>

          {/* Side Panel for Editing and Information */}
          <div className="w-80 bg-space-medium p-4 overflow-y-auto">
            <div className="space-y-6">
              <SystemPresets onSelect={loadPresetSystem} />

              <PlanetCreator
                  onAdd={addCelestialBody}
                  onUpdate={updateCelestialBody}
                  onRemove={removeCelestialBody}
                  selectedBody={simulationState.selectedBody}
                  celestialBodies={celestialBodies}
              />

              <InfoPanel
                  selectedBody={simulationState.selectedBody}
                  celestialBodies={celestialBodies}
              />

              <ExportImport
                  celestialBodies={celestialBodies}
                  onImport={loadPresetSystem}
              />
            </div>
          </div>
        </div>

        <Footer />

        {/* Tutorial Modal */}
        <TutorialModal />
      </main>
  );
}