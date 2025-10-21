type CardProps = {
  children: React.ReactNode;
  className?: string;
  rounded?: string;
};

const Card = ({
  children,
  className = "",
  rounded = "rounded-xl",
}: CardProps) => {
  return (
    <div className={`bg-white p-3 shadow-lg ${rounded} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
