import React from "react";
import * as LucideIcons from "lucide-react";

interface ListItem {
  icon?: string;
  title: string;
  description: string;
}

interface ListsProps {
  value: {
    title?: string;
    layout?: "grid" | "stack";
    lists: ListItem[];
    iconSize?: number;
    iconColor?: string;
    titleColor?: string;
    titleAlignment?: "left" | "center" | "right";
    titleSize?: number;
  };
  style?: React.CSSProperties;
}

const Lists: React.FC<ListsProps> = ({ value, style }) => {
  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {value.title && (
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
          {value.title}
        </h2>
      )}
      <div
        style={style}
        className={`${
          value.layout === "grid" ? "grid grid-cols-2 gap-4" : ""
        } ${value.layout === "stack" ? "flex flex-col space-y-4" : ""}`}
      >
        {value.lists.map((item, index) => {
          const iconName = item.icon?.match(/data-lucide="([^"]+)"/)?.[1];
          const IconComponent = iconName
            ? (LucideIcons[iconName as keyof typeof LucideIcons] as React.FC<
                React.SVGProps<SVGSVGElement>
              >)
            : null;

          return (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 ease-in-out overflow-hidden group h-full"
            >
              <div
                className={`relative p-4 flex ${
                  value.layout === "grid"
                    ? "flex-col items-center text-center h-full"
                    : "items-center"
                }`}
              >
                {IconComponent && (
                  <div
                    className={`${
                      value.layout === "grid" ? "mb-3" : "mr-4"
                    } transition-colors`}
                  >
                    <IconComponent
                      className={`${
                        value.layout === "grid" ? "text-3xl" : "text-2xl"
                      }`}
                      width={value.iconSize || 16}
                      height={value.iconSize || 16}
                      color={value.iconColor || "#000000"}
                    />
                  </div>
                )}
                <div
                  className={`flex-grow ${!IconComponent ? "w-full" : ""} ${
                    value.layout === "grid" ? "text-center" : ""
                  }`}
                >
                  <h3
                    className="text-lg font-semibold text-black mb-2 transition-colors"
                    style={{
                      color: value.titleColor || "#000000",
                      textAlign: value.titleAlignment || "center",
                      fontSize: `${value.titleSize || 16}px`,
                    }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Lists;
