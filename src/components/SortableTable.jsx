import { useState } from 'react';

function SortableTable({ columns, data, defaultSortColumn, defaultSortDirection = 'desc', rankKey }) {
  const [sortColumn, setSortColumn] = useState(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState(defaultSortDirection);

  // Handle column header click for sorting
  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      // If same column is clicked, toggle sort direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // If different column is clicked, sort by that column in descending order by default
      setSortColumn(columnKey);
      setSortDirection('desc');
    }
  };

  // Sort the data based on the sort column and direction
  const sortedData = [...data].sort((a, b) => {
    // Get values to compare
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    
    // Determine sort order
    const sortMultiplier = sortDirection === 'asc' ? 1 : -1;
    
    // Compare values
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortMultiplier * aValue.localeCompare(bValue);
    } else {
      return sortMultiplier * (aValue - bValue);
    }
  });

  // If rankKey is provided, preserve the original rank values
  // This ensures that even when sorted by a different column, the rank column still shows the correct rank
  const rankedData = rankKey 
    ? sortedData.map(item => {
        // Find the original item with this item's ID to get its rank
        const originalItem = data.find(original => original.name === item.name);
        return {
          ...item,
          [rankKey]: originalItem[rankKey]
        };
      })
    : sortedData;

  // Render sort indicator
  const renderSortIndicator = (columnKey) => {
    if (sortColumn !== columnKey) {
      return (
        <svg className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    
    if (sortDirection === 'asc') {
      return (
        <svg className="h-4 w-4 text-indigo-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
        </svg>
      );
    } else {
      return (
        <svg className="h-4 w-4 text-indigo-500 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      );
    }
  };

  return (
    <table className="min-w-full divide-y divide-slate-200">
      <thead className="bg-slate-100">
        <tr>
          {columns.map((column) => (
            <th 
              key={column.key} 
              scope="col" 
              className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer group hover:bg-slate-200 transition-colors" 
              onClick={() => handleSort(column.key)}
            >
              <div className="flex items-center">
                {column.label}
                {renderSortIndicator(column.key)}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-slate-200">
        {rankedData.map((item, index) => (
          <tr 
            key={`row-${index}`}
            className={`transition-colors hover:bg-indigo-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
          >
            {columns.map((column) => (
              <td key={`cell-${column.key}-${index}`} className="px-6 py-5 whitespace-nowrap">
                {column.render ? column.render(item) : item[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SortableTable;