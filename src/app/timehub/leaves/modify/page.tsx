import CancelLeaveForm from "@/modules/timehub/leaves/components/cancel-leave-form";
import { LeaveBalanceCard } from "@/modules/timehub/leaves/components/leave-card";
import LeavePolicyCard from "@/modules/timehub/leaves/components/leave-policy-card";


const ApplyLeaves = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-3 p-2 h-full">
      
      {/* LEFT */}
      <div className="lg:col-span-7 rounded-2xl border shadow-sm p-3 ">
      <h2 className="text-lg font-jakarta-bold">Modify Leave Request</h2>
        <CancelLeaveForm />
      </div>

      {/* RIGHT */}
      <div className="lg:col-span-3 flex flex-col gap-3">
        <LeaveBalanceCard variant="stack" />
        <LeavePolicyCard  variant="modify"/>
      </div>

    </div>
  );
};

export default ApplyLeaves;
