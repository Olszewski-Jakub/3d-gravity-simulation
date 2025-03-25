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
        <div className="bg-space-medium rounded-lg p-4 shadow-md mt-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Export/Import</h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-white hover:text-blue-300 transition-colors"
                >
                    {isExpanded ? '▲' : '▼'}
                </button>
            </div>

            {isExpanded && (
                <div className="mt-3 space-y-3">
                    <p className="text-sm text-gray-300">
                        Save your current system or load a previously saved one:
                    </p>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={handleExport}
                            className="bg-green-600 hover:bg-green-500 text-white py-2 px-3 rounded transition-colors text-sm"
                            disabled={celestialBodies.length === 0}
                        >
                            Export System
                        </button>

                        <button
                            onClick={handleImportClick}
                            className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-3 rounded transition-colors text-sm"
                        >
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
                        <div className="text-red-400 text-xs mt-2 p-2 bg-red-900 bg-opacity-30 rounded">
                            {importError}
                        </div>
                    )}

                    {importSuccess && (
                        <div className="text-green-400 text-xs mt-2 p-2 bg-green-900 bg-opacity-30 rounded">
                            System imported successfully!
                        </div>
                    )}

                    <p className="text-xs text-gray-400 mt-1">
                        Note: Importing a system will replace all current bodies.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ExportImport;