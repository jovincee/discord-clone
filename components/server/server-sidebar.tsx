/**
 * 
 * 
 * 
 * @returns Server Sidebar component
 */

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";

//create interface to define serverId's datatype
interface ServerSidebarProps {
    serverId: string
}



export const ServerSidebar = async ({
    serverId
}: ServerSidebarProps) => {
    const profile = await currentProfile();

    //if profile doesn't exist, then redirect user to root page
    if(!profile) { 
        return redirect("/");
    }
    /**
     * This query finds all the created existing channels inside the server + the server's id + all members of 
     * their respective channels and server
     */
    const server = await db.server.findUnique({
            //find serverId
            where: {
                id: serverId,
            },
            //includes list of channels that exists 
            include: {
                channels: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
                //Include all existing profiles in db, order by role
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    }
                },
            }
        });

        //filter a list of text channels which will be rendered in the side bar
        const textChannels = server?.channels.filter((channel) => {
            channel.type === ChannelType.TEXT
        })
        //filter a list of audio channels which will be rendered in the side bar
        const audioChannels = server?.channels.filter((channel) => {
            channel.type === ChannelType.AUDIO
        })
        //filter a list of video channel which will be rendered in the side bar
        const videoChannels = server?.channels.filter((channel) => {
            channel.type === ChannelType.VIDEO
        })

        //filter a list of members (excluding current user's id)
        const members = server?.members.filter((member) => member.profileId !== profile.id)
        
        //check if server exists, if not, redirect to root
        if (!server) {
            return redirect("/");
        }
        //find the current user's role by finding its profile (? is necessary to consider the
        //possibility of the profile Id to be null) and obtaining the user's role
        const role = server.members.find((member) => member.profileId === profile.id)?.role;

    return (
        //create a sidebar with a lighter shade of black-grey compared to the very-left sidebar
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            {/**Server Sidebar Component */}
            <ServerHeader
                server={server}
                role={role}
            />
        </div>
    )
}