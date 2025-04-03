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
        style={style}
        className="shadow-lg rounded-lg   overflow-hidden"
      >
        <table className="w-full ">
          <thead
            className="text-left font-semibold uppercase"
            style={{
              backgroundColor: value.headerStyle.backgroundColor,
              color: value.headerStyle.textColor,
              fontSize: `${value.headerStyle.fontSize}px`,
              height: `${value.headerStyle.height}px`,
            }}
          >
            <tr>
              {value.columns.map((col, index) => (
                <th key={index} className="px-4 py-3">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className=" bg-white">
            {value.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className="odd:bg-gray-50">
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="px-4 py-2 text-sm text-gray-800"
                    style={{
                      fontSize: `${value.rowStyle.fontSize}px`,
                      height: `${value.rowStyle.height}px`,
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
