export const CircleUploader = ({ percentage }: { percentage: number }) => {
  const strokeWidth = 10;
  const radius = 50 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference - (percentage / 100) * circumference;

  return (
    <svg
      className="w-6 h-6 absolute -start-[40px] transform -translate-y-1/2 top-1/2"
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="text-gray-200"
        stroke="#d1d5db"
        strokeWidth={strokeWidth}
        fill="transparent"
        r={radius}
        cx="50"
        cy="50"
      />
      <circle
        className="text-blue-500"
        stroke="#3b82f6"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="transparent"
        r={radius}
        cx="50"
        cy="50"
        style={{
          strokeDasharray: circumference,
          strokeDashoffset: progressOffset,
        }}
      />
    </svg>
  );
};

export default CircleUploader;
