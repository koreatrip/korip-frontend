export const parseHtml = (str?: string): React.ReactNode => {
  if (!str) return str;

  return str.split(/<br\s*\/?>/gi).map((part, index, array) => (
    <span key={index}>
      {part}
      {index < array.length - 1 && <br />}
    </span>
  ));
};
