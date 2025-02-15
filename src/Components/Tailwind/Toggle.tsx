interface ToggleProps {
  className?: HTMLDivElement['className'];
  checked: boolean;
  onClick: () => void;
  rounded?: boolean;
  size?: 'xs' | 'md' | 'lg' | 'xl';
  disabled?: boolean;
}

const dimensionsClassNames: {
  xs: HTMLDivElement['className'];
  md: HTMLDivElement['className'];
  lg: HTMLDivElement['className'];
  xl: HTMLDivElement['className'];
} = {
  xs: 'w-11 h-6 after:h-5 after:w-5 after:left-[2px] after:top-[2px]',
  md: 'w-16 h-8 after:h-6 after:w-6 after:left-[8px] after:top-[4px]',
  lg: 'w-20 h-10 after:h-8 after:w-8 after:left-[8px] after:top-[4px]',
  xl: 'w-24 h-12 after:h-10 after:w-10 after:left-[8px] after:top-[4px]',
};

export const Toggle = ({
  checked = false,
  className,
  rounded = true,
  size = 'xs',
  onClick,
  disabled = false,
}: ToggleProps) => {
  const roundedProps: HTMLDivElement['className'] = rounded
    ? 'rounded-full after:rounded-full'
    : '';

  const dimensionsClassName = dimensionsClassNames[size];

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        checked={checked}
        onClick={onClick}
        onChange={e => e.stopPropagation()}
        disabled={disabled}
      />
      <div
        className={`bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 \
peer dark:bg-gray-500 after:content-[''] after:absolute after:bg-white after:border-gray-300 after:border \
after:transition-all dark:border-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:bg-blue-600 \
${roundedProps} ${className} ${dimensionsClassName} ${disabled ? 'opacity-50' : ''}`}
      ></div>
    </label>
  );
};
