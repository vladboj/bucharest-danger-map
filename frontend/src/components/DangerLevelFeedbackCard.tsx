import {
  AlertTriangle,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  HelpCircle,
} from "lucide-react";
import { DangerInfo } from "@shared/types";

type DangerLevelFeedbackCardProps = {
  danger: DangerInfo;
};

const DangerLevelFeedbackCard = ({ danger }: DangerLevelFeedbackCardProps) => {
  const { color, label } = danger;

  // Get appropriate icon, description, and progress width based on specific danger levels
  const getDangerConfig = (dangerLabel: string) => {
    switch (dangerLabel) {
      case "Very Safe":
        return {
          icon: <ShieldCheck className="h-5 w-5 text-white" />,
          description: "Excellent safety record",
          progressWidth: "20%",
          bgStyle: "bg-green-600",
        };
      case "Safe":
        return {
          icon: <Shield className="h-5 w-5 text-white" />,
          description: "Good safety conditions",
          progressWidth: "40%",
          bgStyle: "bg-green-500",
        };
      case "Moderate":
        return {
          icon: <AlertTriangle className="h-5 w-5 text-gray-800" />,
          description: "Exercise normal caution",
          progressWidth: "60%",
          bgStyle: "bg-yellow-500",
        };
      case "Risky":
        return {
          icon: <ShieldAlert className="h-5 w-5 text-white" />,
          description: "Heightened caution advised",
          progressWidth: "80%",
          bgStyle: "bg-orange-500",
        };
      case "Very Risky":
        return {
          icon: <ShieldX className="h-5 w-5 text-white" />,
          description: "High risk area - use caution",
          progressWidth: "100%",
          bgStyle: "bg-red-500",
        };
      case "No data":
        return {
          icon: <HelpCircle className="h-5 w-5 text-white" />,
          description: "Safety data unavailable",
          progressWidth: "0%",
          bgStyle: "bg-gray-500",
        };
      default:
        return {
          icon: <HelpCircle className="h-5 w-5 text-white" />,
          description: "Unknown safety level",
          progressWidth: "50%",
          bgStyle: "bg-gray-500",
        };
    }
  };

  const config = getDangerConfig(label);

  return (
    <div className="absolute bottom-4 left-1/2 z-1000 w-fit max-w-sm -translate-x-1/2 transform rounded-xl border border-gray-200 bg-white/95 p-4 shadow-xl backdrop-blur-sm">
      <div className="flex flex-col gap-3">
        {/* Header with icon and main status */}
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${config.bgStyle}`}
            style={{ backgroundColor: color }}
          >
            {config.icon}
          </div>
          <div className="flex-1">
            <div className="text-lg font-semibold text-gray-900">{label}</div>
            <div className="text-sm text-gray-600">{config.description}</div>
          </div>
        </div>

        {/* Visual indicator bar */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">
              Risk Level
            </span>
            <span className="text-xs text-gray-500">
              {config.progressWidth}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                backgroundColor: color,
                width: config.progressWidth,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DangerLevelFeedbackCard;
