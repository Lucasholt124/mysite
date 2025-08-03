// components/section-divider.tsx
interface SectionDividerProps {
  color?: string;
  flip?: boolean;
}

export default function SectionDivider({ color = "#FFFFFF", flip = false }: SectionDividerProps) {
  const transform = flip ? "scaleY(-1)" : "";
  return (
    <div
      className="w-full h-16 md:h-24 lg:h-32"
      style={{
        backgroundColor: "transparent",
        transform: transform,
      }}
      aria-hidden="true"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
        <path
          fill={color}
          fillOpacity="1"
          // Uma curva suave e elegante
          d="M0,192L80,176C160,160,320,128,480,133.3C640,139,800,181,960,186.7C1120,192,1280,160,1360,144L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
}