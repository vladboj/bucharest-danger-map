import Card from "./Card";
import IconButton from "./IconButton";
import { LocateFixed, LocateOff } from "lucide-react";

type LocateMeButtonProps = {
  className?: string;
  onLocateMe: () => void;
  status: "idle" | "locating" | "error";
};

const LocateMeButton = ({
  className = "",
  onLocateMe,
  status,
}: LocateMeButtonProps) => {
  const icon =
    status === "locating" ? (
      <LocateFixed className="animate-spin" />
    ) : status === "error" ? (
      <LocateOff />
    ) : (
      <LocateFixed />
    );

  return (
    <Card className={`${className}`}>
      <IconButton
        icon={icon}
        label="Locate Me"
        title="Locate Me"
        onClick={onLocateMe}
      />
    </Card>
  );
};

export default LocateMeButton;
