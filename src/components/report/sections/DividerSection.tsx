import React, { useState, useRef, useEffect } from 'react';

interface DividerProps {
  section: {
    id: string;
    title: string;
    number?: number;
  };
  onUpdate: (updates: { title?: string; number?: number }) => void;
  isEditable: boolean;
}

const DividerSection: React.FC<DividerProps> = ({ section, onUpdate, isEditable }) => {
  const [title, setTitle] = useState(section.title);
  const [number, setNumber] = useState(section.number);

  const titleRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitle(section.title);
  }, [section.title]);

  useEffect(() => {
    setNumber(section.number);
  }, [section.number]);

  const handleBlur = () => {
    const newTitle = titleRef.current?.innerText || '';
    const newNumberStr = numberRef.current?.innerText || '0';
    const newNumber = parseInt(newNumberStr.replace(/[^0-9]/g, ''), 10);

    if (newTitle !== section.title || newNumber !== section.number) {
        onUpdate({
            title: newTitle,
            number: isNaN(newNumber) ? section.number : newNumber,
        });
    }
  };



  return (
    <div className="flex flex-col justify-center h-full p-8 bg-white">
      <div
        ref={numberRef}
        contentEditable={isEditable}
        onBlur={handleBlur}
        suppressContentEditableWarning={true}
        className="text-6xl font-bold text-gray-800 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
      >
        {number !== undefined ? number.toLocaleString() : ''}
      </div>
      <div
        ref={titleRef}
        contentEditable={isEditable}
        onBlur={handleBlur}
        suppressContentEditableWarning={true}
        className="mt-3 text-4xl font-bold text-gray-800 rounded-md outline-none focus:ring-2 focus:ring-blue-400"
      >
        {title}
      </div>
    </div>
  );
};

export default DividerSection;
