import { redirect } from "next/navigation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NavigationAction } from "./navigation-action";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationItem } from "./navigation-item";
import { ModeToggle } from "@/components/mode-toggle";
import { UserButton } from "@clerk/nextjs";


/**
 * This is a component for the navigation sidebar
 * @returns 
 */
export const NavigationSidebar = async () => {
    //fetch current profile that is logged in
    const profile = await currentProfile();

    if (!profile){
        return redirect("/")        //if profile doesn't exist, then redirect to the main page (login or signup)
    }

    //query for server that is created by the current profile;
    //query inside db inside member's list where profile id might exist in
    //many servers.
    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    return ( 
        <div
            className="space-y-4 flex flex-col items-center h-full text-primary w-full 
            dark:bg-[#1E1F22] py-3"
        >
            <NavigationAction />
            <Separator
                className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto"
            />
            {/**Create a ScrollArea component here; used for scrolling through servers */}
            <ScrollArea className="flex-1 w-full">
                {servers.map((server) => (
                    <div key={server.id} className="mb-4">
                    <NavigationItem
                        id={server.id}
                        name={server.name}
                        imageUrl={server.imageUrl}
                    />
                    </div>
                    

                ))}

            </ScrollArea>
            {/**Create a Toggle button for theme and */}
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle />
                {/**Create a avatar box so that when user clicks, user can logout */}
                <UserButton
                    
                    appearance={{
                        elements: {
                            avatarBox: "h-[48px] w-[48px]"
                        }                        
                    }}
                    afterSignOutUrl="/"
                />

            </div>

        </div>


     );
}
