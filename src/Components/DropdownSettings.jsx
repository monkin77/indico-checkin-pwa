import {useEffect, useState} from 'react';
import {EllipsisVerticalIcon} from '@heroicons/react/20/solid';
import PropTypes from 'prop-types';

export default function DropdownSettings({items}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // setup settings dropdown click events
    const onClick = () => {
      setIsVisible(false);
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
    };
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          setIsVisible(v => !v);
        }}
        className="inline-flex items-center p-2 text-sm font-medium text-center
               text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4
               focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-700
               dark:hover:bg-gray-600 dark:focus:ring-gray-500"
      >
        <EllipsisVerticalIcon className="min-w-[1.25rem] h-5" />
      </button>
      <ul
        className={`absolute z-10 right-0 top-full w-max bg-white divide-y divide-gray-100 dark:divide-gray-500 rounded-lg shadow
                   py-2 text-sm text-gray-700 dark:text-gray-200 dark:bg-gray-600 ${
                     isVisible ? '' : 'hidden'
                   }`}
      >
        {items.map((item, i) => (
          <li key={i}>
            <button
              type="button"
              className="flex w-full gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-500 dark:hover:text-white"
            >
              <span className="min-w-[1.25rem] h-5 text-red-700 dark:text-red-500">
                {item.icon}
              </span>
              <span>{item.text}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

DropdownSettings.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.node.isRequired,
      text: PropTypes.string.isRequired,
    })
  ),
};
