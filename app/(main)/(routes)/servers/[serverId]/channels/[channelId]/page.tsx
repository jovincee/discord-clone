import { currentProfile } from "@/lib/current-profile";
import { ClerkProvider, RedirectToSignIn, SignedOut } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ChatHeader from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";

interface ChannelIdProps {
    params: Promise<{
        serverId: string,
        channelId: string;
    }>
}


const ChannelPage = async ({
    params,
}: ChannelIdProps) => {
    const profile = await currentProfile();

    const {serverId, channelId} = await params;

    if(!profile){
        return(
            <ClerkProvider>
                <SignedOut>
                    <RedirectToSignIn/>
                </SignedOut>
            </ClerkProvider>
        )
    }
    //run a query to find the current channel id
    const channel = await db.channel.findUnique({
        where: {
            id: channelId
        }
    });
    //run a query to find matching server id and profile id
    const member = await db.member.findFirst({
        where: {
            serverId: serverId,
            profileId: profile.id,
        }
    });

    //if no channel nor member, redirect 
    if (!channel || !member) {
        redirect("/");
    }
    
    
    
    
    return ( 
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">

            <ChatHeader 
                serverId={serverId}
                name={channel.name}
                type="channel"
                channelType={channel.type}
            
            />
            <div className="flex-1">Future Messages</div>
            <ChatInput apiUrl="/api/socket/messages" 
                query={{
                    channelId: channel.id,
                    serverId: channel.serverId
                }} 
                name={channel.name} 
                type="channel"/>

        </div> 
    );
}
 
export default ChannelPage;