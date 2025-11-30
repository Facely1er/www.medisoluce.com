import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Database, 
  Server, 
  Monitor, 
  HardDrive, 
  Laptop, 
  Smartphone,
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Card from '../ui/Card';

interface Dependency {
  id: string;
  name: string;
  category: string;
  criticality: 'Critical' | 'High' | 'Medium' | 'Low';
  dependencies: string[];
  riskLevel: 'High' | 'Medium' | 'Low';
}

interface DependencyGraphProps {
  dependencies: Dependency[];
  selectedId?: string;
  onSelect?: (id: string) => void;
}

const DependencyGraph: React.FC<DependencyGraphProps> = ({ 
  dependencies, 
  selectedId, 
  onSelect 
}) => {
  const categoryIcons: Record<string, React.ReactNode> = {
    ehr: <Database className="h-5 w-5" />,
    clinical: <Monitor className="h-5 w-5" />,
    infrastructure: <Server className="h-5 w-5" />,
    medical_devices: <HardDrive className="h-5 w-5" />,
    client_devices: <Laptop className="h-5 w-5" />,
    mobile: <Smartphone className="h-5 w-5" />,
  };

  const getCriticalityColor = (criticality: string) => {
    switch (criticality) {
      case 'Critical': return 'bg-red-500 border-red-600';
      case 'High': return 'bg-orange-500 border-orange-600';
      case 'Medium': return 'bg-yellow-500 border-yellow-600';
      case 'Low': return 'bg-green-500 border-green-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'Medium': return <XCircle className="h-4 w-4 text-yellow-600" />;
      case 'Low': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return null;
    }
  };

  // Build dependency relationships
  const relationships = useMemo(() => {
    const rels: Array<{ from: string; to: string; fromNode: Dependency; toNode?: Dependency }> = [];
    
    dependencies.forEach(dep => {
      dep.dependencies.forEach(depName => {
        const targetDep = dependencies.find(d => d.name === depName);
        if (targetDep) {
          rels.push({ from: dep.id, to: targetDep.id, fromNode: dep, toNode: targetDep });
        } else {
          // External dependency (not in our list)
          rels.push({ from: dep.id, to: depName, fromNode: dep });
        }
      });
    });
    
    return rels;
  }, [dependencies]);

  // Calculate node positions (simple grid layout)
  const nodePositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const cols = Math.ceil(Math.sqrt(dependencies.length));
    
    dependencies.forEach((dep, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      positions[dep.id] = {
        x: col * 200 + 100,
        y: row * 150 + 100
      };
    });
    
    return positions;
  }, [dependencies]);

  // Calculate positions for external dependencies
  // External dependencies are placed to the right of their source node
  const externalPositions = useMemo(() => {
    const positions: Record<string, { x: number; y: number }> = {};
    const externalDepsByFrom: Record<string, string[]> = {};
    
    // Group external dependencies by their source node
    relationships.forEach(rel => {
      if (!rel.toNode) {
        if (!externalDepsByFrom[rel.from]) {
          externalDepsByFrom[rel.from] = [];
        }
        if (!externalDepsByFrom[rel.from].includes(rel.to)) {
          externalDepsByFrom[rel.from].push(rel.to);
        }
      }
    });
    
    // Calculate positions for each external dependency
    Object.entries(externalDepsByFrom).forEach(([fromId, externalNames]) => {
      const fromPos = nodePositions[fromId];
      if (fromPos) {
        externalNames.forEach((extName, index) => {
          // Place external dependencies to the right, with slight vertical offset
          positions[extName] = {
            x: fromPos.x + 250 + (index * 20), // Offset to the right, stack if multiple
            y: fromPos.y + (index * 30) // Slight vertical offset for multiple external deps
          };
        });
      }
    });
    
    return positions;
  }, [relationships, nodePositions]);

  if (dependencies.length === 0) {
    return (
      <Card className="p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Server className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No dependencies mapped yet. Add systems to see the dependency graph.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Dependency Graph
        </h3>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {dependencies.length} systems, {relationships.length} relationships
        </div>
      </div>

      <div className="relative overflow-auto" style={{ minHeight: '400px' }}>
        <svg 
          width="100%" 
          height="100%" 
          className="min-h-[400px]"
          viewBox={`0 0 ${Math.max(600, Math.max(
            ...Object.values(nodePositions).map(p => p.x),
            ...(Object.keys(externalPositions).length > 0 ? Object.values(externalPositions).map(p => p.x) : [0])
          ) + 200)} ${Math.max(400, Math.max(
            ...Object.values(nodePositions).map(p => p.y),
            ...(Object.keys(externalPositions).length > 0 ? Object.values(externalPositions).map(p => p.y) : [0])
          ) + 100)}`}
        >
          {/* Draw relationship lines */}
          {relationships.map((rel, index) => {
            const fromPos = nodePositions[rel.from];
            if (!fromPos) return null; // Skip if source node position not found
            
            // For internal dependencies, use nodePositions; for external, use externalPositions
            let toPos: { x: number; y: number } | undefined;
            if (rel.toNode) {
              // Internal dependency - use nodePositions
              toPos = nodePositions[rel.to];
            } else {
              // External dependency - use externalPositions, or calculate on-the-fly if missing
              toPos = externalPositions[rel.to];
              // If position not calculated, create a default position to the right of source
              if (!toPos) {
                // Calculate a default position for external dependencies that weren't in the memo
                // Place them to the right of the source node
                const externalCount = relationships.filter(
                  r => r.from === rel.from && !r.toNode
                ).length;
                const externalIndex = relationships
                  .filter(r => r.from === rel.from && !r.toNode)
                  .findIndex(r => r.to === rel.to);
                toPos = {
                  x: fromPos.x + 250 + (externalIndex * 20),
                  y: fromPos.y + (externalIndex * 30)
                };
              }
            }
            
            if (!toPos) return null;
            
            return (
              <line
                key={`rel-${index}`}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray={rel.toNode ? "0" : "5,5"}
                markerEnd="url(#arrowhead)"
                className="opacity-50"
              />
            );
          })}

          {/* Arrow marker definition */}
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="10"
              refX="9"
              refY="3"
              orient="auto"
            >
              <polygon points="0 0, 10 3, 0 6" fill="#94a3b8" />
            </marker>
          </defs>

          {/* Draw external dependency markers */}
          {(() => {
            // Get unique external dependencies (deduplicate by name)
            const uniqueExternalDeps = new Map<string, { rel: typeof relationships[0]; extPos: { x: number; y: number } }>();
            
            relationships
              .filter(rel => !rel.toNode) // Only external dependencies
              .forEach(rel => {
                // Only process if we haven't seen this external dependency name yet
                if (!uniqueExternalDeps.has(rel.to)) {
                  // Get position from externalPositions, or calculate on-the-fly if missing
                  let extPos = externalPositions[rel.to];
                  if (!extPos) {
                    const fromPos = nodePositions[rel.from];
                    if (fromPos) {
                      // Calculate position to the right of source node
                      const externalCount = relationships.filter(
                        r => r.from === rel.from && !r.toNode
                      ).length;
                      const externalIndex = relationships
                        .filter(r => r.from === rel.from && !r.toNode)
                        .findIndex(r => r.to === rel.to);
                      extPos = {
                        x: fromPos.x + 250 + (externalIndex * 20),
                        y: fromPos.y + (externalIndex * 30)
                      };
                    } else {
                      return; // Skip if source position not found
                    }
                  }
                  
                  uniqueExternalDeps.set(rel.to, { rel, extPos });
                }
              });
            
            // Render unique external dependencies
            return Array.from(uniqueExternalDeps.entries()).map(([extName, { extPos }]) => (
              <g key={`ext-${extName}`}>
                {/* External dependency circle (smaller, dashed border) */}
                <circle
                  cx={extPos.x}
                  cy={extPos.y}
                  r={20}
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                  className="opacity-60"
                />
                {/* External dependency label */}
                <text
                  x={extPos.x}
                  y={extPos.y + 35}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-500 dark:fill-gray-400 pointer-events-none"
                >
                  {extName.length > 12 ? extName.substring(0, 12) + '...' : extName}
                </text>
              </g>
            ));
          })()}

          {/* Draw nodes */}
          {dependencies.map((dep) => {
            const pos = nodePositions[dep.id];
            if (!pos) return null;
            
            const isSelected = selectedId === dep.id;
            const icon = categoryIcons[dep.category] || <Server className="h-5 w-5" />;
            
            return (
              <g key={dep.id}>
                {/* Node circle */}
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 35 : 30}
                  fill={isSelected ? '#3b82f6' : '#ffffff'}
                  stroke={isSelected ? '#2563eb' : '#e2e8f0'}
                  strokeWidth={isSelected ? 3 : 2}
                  className="cursor-pointer"
                  onClick={() => onSelect && onSelect(dep.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                />
                
                {/* Criticality indicator */}
                <circle
                  cx={pos.x + 20}
                  cy={pos.y - 20}
                  r={8}
                  className={getCriticalityColor(dep.criticality)}
                />
                
                {/* Icon */}
                <foreignObject
                  x={pos.x - 12}
                  y={pos.y - 12}
                  width="24"
                  height="24"
                  className="pointer-events-none"
                >
                  <div className="text-gray-700 dark:text-gray-200">
                    {icon}
                  </div>
                </foreignObject>
                
                {/* Label */}
                <text
                  x={pos.x}
                  y={pos.y + 50}
                  textAnchor="middle"
                  className="text-xs font-medium fill-gray-700 dark:fill-gray-200 pointer-events-none"
                >
                  {dep.name.length > 15 ? dep.name.substring(0, 15) + '...' : dep.name}
                </text>
                
                {/* Risk indicator */}
                <foreignObject
                  x={pos.x - 20}
                  y={pos.y + 20}
                  width="16"
                  height="16"
                  className="pointer-events-none"
                >
                  {getRiskIcon(dep.riskLevel)}
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">Criticality</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Critical</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-gray-600 dark:text-gray-400">High</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Medium</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Low</span>
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">Risk Level</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-gray-600 dark:text-gray-400">High Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <XCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-gray-600 dark:text-gray-400">Medium Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-gray-600 dark:text-gray-400">Low Risk</span>
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">Line Types</div>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-0.5 bg-gray-400"></div>
                <span className="text-gray-600 dark:text-gray-400">Internal</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-0.5 bg-gray-400 border-dashed border-t-2"></div>
                <span className="text-gray-600 dark:text-gray-400">External</span>
              </div>
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-700 dark:text-gray-300 mb-2">Tips</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <p>• Click nodes to select</p>
              <p>• Hover to see details</p>
              <p>• Arrows show dependencies</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DependencyGraph;

