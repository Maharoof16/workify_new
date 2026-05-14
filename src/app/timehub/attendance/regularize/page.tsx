import AttendancePolicyCard from "@/components/attendance/attendancePolicy";
import RegularizationForm from "@/components/attendance/regularization-form";


const RegularizeAttendance = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-3 p-2">
      
      <div className="lg:col-span-7">
        <RegularizationForm />
      </div>

      <div className="lg:col-span-3 flex flex-col gap-3">
        <AttendancePolicyCard />
      </div>

    </div>
  );
};

export default RegularizeAttendance;
