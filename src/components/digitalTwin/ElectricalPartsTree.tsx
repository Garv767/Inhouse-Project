import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';

interface PartsTreeProps {
  onSelectComponent: (compName: string) => void;
  selectedComponent: string | null;
}

export const ElectricalPartsTree: React.FC<PartsTreeProps> = ({
  onSelectComponent,
  selectedComponent
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    mcu: true,
    sensor: true,
    actuator: true,
    power: true,
    module: true
  });

  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({
    'Edge Logic Controller': true,
    'Environment Monitor': true,
    'Door Access Sensor': true,
    'Presence Load Cell': true,
    'Audible Alarm': true,
    'Battery Regulator': true,
    'Precision Clock': true
  });

  const toggleCategory = (cat: string) => {
    setExpandedCategories((prev) => ({ ...prev, [cat]: !prev[cat] }));
  };

  const toggleVisibility = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setVisibleItems((prev) => ({ ...prev, [item]: !prev[item] }));
  };

  const categories = [
    {
      id: 'mcu',
      title: 'MCU (1)',
      items: [{ name: 'Edge Logic Controller', idName: 'ESP32' }]
    },
    {
      id: 'sensor',
      title: 'SENSOR (3)',
      items: [
        { name: 'Environment Monitor', idName: 'TEMPERATURE SENSOR' },
        { name: 'Door Access Sensor', idName: 'DOOR / REED SWITCH' },
        { name: 'Presence Load Cell', idName: 'LOAD CELL' }
      ]
    },
    {
      id: 'actuator',
      title: 'ACTUATOR (1)',
      items: [{ name: 'Audible Alarm', idName: 'BUZZER' }]
    },
    {
      id: 'power',
      title: 'POWER (1)',
      items: [{ name: 'Battery Regulator', idName: 'POWER SUPPLY' }]
    },
    {
      id: 'module',
      title: 'MODULE (1)',
      items: [{ name: 'Precision Clock', idName: 'RTC' }]
    }
  ];

  return (
    <div className="w-64 bg-[#0f0f0f] border-l border-[#222222] h-full flex flex-col justify-between p-3 select-none text-xs font-mono">
      <div className="space-y-3">
        <div className="font-bold text-slate-300 uppercase tracking-wider border-b border-[#222222] pb-2 text-[11px]">
          ELECTRICAL PARTS
        </div>

        {/* Tree Categories */}
        <div className="space-y-2">
          {categories.map((cat) => {
            const isExpanded = expandedCategories[cat.id];
            return (
              <div key={cat.id} className="space-y-1">
                <button
                  onClick={() => toggleCategory(cat.id)}
                  className="w-full flex items-center justify-between text-slate-400 hover:text-slate-200 text-[11px] font-semibold"
                >
                  <span className="flex items-center space-x-1">
                    {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    <span>{cat.title}</span>
                  </span>
                </button>

                {isExpanded && (
                  <div className="pl-4 space-y-1">
                    {cat.items.map((item) => {
                      const isVisible = visibleItems[item.name] !== false;
                      const isSelected = selectedComponent === item.idName;
                      return (
                        <div
                          key={item.name}
                          onClick={() => onSelectComponent(item.idName)}
                          className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#222222] text-emerald-400 font-bold border-l-2 border-emerald-400'
                              : 'text-slate-300 hover:bg-[#181818]'
                          }`}
                        >
                          <span className="truncate text-[11px] flex items-center space-x-1.5">
                            <span className="w-1 h-1 rounded-full bg-slate-500" />
                            <span>{item.name}</span>
                          </span>

                          <button
                            onClick={(e) => toggleVisibility(item.name, e)}
                            className="text-slate-500 hover:text-slate-300"
                          >
                            {isVisible ? <Eye className="w-3 h-3 text-slate-400" /> : <EyeOff className="w-3 h-3 text-slate-600" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Wire Connection Legend matching Reference Image */}
      <div className="border-t border-[#222222] pt-3 space-y-2 text-[10px] text-slate-400">
        <div className="font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-1">
          WIRE CONNECTIONS
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-6 h-0.5 bg-emerald-500" />
          <span className="font-semibold text-emerald-400">━ DATA</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-6 h-0.5 border-t border-dashed border-amber-500" />
          <span className="font-semibold text-amber-400">┅ POWER</span>
        </div>

        <div className="flex items-center space-x-2">
          <span className="w-6 h-0.5 bg-gray-600" />
          <span className="font-semibold text-gray-400">━ GROUND</span>
        </div>
      </div>
    </div>
  );
};
