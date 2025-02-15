import {ElementType, ChangeEvent, useState, useMemo} from 'react';
import Typography from './Typography';

/**
 * Props of a Single Row in the table
 */
export interface rowProps {
  columns: string[];
  useRightIcon?: boolean;
  onClick?: () => void;
}

interface TableProps {
  columnLabels: string[];
  searchColIdx?: number;
  rows: rowProps[];
  className?: HTMLDivElement['className'];
  RightIcon?: ElementType;
}

const defaultParentClassName: HTMLDivElement['className'] =
  'relative sm:rounded-lg shadow-xl overflow-x-auto rounded-xl';

/**
 * Inspiration from: https://flowbite.com/docs/components/tables/#table-search
 * @param param0
 * @returns
 */
const Table = ({columnLabels, rows, className = '', RightIcon, searchColIdx = 0}: TableProps) => {
  const parentClassName = defaultParentClassName + ' ' + className;
  const [searchValue, setSearchValue] = useState('');

  const shownRows = useMemo(() => {
    if (rows.length === 0) return rows; // No rows to search
    if (rows[0].columns.length <= searchColIdx) return rows; // No columns to search

    // The first column is the searchable row (TODO: Can pass the index by param to the Component)
    return rows.filter(row => row.columns[searchColIdx].toLowerCase().includes(searchValue));
  }, [searchValue, rows, searchColIdx]);

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value.toLowerCase());
  };

  return (
    <div className={parentClassName}>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-2">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200 dark:bg-gray-800 dark:text-gray-400">
          <tr>
            {columnLabels.map((label, idx) => (
              <th key={idx} scope="col" className="px-4 py-4 rounded-t-2xl">
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <div className="p-2 relative bg-gray-200 dark:bg-gray-800">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none"></div>
            <input
              type="text"
              id="table-search"
              className="block p-2 pl-4 text-sm text-gray-900 border border-gray-300 rounded-lg w-full bg-gray-50 active:ring-blue-500 active:border-blue-500 dark:bg-gray-700 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:active:ring-blue-500 dark:active:border-blue-500"
              placeholder="Type to search..."
              onChange={onSearchChange}
            />
          </div>
        </div>

        <tbody>
          {shownRows.map((row, idx) => {
            const alternatingClass: HTMLElement['className'] =
              idx % 2 === 0 ? 'bg-gray-100 dark:bg-gray-900' : 'bg-gray-200 dark:bg-gray-800';
            const lastRowClass: HTMLElement['className'] =
              idx === rows.length - 1 ? 'rounded-b-xl' : '';

            const showIcon = row.useRightIcon ?? false;

            return (
              <tr
                key={idx}
                className={`border-b ${alternatingClass} dark:border-gray-700 active:bg-gray-300 dark:active:bg-gray-600`}
                onClick={row.onClick}
              >
                {row.columns.map((cell, cellIdx) => {
                  const isLastCell = cellIdx === row.columns.length - 1;

                  return (
                    <td key={cellIdx} className={`py-4 pl-4 pr-6 ${lastRowClass}`}>
                      <div className="flex items-center justify-between">
                        <Typography variant="body2">{cell}</Typography>

                        {showIcon && isLastCell && RightIcon && (
                          <RightIcon className="w-5 h-5 text-green-500" />
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
