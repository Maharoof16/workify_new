'use client'
import NoDataSvg from "@/assets/no-data.svg";

const NoData = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-1">
      <NoDataSvg className="h-48 w-48" />
      <p className="text-sm opacity-70">No Data Available</p>
    </div>
  );
};

export default NoData;
