"use client";

import { Plus } from "lucide-react";
import { ActionTooltip } from "@/components/action-tooltip";
import { useModal } from "@/hooks/use-modal-store";
/**
 * This component is responsible for creating a button that enables adding a server 
 * 
 * 
 * @returns 
 */
export const NavigationAction = () => {
    //add useModal hook here; update onOpen state from false to true:
    const { onOpen } = useModal();

    return (  
        <div>
            {/**Pass on props where the tooltip would be displayed to while cursor is hovered */}
            <ActionTooltip
                label="Add a server"
                side="right"
                align="center"
            
            >
            <button
                //insert onClick event for adding server here:
                onClick={() => onOpen("createServer")}          //on open but on create server mode
                className="group flex items-center"
            >
               <div className="flex mx-3 h-[48px] w-[48px] rounded-[24px] 
               group-hover:rounded-[16px] transition-all overflow-hidden items-center
               justify-center bg-background dark:bg-neutral-700 group-hover:bg-emerald-500 cursor-pointer">
                    <Plus 
                        className="group-hover:text-white transition text-emerald-500"
                        size={25}
                    />
                </div> 
            </button>
            </ActionTooltip>
        </div>
    );
}
 
