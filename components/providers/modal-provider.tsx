"use client";           //also rendered to client; prevent hydration errors

import { CreateServerModal } from "@/components/modals/create-server-modal";
import { EditServerModal } from "@/components/modals/edit-server-modal";
import { useEffect, useState } from "react";
import { InviteModal } from "@/components/modals/invite-modal";
import { MembersModal } from "@/components/modals/members-modal";
import { CreateChannelModal } from "@/components/modals/create-channel-modal";
import { LeaveServerModal } from "@/components/modals/leave-server-modal";
import { DeleteServerModal } from "../modals/delete-server-modal";
import { DeleteChannelModal } from "../modals/delete-channel-modal";
import { EditChannelModal } from "../modals/edit-channel-modal";
/**
 * Create a Modal Provider that provides instructions on how to obtain a value for a dependency
 * This provider also handles mounting and unmounting states of the components.
 * @returns 
 */
export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    //it is important to mount and unmount the provider so that 
    //it prevents rendering of models to the server-side to prevent any inconsistencies to data.
    useEffect(() => {
        setIsMounted(true);

    },[]);

    if (!isMounted) {
        return null;
    }

    return(
        <>
            <CreateServerModal />
            <InviteModal />
            <EditServerModal />
            <MembersModal />
            <CreateChannelModal />
            <LeaveServerModal />
            <DeleteServerModal />
            <DeleteChannelModal/>
            <EditChannelModal/>
        
        </>



    )

}