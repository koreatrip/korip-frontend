export type DropdownItem = {
  value: string;
  label: string;
  onClick: () => void;
};

export const SortOption = {
  DATE_DESC: 'dateDesc',
  DATE_ASC: 'dateAsc',
  NAME_ASC: 'nameAsc',
  NAME_DESC: 'nameDesc',
} as const;

export type SortOption = (typeof SortOption)[keyof typeof SortOption];
