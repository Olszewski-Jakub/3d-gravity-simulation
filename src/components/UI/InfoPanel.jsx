import React from 'react';

const InfoPanel = ({ selectedBody, celestialBodies }) => {
    // If no body is selected, show summary of all bodies
    if (!selectedBody) {
        return (
            <div className="bg-space-medium rounded-lg p-4 shadow-md">
                <h3 className="text-lg font-semibold mb-2">System Info</h3>

                <div className="space-y-2">
                    <div className="text-sm">
                        <span className="block">Bodies: {celestialBodies.length}</span>

                        {/* Count of each body type */}
                        <div className="mt-2">
                            {Object.entries(
                                celestialBodies.reduce((acc, body) => {
                                    acc[body.type] = (acc[body.type] || 0) + 1;
                                    return acc;
                                }, {})
                            ).map(([type, count]) => (
                                <div key={type} className="flex justify-between">
                                    <span className="capitalize">{type}s:</span>
                                    <span>{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Total mass in the system */}
                    <div className="pt-2 border-t border-gray-700">
                        <div className="flex justify-between text-sm">
                            <span>Total Mass:</span>
                            <span>
                {celestialBodies.reduce((sum, body) => sum + body.mass, 0).toExponential(3)} kg
              </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Find the selected body
    const body = celestialBodies.find(body => body.id === selectedBody);

    if (!body) {
        return null;
    }

    // Calculate velocity magnitude
    const velocityMagnitude = Math.sqrt(
        body.velocity[0] * body.velocity[0] +
        body.velocity[1] * body.velocity[1] +
        body.velocity[2] * body.velocity[2]
    );

    // Format position and velocity for display
    const formatVector = (vector) => {
        return vector.map(v => v.toExponential(3)).join(', ');
    };

    return (
        <div className="bg-space-medium rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-semibold mb-2">
                {body.name}
                <span className="text-sm font-normal ml-2 text-gray-300 capitalize">
          ({body.type})
        </span>
            </h3>

            <div className="space-y-3">
                {/* Body properties */}
                <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                        <span>Mass:</span>
                        <span>{body.mass.toExponential(3)} kg</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span>Radius:</span>
                        <span>{body.radius.toExponential(3)} m</span>
                    </div>

                    <div className="flex justify-between text-sm">
                        <span>Speed:</span>
                        <span>{velocityMagnitude.toExponential(3)} m/s</span>
                    </div>
                </div>

                {/* Position and velocity details in collapsible sections */}
                <details className="text-sm pt-2 border-t border-gray-700">
                    <summary className="cursor-pointer font-medium mb-1">Position (x, y, z)</summary>
                    <div className="pl-2 text-gray-300 break-all">
                        [{formatVector(body.position)}]
                    </div>
                </details>

                <details className="text-sm pt-2 border-t border-gray-700">
                    <summary className="cursor-pointer font-medium mb-1">Velocity (x, y, z)</summary>
                    <div className="pl-2 text-gray-300 break-all">
                        [{formatVector(body.velocity)}]
                    </div>
                </details>

                {/* Additional physics info */}
                <details className="text-sm pt-2 border-t border-gray-700">
                    <summary className="cursor-pointer font-medium mb-1">Physics Info</summary>

                    <div className="pl-2 space-y-1 pt-1">
                        {/* Calculate gravitational force with other bodies */}
                        <div>
                            <span className="block font-medium text-blue-300">Gravitational Pull:</span>

                            <div className="mt-1 space-y-1">
                                {celestialBodies
                                    .filter(other => other.id !== body.id)
                                    .map(other => {
                                        // Calculate distance
                                        const dx = other.position[0] - body.position[0];
                                        const dy = other.position[1] - body.position[1];
                                        const dz = other.position[2] - body.position[2];
                                        const distance = Math.sqrt(dx*dx + dy*dy + dz*dz);

                                        // Calculate force using G * m1 * m2 / r^2
                                        const G = 6.67430e-11;
                                        const force = G * body.mass * other.mass / (distance * distance);

                                        return (
                                            <div key={other.id} className="flex justify-between">
                                                <span>{other.name}:</span>
                                                <span>{force.toExponential(3)} N</span>
                                            </div>
                                        );
                                    })}
                            </div>
                        </div>
                    </div>
                </details>
            </div>
        </div>
    );
};

export default InfoPanel;