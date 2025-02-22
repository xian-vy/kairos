'use client'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FaUser } from "react-icons/fa"

interface AccountMenuProps {
  currentUser: any
  userData: any
  onSignOutClick: () => void
}

const AccountMenu = ({ currentUser, userData, onSignOutClick }: AccountMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Avatar className="h-8 w-8">
          <AvatarImage src={currentUser.user_metadata?.avatar_url} />
          <AvatarFallback className="bg-[#1F2137] uppercase text-[#B4B7E5]">
            {currentUser.email?.[0] || <FaUser className="h-4 w-4 text-[#B4B7E5]" />}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-[#0D0F23] border-[#1F2137] p-2">
        <DropdownMenuLabel className="text-[#E2E4FF]">
          <div className="flex flex-col">
            <span className="font-medium">Email</span>
            <span className="text-xs text-[#B4B7E5]">{currentUser.email}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuLabel className="text-[#E2E4FF]">
          <div className="flex flex-col">
            <span className="font-medium">Username</span>
            <span className="text-xs text-[#B4B7E5]">{userData?.username}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-[#1F2137]" />
        <DropdownMenuItem
          className="text-[#E2E4FF] text-xs focus:bg-[#1F2137] focus:text-[#E2E4FF] cursor-pointer"
          onClick={onSignOutClick}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default AccountMenu