import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { logout as authLogout } from "@/store/slice/auth-slice";
import { useState } from "react";
import { QueryCache } from "@tanstack/react-query";
import { AuthService } from "@/modules/auth/auth.service";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";

const SignOut = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const queryCache = new QueryCache();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await AuthService.logout();
      if (res) {
        dispatch(authLogout());
        queryCache.clear();
        toast.success("You have been logged out successfully.", {
          duration: 3000,
        });
        router.push("/auth/sign-in");
      }
    } catch (error) {
      console.error("Logout failed:", (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
  onClick={handleLogout}
  className="
    flex w-full items-center gap-2
    rounded-md px-3 py-2
    text-sm
    hover:bg-sidebar-accent
    transition-colors
  "
>
  <LogOutIcon className="size-4" />

  {loading ? "Signing out..." : "Sign out"}
</button>
  );
};

export default SignOut;
