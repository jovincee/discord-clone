"use client";
import { ServerWithMembersWithProfiles } from "@/types";
import { MemberRole, Server } from "@prisma/client";
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from "lucide-react";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger 

} from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
/**
 * Pass on props for:
 * -server
 * -role
 */
interface ServerHeaderProps {
    server: ServerWithMembersWithProfiles
    role?: MemberRole;

}


const ServerHeader = ({
    server,
    role
} : ServerHeaderProps
) => {

    /**
     * Define server roles here (admin and moderator)
     */
    const isAdmin = role === MemberRole.ADMIN;
    const isModerator = isAdmin || role === MemberRole.MODERATOR;
    //call hook here:
    const { onOpen } = useModal();


    return ( <div>
        <DropdownMenu>
            <DropdownMenuTrigger
                className="focus:outline-none"
                asChild
            >
                <button
                    className="w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 
                    dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10
                    dark:hover:bg-zinc-700/50 transition"
                >
                    {server.name}
                    <ChevronDown className="h-5 w-5 ml-auto" />
                </button>

            </DropdownMenuTrigger>
            {/**Content that gives user option to invite people if user is a moderator */}
            <DropdownMenuContent
                className="w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]"
            >
                {/**Moderator can invite people*/}
                {isModerator && (
                    <DropdownMenuItem
                        onClick={() => onOpen("invite", { server })}            //pass on params to modal store
                        className={"text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"}
                    >
                        Invite People
                        <UserPlus className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {/**Admin can modify Server Settings*/}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => {onOpen("editServer", { server })}}      //pass on params to enter edit server mode
                        className={"px-3 py-2 text-sm cursor-pointer"}
                    >
                        Server Settings
                        <Settings className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {/**Admin can manage members*/}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => {onOpen("members", { server })}}
                        className={"px-3 py-2 text-sm cursor-pointer"}
                    >
                        Manage Members
                        <Users className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}

                 {/**Admin can create channel*/}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => { onOpen("createChannel") }}
                        className={"px-3 py-2 text-sm cursor-pointer"}
                    >
                        Create Channel
                        <PlusCircle className="h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                
                {isModerator && (
                    <DropdownMenuSeparator/>

                )}
                {/**Admin can delete server*/}
                {isAdmin && (
                    <DropdownMenuItem
                        onClick={() => {}}
                        className={"px-3 py-2 text-sm text-rose-700 cursor-pointer"}
                    >
                        Delete Server
                        <Trash className="text-rose-700 h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}
                {/**Feature only rendered if user is neither admin or moderator; user can leave server */}
                {!isAdmin && (
                    <DropdownMenuItem
                        onClick={() => {}}
                        className={"px-3 py-2 text-sm text-rose-700 cursor-pointer"}
                    >
                        Leave Server
                        <LogOut className="text-rose-700 h-4 w-4 ml-auto"/>
                    </DropdownMenuItem>
                )}



                

            </DropdownMenuContent>
        </DropdownMenu>
    </div> );
}
 
export default ServerHeader;