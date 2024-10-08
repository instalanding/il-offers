import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LiaUser } from "react-icons/lia";

const ProfileCard = ({ name, date }: any) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar>
        <AvatarFallback>
          <LiaUser className="text-slate-700" size={22} />
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="text-[15px]">{name}</p>
        <p className="text-[13px] text-[#0000006a]">{date}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
