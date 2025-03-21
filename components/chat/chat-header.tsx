
/**
 * Add props here where serverId, name, and type are passed on from parent component
 */

import { Hash, Menu, Mic, Video } from "lucide-react";
import MobileToggle from "../mobile-toggle";
import { ChannelType } from "@prisma/client";
import { DiscordAvatar } from "../ui/discord-avatar";

interface ChatHeaderProps {
    serverId: string;
    name: string;
    type: "channel" | "conversation";
    channelType?: ChannelType | null;
    imageUrl?: string;
}


const ChatHeader = ({
    serverId,
    name,
    type,
    channelType,
    imageUrl

} : ChatHeaderProps) => {
    
    return ( 
        <div className="text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2">
           
            <MobileToggle serverId={serverId} />
            {type === "channel" && channelType === ChannelType.TEXT && (
                <>
                    <Hash className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                        
                    </>
                
            )}
            
            {type === "channel" && channelType === ChannelType.AUDIO &&(
                <>
                    <Mic className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                    
                </>
                
            )}

            {type === "channel" && channelType === ChannelType.VIDEO &&(
                <>
                    <Video className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                        
                </>
                
            )}

            {type === "conversation" && (
                <DiscordAvatar 
                    src={imageUrl}
                    className="h-8 w-8 md:h-8 md:w-8 mr-2"
                
                />
                
            )}
            <p className="font-semibold text-md text-black dark:text-white">
                            {name}
            </p>  
            
            
        </div> 
        
)}
 
export default ChatHeader;