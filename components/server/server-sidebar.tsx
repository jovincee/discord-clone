/**
 * 
 * 
 * 
 * @returns Server Sidebar component
 */

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ChannelType, MemberRole } from "@prisma/client";
import { redirect } from "next/navigation";
import ServerHeader from "./server-header";
import { ServerSearch } from "./server-search";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

//create interface to define serverId's datatype
interface ServerSidebarProps {
    serverId: string
}

//create icon map here:
const iconMap = {
    [ChannelType.TEXT] : <Hash className="mr-2 h-4 w-4"/>,
    [ChannelType.AUDIO] : <Mic className="mr-2 h-4 w-4"/>,
    [ChannelType.VIDEO] : <Video className="mr-2 h-4 w-4"/>
}

//create roleIconMap here
const roleIconMap = {
    [MemberRole.GUEST] : null,
    [MemberRole.ADMIN] : <ShieldAlert className="h-4 w-4 mr-2" />,
    [MemberRole.MODERATOR] : <ShieldCheck className="h-4 w-4 mr-2" />
}


export const ServerSidebar = async ({
    serverId
}: ServerSidebarProps) => {
    const profile = await currentProfile();
    console.log("Server id:",serverId)

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

        // console.log("Server:", server)

        //filter a list of text channels which will be rendered in the side bar
        const textChannels = server?.channels.filter((channel) => 
            channel.type === ChannelType.TEXT
        )
        //filter a list of audio channels which will be rendered in the side bar
        const audioChannels = server?.channels.filter((channel) => 
            channel.type === ChannelType.AUDIO
        )
        //filter a list of video channel which will be rendered in the side bar
        const videoChannels = server?.channels.filter((channel) => 
            channel.type === ChannelType.VIDEO
        )

        //filter a list of members (excluding current user's id)
        const members = server?.members.filter((member) => member.profileId !== profile.id)
        
        //check if server exists, if not, redirect to root
        if (!server) {
            return redirect("/");
        }
        //find the current user's role by finding its profile (? is necessary to consider the
        //possibility of the profile Id to be null) and obtaining the user's role
        const role = server.members.find((member) => member.profileId === profile.id)?.role;
        console.log("Text channel: ", textChannels)
    return (
        //create a sidebar with a lighter shade of black-grey compared to the very-left sidebar
        <div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
            {/**Server Sidebar Component */}
            <ServerHeader
                server={server}
                role={role}
            />
            <ScrollArea className="flex-1 px-3">
                <div className="mt-2">
                    <ServerSearch 
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],

                                }))

                            },

                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: audioChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],

                                }))

                            },

                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type],

                                }))

                            },

                            {
                                label: "Members",
                                type: "member",
                                data: members?.map((member) => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role],

                                }))

                            },
                        ]}
                    />
                </div>
            </ScrollArea>

        </div>
    )
}