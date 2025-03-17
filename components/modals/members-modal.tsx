"use client";


//4:33:24

import qs from "query-string";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { useModal } from "@/hooks/use-modal-store";
import { ServerWithMembersWithProfiles } from "@/types";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DiscordAvatar } from "@/components/ui/discord-avatar"
import { Check, Gavel, Loader2, MoreVertical, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuTrigger,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { MemberRole } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";

//create role icon map here:
const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    "ADMIN": <ShieldAlert className="h-4 w-4 text-rose-500" />
}

export const MembersModal = () => {
    //define router here which is used for updating member role:
    const router = useRouter();

    //define Modal Store here for server-related modifications:
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const [loadingId, setLoadingId] = useState("");         //initialize loadingId state here



    //check to see if modal is open and user is managing members
    const isModalOpen = isOpen && type === "members";

    
    const { server } = data as { server: ServerWithMembersWithProfiles};        //strictly set type of server 
                                                                                //

    //set feature where admin can kick a member:
    const onKick = async (memberId: string) => {
        try{
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                }
            });

            const response = await axios.delete(url);

            router.refresh();
            onOpen("members", { server: response.data });

        } catch (error){
            console.log(error);
        } finally {
            setLoadingId("");
        }

    }

    //set feature where admin changes member's role:
    const onRoleChange = async (memberId: string, role: MemberRole) => {
        try{
            setLoadingId(memberId);
            const url = qs.stringifyUrl({
                url: `/api/members/${memberId}`,
                query: {
                    serverId: server?.id,
                }

            });

            const response = await axios.patch(url, { role })
            router.refresh();
            onOpen("members", { server: response.data })            //update data using modal

           

        } catch (error){
           console.log(error); 
        } finally {
            setLoadingId("")
        }
    }
    
    

    //add use modal hook here:
    return (
        //The dialog component handles an open event and an onOpenChange (when user closes the modal screen)
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent
                className="bg-white dark:bg-[#303237] text-black 
                overflow-hidden"
            >
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center text-black dark:text-gray-100">
                        Manage Members
                    </DialogTitle>
                    {/**Show count of members */}
                    <DialogDescription
                        className="text-center text-zinc-500"
                    >
                        {server?.members?.length} Members
                        
                    </DialogDescription>
                </DialogHeader>
                
                <ScrollArea
                    className="mt-8 max-h-[420px] pr-6"
                >
                    {server?.members?.map((member) => (
                        <div key={member.id} className="flex items-center gap-x-2 mb-6">
                            <DiscordAvatar 
                                src={member.profile.imageUrl}
                                showStatusOnHover={false}
                            />
                            <div className="flex flex-col gap-y-1">
                                <div className="text-xs text-black dark:text-white font-bold flex items-center gap-x-1">
                                    {member.profile.name}
                                    {roleIconMap[member.role]}
                                </div>
                                <div className="text-xs text-black dark:text-zinc-500 font-semibold flex items-center gap-x-1">
                                    {member.profile.email}
                                </div>
                                
                            </div>
                            {/**Only show the actions when user is not an admin */}
                            {server.profileId !== member.profileId && loadingId !== member.id && (
                                <div className="ml-auto">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className="h-4 w-4 text-zinc-500"/>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent side="left">
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger
                                                    className="flex items-center"
                                                
                                                >
                                                    <ShieldQuestion 
                                                        className="w-4 h-4 mr-2"
                                                    />
                                                    <span>Role</span>
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                    <DropdownMenuSubContent>
                                                        {/**Contents of dropdown: Guest, moderator */}
                                                        <DropdownMenuItem 
                                                            onClick={()=> onRoleChange(member.id, "GUEST")}
                                                        >
                                                            <Shield className="h-4 w-4 mr-2"/>
                                                            Guest
                                                            {member.role === "GUEST" && (
                                                                <Check 
                                                                    className="h-4 w-4 ml-auto"
                                                                />
                                                            )}
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={()=> onRoleChange(member.id, "MODERATOR")}
                                                        >
                                                            <ShieldCheck className="h-4 w-4 mr-2"/>
                                                            Moderator
                                                            {member.role === "MODERATOR" && (
                                                                <Check 
                                                                    className="h-4 w-4 ml-auto"
                                                                />
                                                            )}
                                                        </DropdownMenuItem>
                                                    </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator />
                                                <DropdownMenuItem
                                                    onClick={() => onKick(member.id)}
                                                >
                                                    <Gavel className="h-4 w-4 mr-2"/>
                                                    Kick
                                                </DropdownMenuItem>

                                        </DropdownMenuContent>
                                    </DropdownMenu>            
                                </div>
                            )}
                            {loadingId === member.id && (
                                <Loader2 
                                    className="animate-spin text-zinc-500 ml-auto w-4 h-4"
                                />
                            )}
                        </div>

                    ))}

                </ScrollArea>
            </DialogContent>
        </Dialog>
   

    )
}