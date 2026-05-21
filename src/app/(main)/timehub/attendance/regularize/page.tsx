import AttendancePolicyCard from "@/modules/timehub/attendance/components/attendancePolicy";
import RegularizationForm from "@/modules/timehub/attendance/components/regularization-form";



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
