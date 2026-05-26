import { Button } from "@/components/ui/button";
import { AuthService } from "../auth.service";

const SignInWithMicrosoft = () => {
  async function handleClick() {
    const data = await AuthService.generateSSOURL();
    window.location.href = data;
  }

  return (
    <>
      <Button variant="outline"
        className="w-full flex items-center justify-center gap-2 mb-4"
        onClick={handleClick}>
        <svg width="18" height="18" viewBox="0 0 23 23">
          <path fill="#f35325" d="M1 1h10v10H1z" />
          <path fill="#81bc06" d="M12 1h10v10H12z" />
          <path fill="#05a6f0" d="M1 12h10v10H1z" />
          <path fill="#ffba08" d="M12 12h10v10H12z" />
        </svg>
        Sign in with Microsoft
      </Button>
    </>
  );
};

export default SignInWithMicrosoft;
