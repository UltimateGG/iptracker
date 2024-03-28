interface IndeterminateProgressBarProps {
  color?: string;
  barClassName?: string;
}

const IndeterminateProgressBar = ({ color = 'bg-cyan-500', barClassName }: IndeterminateProgressBarProps) => {
  return (
    <div className="w-full">
      <div className={`h-1.5 w-full bg-gray-200 overflow-hidden ${barClassName}`}>
        <div className={`progress w-full h-full left-right ${color}`} />
      </div>
    </div>
  );
};

export default IndeterminateProgressBar;
