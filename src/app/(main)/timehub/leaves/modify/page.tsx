import CancelLeaveForm from "@/modules/timehub/leaves/components/cancel-leave-form";
import { LeaveBalanceCard } from "@/modules/timehub/leaves/components/leave-card";
import LeavePolicyCard from "@/modules/timehub/leaves/components/leave-policy-card";

const ApplyLeaves = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-3 p-2 h-full">
      <div className=" flex flex-col gap-4 xl:col-span-7 rounded-xl border p-3 xl:p-6 border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to">
        <h2 className="text-lg font-semibold">Modify Leave Request</h2>
        <CancelLeaveForm />
      </div>

      <div className="lg:col-span-3 flex flex-col gap-3">
        <LeaveBalanceCard variant="stack" />
        <LeavePolicyCard variant="modify" />
      </div>
    </div>
  );
};

export default ApplyLeaves;
