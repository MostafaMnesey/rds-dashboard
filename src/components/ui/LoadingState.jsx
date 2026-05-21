import { memo } from "react";
import { Spin } from "antd";

const LoadingState = ({
  message = "Loading...",
  fullScreen = false,
  className = "",
}) => {
  const wrapperClass = fullScreen
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-off-white/80 backdrop-blur-sm"
    : `flex min-h-[40vh] flex-col items-center justify-center gap-4 ${className}`;

  return (
    <div className={wrapperClass}>
      <Spin size="large" />
      {message && (
        <p className="text-sm font-medium text-secondary">{message}</p>
      )}
    </div>
  );
};

export default memo(LoadingState);
