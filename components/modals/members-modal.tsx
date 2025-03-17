"use client";


//4:33:24

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
import { ShieldAlert, ShieldCheck } from "lucide-react";

//create role icon map here:
const roleIconMap = {
    "GUEST": null,
    "MODERATOR": <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500"/>,
    "ADMIN": <ShieldAlert className="h-4 w-4 text-rose-500" />
}

export const MembersModal = () => {
    //define Modal Store here for server-related modifications:
    const { onOpen, isOpen, onClose, type, data } = useModal();
    const [loadingId, setLoadingId] = useState("");         //initialize loadingId state here



    //check to see if modal is open and user is managing members
    const isModalOpen = isOpen && type === "members";

    
    const { server } = data as { server: ServerWithMembersWithProfiles};        //strictly set type of server 
                                                                                //
    
    

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
                                    Actions!             
                                </div>
                            )}
                        </div>

                    ))}

                </ScrollArea>
            </DialogContent>
        </Dialog>
   

    )
}