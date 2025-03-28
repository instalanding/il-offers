import React from "react";

interface TableComponentProps {
  value: {
    columns: string[];
    rows: { cells: string[] }[];
    headerStyle: {
      fontSize: number;
      height: number;
      backgroundColor: string;
      textColor: string;
    };
    rowStyle: {
      fontSize: number;
      height: number;
    };
  };
  style?: React.CSSProperties;
}

const Table: React.FC<TableComponentProps> = ({ value, style }) => {
  return (
    <div className="p-2">
    <div
      style={{
        ...style,
      }}
      className="shadow-sm"
    >
      <table className="w-full table-fixed border-collapse ">
        <thead>
          <tr
            style={{
              backgroundColor: value.headerStyle?.backgroundColor,
              height: value.headerStyle?.height
                ? `${value.headerStyle.height}px`
                : "auto",
            }}
            className="bg-gray-100 border-b border-gray-300 rounded-t-lg"
          >
            {value.columns.map((col, index) => (
              <th
                key={index}
                className={`px-3 py-2 text-left font-semibold text-gray-700 uppercase truncate ${
                  index === 0 ? "rounded-tl-lg" : ""
                } ${
                  index === value.columns.length - 1 ? "rounded-tr-lg" : ""
                }`}
                style={{
                  color: value.headerStyle?.textColor,
                  fontSize: value.headerStyle?.fontSize
                    ? `${value.headerStyle.fontSize}px`
                    : "inherit",
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="rounded-b-lg">
          {value.rows.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`${
                rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
              } transition-all`}
              style={{
                height: value.rowStyle?.height
                  ? `${value.rowStyle.height}px`
                  : "auto",
              }}
            >
              {row.cells.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`px-3 py-2 text-sm text-gray-800 break-words ${
                    rowIndex === value.rows.length - 1 && cellIndex === 0
                      ? "rounded-bl-lg"
                      : ""
                  } ${
                    rowIndex === value.rows.length - 1 &&
                    cellIndex === value.columns.length - 1
                      ? "rounded-br-lg"
                      : ""
                  }`}
                  style={{
                    fontSize: value.rowStyle?.fontSize
                      ? `${value.rowStyle.fontSize}px`
                      : "inherit",
                    width: `${100 / value.columns.length}%`,
                    maxWidth: `${100 / value.columns.length}%`,
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default Table;
