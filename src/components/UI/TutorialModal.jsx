import React, { useState, useEffect } from 'react';

const TutorialModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    // Check local storage to see if tutorial has been shown already
    useEffect(() => {
        const tutorialShown = localStorage.getItem('gravity-simulator-tutorial-shown');
        if (!tutorialShown) {
            setIsOpen(true);
            localStorage.setItem('gravity-simulator-tutorial-shown', 'true');
        }
    }, []);

    // Tutorial content
    const tutorialSteps = [
        {
            title: 'Welcome to the 3D Gravity Simulator!',
            content: 'This simulator lets you explore gravitational interactions between celestial bodies using accurate Newtonian physics.',
            image: '/tutorial/welcome.png'
        },
        {
            title: 'Navigation Controls',
            content: 'You can rotate the view by dragging with your mouse, zoom with the scroll wheel, and pan by holding Shift while dragging.',
            image: '/tutorial/controls.png'
        },
        {
            title: 'Simulation Controls',
            content: 'Use the controls panel to adjust time scale, integration method, and other simulation parameters. You can also toggle orbital paths and collision mechanics.',
            image: '/tutorial/simulation.png'
        },
        {
            title: 'Creating Planets',
            content: 'Create new celestial bodies with the planet creator. You can specify mass, radius, position, velocity, and more. The "Calculate Stable Orbit" button helps you place bodies in stable orbits.',
            image: '/tutorial/create.png'
        },
        {
            title: 'System Presets',
            content: 'Try different pre-configured systems like our Solar System, a binary star system, or the chaotic system for interesting gravitational interactions.',
            image: '/tutorial/presets.png'
        }
    ];

    // Handle navigation
    const nextStep = () => {
        if (currentStep < tutorialSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setIsOpen(false);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg z-10"
                title="Show Tutorial"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div className="bg-space-medium rounded-lg shadow-xl max-w-2xl w-full mx-4">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">
                            {tutorialSteps[currentStep].title}
                        </h2>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-white"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="h-48 bg-space-dark rounded flex items-center justify-center">
                            {/* Placeholder for tutorial images */}
                            <div className="text-gray-400 text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Tutorial image</span>
                            </div>
                        </div>

                        <p className="text-white">
                            {tutorialSteps[currentStep].content}
                        </p>
                    </div>

                    <div className="flex justify-between mt-6">
                        <button
                            onClick={prevStep}
                            className={`px-4 py-2 rounded ${
                                currentStep === 0
                                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                            }`}
                            disabled={currentStep === 0}
                        >
                            Previous
                        </button>

                        <div className="flex space-x-1 items-center">
                            {tutorialSteps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`h-2 w-2 rounded-full ${
                                        currentStep === index ? 'bg-blue-500' : 'bg-gray-600'
                                    }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={nextStep}
                            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 text-white"
                        >
                            {currentStep === tutorialSteps.length - 1 ? 'Finish' : 'Next'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TutorialModal;