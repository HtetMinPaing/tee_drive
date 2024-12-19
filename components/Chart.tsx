import React from "react";

const Chart = ({usageSummarys}) => {
  return (
    <div className="chart">
    {/* Chart Container */}
    <div className="chart-container">
      {/* Add your chart or visualization here */}
      <div className="polar-grid ">
        {/* Polar grid elements */}
      </div>
    </div>

    {/* Chart Details */}
    <div className="chart-details">
      {/* Total Percentage */}
      <div className="chart-total-percentage ">
        75%
      </div>

      {/* Chart Title */}
      <h3 className="chart-title">
        Chart Title
      </h3>

      {/* Chart Description */}
      <p className="chart-description">
        This is the chart description explaining the data visualization.
      </p>
    </div>
  </div>
  );
};

export default Chart;
