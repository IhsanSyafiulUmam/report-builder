import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  highlight?: {
    text: string;
    color: 'green' | 'red' | 'blue' | 'yellow' | 'purple';
  };
  description?: string;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  highlight,
  description,
  className = ''
}) => {
  const getHighlightColor = (color: string) => {
    const colors = {
      green: 'text-green-600',
      red: 'text-red-600',
      blue: 'text-blue-600',
      yellow: 'text-yellow-600',
      purple: 'text-purple-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-2xl font-semibold text-gray-800">
        {title}
        {highlight && (
          <span className={`font-bold ${getHighlightColor(highlight.color)}`}>
            {' '}{highlight.text}
          </span>
        )}
        {subtitle && (
          <span className="text-gray-600">
            {' '}{subtitle}
          </span>
        )}
      </h2>
      {description && (
        <p className="mt-4 text-gray-600 max-w-8xl text-base">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;