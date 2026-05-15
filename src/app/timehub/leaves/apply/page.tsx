import { LeaveBalanceCard } from "@/components/leaves/leave-card";
import LeaveForm from "@/components/leaves/leave-form";
import LeavePolicyCard from "@/components/leaves/leave-policy-card";


const ApplyLeaves = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-3 h-full">
      
      {/* LEFT */}
      <div className="lg:col-span-7 rounded-2xl border shadow-sm p-3 ">
      <h2 className="text-lg font-jakarta-bold">Apply Leave</h2>
        <LeaveForm />
      </div>

      {/* RIGHT */}
      <div className="lg:col-span-3 flex flex-col gap-4">
        <LeaveBalanceCard variant="stack" />
        <LeavePolicyCard />
      </div>

    </div>
  );
};

export default ApplyLeaves;
