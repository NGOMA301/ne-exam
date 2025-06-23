import React, { forwardRef } from 'react';
import { Shuffle } from 'lucide-react';

interface InputWithGeneratorProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  onGenerate?: () => void;
  generatorTooltip?: string;
}

const InputWithGenerator = forwardRef<HTMLInputElement, InputWithGeneratorProps>(
  ({ label, error, className = '', onGenerate, generatorTooltip, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={`w-full px-3 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              error ? 'border-red-500' : ''
            } ${className}`}
            {...props}
          />
          {onGenerate && (
            <button
              type="button"
              onClick={onGenerate}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group"
              title={generatorTooltip || 'Generate random value'}
            >
              <Shuffle className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

InputWithGenerator.displayName = 'InputWithGenerator';

export default InputWithGenerator;