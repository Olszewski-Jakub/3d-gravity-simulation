import React, { useState, useRef } from 'react';
import { exportSystem, importSystem, validateSystem } from '@/lib/util/systemLoader';

const ExportImport = ({ celestialBodies, onImport }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [importError, setImportError] = useState(null);
    const [importSuccess, setImportSuccess] = useState(false);
    const fileInputRef = useRef(null);

    // Handle export button click
    const handleExport = () => {
        const systemName = celestialBodies.find(body => body.type === 'star')?.name || 'custom-system';
        exportSystem(celestialBodies, systemName.toLowerCase().replace(' ', '-'));
    };

    // Handle import button click
    const handleImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    // Handle file selection
    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            // Reset states
            setImportError(null);
            setImportSuccess(false);

            // Import the system
            const importedBodies = await importSystem(file);

            // Validate the imported system
            const validation = validateSystem(importedBodies);

            if (!validation.valid) {
                setImportError(`Import failed: ${validation.errors.join(', ')}`);
                return;
            }

            // Show warnings if any
            if (validation.warnings.length > 0) {
                console.warn('System import warnings:', validation.warnings);
            }

            // Pass the imported bodies to the parent component
            onImport(importedBodies);
            setImportSuccess(true);

            // Reset success message after 3 seconds
            setTimeout(() => {
                setImportSuccess(false);
            }, 3000);
        } catch (error) {
            setImportError(`Import failed: ${error.message}`);
        }

        // Reset file input
        e.target.value = null;
    };

    return (
        <div className="backdrop-blur-md bg-black/30 rounded-xl p-4 shadow-md border border-white/10">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                    </svg>
                    Export/Import
                </h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white hover:text-blue-300 transition-colors rounded-full p-1 hover:bg-white/10"
                >
                    {isExpanded ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 15l-6-6-6 6"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 9l6 6 6-6"></path>
                        </svg>
                    )}
                </button>
            </div>

            {isExpanded && (
                <div className="mt-4 space-y-4">
                    <p className="text-sm text-gray-300">
                        Save your current system or load a previously saved one:
                    </p>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={handleExport}
                            className="bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 text-green-300 py-2 px-3 rounded-lg transition-colors text-sm flex items-center justify-center"
                            disabled={celestialBodies.length === 0}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="7 10 12 15 17 10"></polyline>
                                <line x1="12" y1="15" x2="12" y2="3"></line>
                            </svg>
                            Export System
                        </button>

                        <button
                            onClick={handleImportClick}
                            className="bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 text-blue-300 py-2 px-3 rounded-lg transition-colors text-sm flex items-center justify-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                            </svg>
                            Import System
                        </button>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".json"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>

                    {importError && (
                        <div className="flex items-center text-red-400 text-xs py-2 px-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                            <span>{importError}</span>
                        </div>
                    )}

                    {importSuccess && (
                        <div className="flex items-center text-green-400 text-xs py-2 px-3 bg-green-900/20 border border-green-500/30 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                            <span>System imported successfully!</span>
                        </div>
                    )}

                    <p className="text-xs text-gray-400">
                        Note: Importing a system will replace all current bodies.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ExportImport;