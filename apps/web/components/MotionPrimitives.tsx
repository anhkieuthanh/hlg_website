import { Children } from "react";
import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function Reveal({ children, className, delay = 0, y = 18 }: RevealProps) {
  return (
    <div className={className} style={motionVars(delay, y)}>
      {children}
    </div>
  );
}

export function Stagger({ children, className, delay = 0, y = 18 }: RevealProps) {
  return (
    <div className={className} style={motionVars(delay, y)}>
      {Children.map(children, (child, index) => (
        <div className="motion-item" style={{ "--motion-index": index } as CSSProperties}>
          {child}
        </div>
      ))}
    </div>
  );
}

function motionVars(delay: number, y: number) {
  return { "--motion-delay": `${delay}s`, "--motion-y": `${y}px` } as CSSProperties;
}
