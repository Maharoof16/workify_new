import CompOffPolicyCard from "@/components/leaves/comp-off-policies";
import CompOffForm from "@/components/leaves/compoff-form";

const Page = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-3 p-2">
      
      {/* LEFT */}
      <div className="lg:col-span-7">
        <CompOffForm />
      </div>

      {/* RIGHT */}
      <div className="lg:col-span-3 flex flex-col gap-3">
        <CompOffPolicyCard />
      </div>

    </div>
  );
};

export default Page;
