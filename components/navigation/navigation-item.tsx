"use client"

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ActionTooltip } from "@/components/action-tooltip";
import { useTransition } from "react";
/**
 * This item component is a server that the user is currently a member of
 */
//define datatypes of props here:
interface NavigationItemProps {
    id: string;
    imageUrl: string;
    name: string;
};


export const NavigationItem = ({
    id,
    imageUrl,
    name
}: NavigationItemProps) => {
    //define params and router here; router is used for when the user clicks on a server which
    //should load a page.
    const params = useParams();
    const router = useRouter();

    //define onClick event here:
    const onClick = () => {
        router.push(`/servers/${id}`)
    }

    return (
        <ActionTooltip
            label={name}
            side="right"
            align="center"    
        >
            {/**This is the button component where an on click event happens; should open the server */}
            <button
                onClick={ onClick }
                className="group relative flex items-center"

            >
            {/** default and dynamic classes*/}
            <div className={cn(
                "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
                params?.serverId !== id && "group-hover:h[20px]",
                params?.serverId === id ? "h-[36px]" : "h-[8px]"

            )}/>
            {/**Create Server bubble placeholder here with default and dynamic classes */}
            <div className={cn(
                "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden cursor-pointer",
                params?.serverId === id && "bg-primary/10 text-primary rounded-[16px]"            
            )}>
            {/**Create an Image component from the chosen server image from user */}
            <Image 
                fill
                src={imageUrl}
                alt="Channel"
            
            />



            </div>

                
           


            </button>


        </ActionTooltip>
       

    )
}