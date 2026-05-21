import { LeaveBalanceCard } from "@/modules/timehub/leaves/components/leave-card";
import LeaveForm from "@/modules/timehub/leaves/components/leave-form";
import LeavePolicyCard from "@/modules/timehub/leaves/components/leave-policy-card";

const ApplyLeaves = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-10 gap-3 h-full">
      <div className=" flex flex-col gap-4 xl:col-span-7 rounded-xl border p-3 xl:p-6 border-dashboard-border bg-linear-to-b from-dashboard-card-from to-dashboard-card-to">
        <h2 className="text-lg font-semibold">Apply Leave</h2>
        <div>
          <LeaveForm />
        </div>
      </div>

      <div className="xl:col-span-3 flex flex-col gap-4">
        <LeaveBalanceCard variant="stack" />
        <LeavePolicyCard />
      </div>
    </div>
  );
};

export default ApplyLeaves;
