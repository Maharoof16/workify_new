import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MaleProfile from "@/assets/male-profile.png";
import { cn } from "@/lib/utils";
import { User } from "@/modules/members/users/users";

export function UserAvatar({
  user,
  className,
}: {
  user: User;
  className?: string;
}) {
  return (
    <>
      <Avatar className={cn("w-8 h-8 rounded-lg object-cover", className)}>
        <AvatarImage
          src={MaleProfile.src}
          alt="User Avatar"
          className="h-full w-full object-cover"
        />
        <AvatarFallback
          className={cn("w-8 h-8 rounded-lg object-cover", className)}
        >
          <AvatarImage
            src={MaleProfile.src}
            alt="User Avatar"
            className="h-full w-full object-cover"
          />
        </AvatarFallback>
      </Avatar>
    </>
  );
}
