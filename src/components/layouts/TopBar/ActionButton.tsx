import React from "react";

const ActionButtons = () => {
  const buttons = [
    { icon: "📊", label: "Top" },
    { icon: "📈", label: "Gainers" },
    { icon: "✨", label: "New Pairs" },
    { icon: "👤", label: "Profile" },
    { icon: "🚀", label: "Boosted" },
    { icon: "📢", label: "Ads" },
  ];

  return (
    <div className="flex space-x-2">
      {buttons.map((button) => (
        <button
          key={button.label}
          className="flex items-center bg-dex-bg-tertiary hover:bg-dex-bg-highlight text-dex-text-primary rounded px-3 py-2 text-sm transition-colors"
        >
          <span className="mr-1">{button.icon}</span>
          <span>{button.label}</span>
        </button>
      ))}
    </div>
  );
};

export default ActionButtons;
