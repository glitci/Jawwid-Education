import React from 'react';
import { TableColumn } from '../../types/table';

type FilterInput = {
  header: TableColumn;
  type: 'input' | 'select' | 'date';
  placeHolder: string;
  data?: string[];
};
type FilterComponentProps = {
  filter: FilterInput[];
  onChange: (value: string, header: string) => void;
};
const FilterComponent: React.FC<FilterComponentProps> = ({
  filter,
  onChange,
}) => {
  // Handler function to handle input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    header: TableColumn,
  ): void => {
    onChange(e.target.value, header.key);
  };

  // Handler function to handle select changes
  const handleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    header: TableColumn,
  ): void => {
    onChange(e.target.value, header.key);
  };

  return (
    <>
      <div>
        {filter.map((filter, index) => (
          <div key={index}>
            {filter.type === 'input' && (
              <input
                type="text"
                placeholder={filter.placeHolder}
                className="w-full border border-t-4 border-gray-300  dark:bg-strokedark px-4 py-2 rounded-lg focus:outline-none focus:border-blue-400"
                onChange={(e) => handleInputChange(e, filter.header)}
              />
            )}
            {filter.type === 'select' && (
              <select
                className="w-full border border-t-4 border-gray-300  dark:bg-strokedark px-4 py-2 rounded-lg focus:outline-none focus:border-blue-400"
                onChange={(e) => handleSelectChange(e, filter.header)}
              >
                <option value="">{filter.placeHolder}</option>
                {filter.data &&
                  filter.data.map((option, optionIndex) => (
                    <option key={optionIndex} value={option}>
                      {option}
                    </option>
                  ))}
              </select>
            )}
            {filter.type === 'date' && (
              <input
                type="date"
                placeholder={filter.placeHolder}
                className="w-full border border-t-4 border-gray-300  dark:bg-strokedark px-4 py-2 rounded-lg focus:outline-none focus:border-blue-400"
                onChange={(e) => handleInputChange(e, filter.header)}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};
export default FilterComponent;
