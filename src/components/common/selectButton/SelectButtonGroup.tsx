import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import SelectButton from '@/components/common/selectButton/SelectButton';

type SelectOption = {
  id: string;
  label: string;
};

type SelectButtonGroupProps = {
  options: SelectOption[];
  initialSelectedIds?: string[];
  singleSelect?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  className?: string;
};

const SelectButtonGroup = ({
  options,
  initialSelectedIds = [],
  singleSelect = false,
  onSelectionChange,
  className,
}: SelectButtonGroupProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelectedIds);

  const handleButtonClick = (id: string) => {
    let newSelectedIds: string[];

    if (singleSelect) {
      newSelectedIds = selectedIds[0] === id ? [] : [id];
    } else {
      if (selectedIds.includes(id)) {
        newSelectedIds = selectedIds.filter((selectedId) => selectedId !== id);
      } else {
        newSelectedIds = [...selectedIds, id];
      }
    }
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  return (
    <div
      className={twMerge(
        'mb-2 flex flex-row overflow-x-auto py-1 whitespace-nowrap',
        className
      )}
    >
      {options.map((option) => (
        <SelectButton
          key={option.id}
          selected={selectedIds.includes(option.id)}
          onClick={() => handleButtonClick(option.id)}
          className='mr-2 last:mr-0'
        >
          {option.label}
        </SelectButton>
      ))}
    </div>
  );
};

export default SelectButtonGroup;
