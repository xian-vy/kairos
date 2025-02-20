'use client'

interface LoadingBarProps {
  isLoading: boolean;
}

export function LinearLoading({ isLoading }: LoadingBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div
        className={`h-[2px] lg:h-[3px] 3xl:h-[4px] bg-white transition-all ${
          isLoading ? "w-full opacity-100" : "w-0 opacity-0"
        }`}
        style={{
          transition: isLoading
            ? "width 1s ease-in-out"
            : "width 0.5s ease-out, opacity 0.5s ease-out",
        }}
      />
    </div>
  );
} 