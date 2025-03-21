
/**
 * Add props here where serverId, name, and type are passed on from parent component
 */

import { Hash, Menu, Mic, Video } from "lucide-react";
import MobileToggle from "../mobile-toggle";
import { ChannelType } from "@prisma/client";

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
                        <p className="font-semibold text-md text-black dark:text-white">
                            {name}
                        </p>
                    </>
                
            )}
            
            {type === "channel" && channelType === ChannelType.AUDIO &&(
                <>
                    <Mic className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                        <p className="font-semibold text-md text-black dark:text-white">
                            {name}
                        </p>
                </>
                
            )}

            {type === "channel" && channelType === ChannelType.VIDEO &&(
                <>
                    <Video className="w-5 h-5 text-zinc-500 dark:text-zinc-400" />
                        <p className="font-semibold text-md text-black dark:text-white">
                            {name}
                        </p>
                </>
                
            )}
            
            
        </div> 
        
)}
 
export default ChatHeader;