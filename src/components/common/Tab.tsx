const Tab = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 font-semibold transition-colors duration-200 ${
        isActive
          ? 'border-sub-green text-sub-green border-b-2'
          : 'text-main-text-navy/90 hover:text-main-text-navy'
      }`}
    >
      {label}
    </button>
  );
};

export default Tab;
