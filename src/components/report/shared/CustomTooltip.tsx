import React from 'react';

interface TooltipEntry {
  name: string;
  value: number;
  color: string;
  dataKey?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
  valueFormatter?: (value: number) => string;
  showTotal?: boolean;
  className?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  valueFormatter = (val) => `${val.toFixed(1)}B IDR`,
  showTotal = true,
  className = ''
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const total = payload.reduce((sum, entry) => sum + (entry.value || 0), 0);

  return (
    <div className={`bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-200/50 ${className}`}>
      <p className="font-bold text-gray-800 mb-3 text-center">{label}</p>
      <div className="space-y-2">
        {payload
          .filter(entry => entry.value > 0)
          .sort((a, b) => b.value - a.value)
          .map((entry, index) => (
            <div key={index} className="flex items-center justify-between gap-4 min-w-[200px]">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm font-medium text-gray-700">
                  {entry.dataKey === 'TikTokTokopedia' ? 'TikTok × Tokopedia' : entry.name}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-800">
                {valueFormatter(entry.value)}
              </span>
            </div>
          ))}
      </div>
      {showTotal && (
        <div className="border-t pt-2 mt-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Total:</span>
            <span className="text-xs font-bold text-gray-700">
              {valueFormatter(total)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTooltip;