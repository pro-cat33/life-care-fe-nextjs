"use client";

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen = ({ message = "読み込み中です..." }: LoadingScreenProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4 px-6 py-8 rounded-3xl bg-white/90 shadow-xl border border-blue-100">
        <span className="loading-spinner" aria-hidden="true" />
        <span className="text-sm md:text-base font-semibold text-main">
          {message}
        </span>
      </div>
    </div>
  );
};

export default LoadingScreen;

