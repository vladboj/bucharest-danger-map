type IconButtonProps = {
  className?: string;
  icon: React.ReactNode;
  label: string;
  title: string;
  disabled?: boolean;
  onClick: () => void;
};

const IconButton = ({
  className = "",
  icon,
  label,
  title,
  disabled = false,
  onClick,
}: IconButtonProps) => {
  return (
    <button
      className={`flex cursor-pointer items-center justify-center ${className}`}
      aria-label={label}
      title={title}
      disabled={disabled}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

export default IconButton;
