/**
 * This layout is responsible for rendering the server where admin users can create channels and read server chats.
 * 
 * @param children: pass on children parameter (children components) as props
 * @param params: parameter that obtains the server id through dynamic api; must be a Promise type variable
 * 
 * @returns 
 */

import { ServerSidebar } from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs'
import { redirect } from "next/navigation";

//Define dataypes for children and params
interface ServerIdLayoutProps {
    children: React.ReactNode
    params: Promise<{ serverId: string }>
}

const ServerIdLayout = async ({
    children,
    params
}: 
    ServerIdLayoutProps
) => {
    const profile = await currentProfile();
    const { serverId } = await params;              //it is important to set params as a promise to properly sync dynamic api

    if (!profile) {
        //redirect user to sign in if profile doesn't exist.
        return (
            <ClerkProvider>
                <SignedIn>{children}</SignedIn>
                <SignedOut>
                    <RedirectToSignIn />
                </SignedOut>
            </ClerkProvider>
        )
    }

    /**
     * Call query that finds the current profile's id where the user is a member of a server.
     * If the query returns nothing, then redirect user to 
     */
    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId:profile.id
                }
            }
        }

    });

    if (!server) {
        return redirect("/")        //redirect to the root page
    }


    return (
        <div className="h-full">
            {/**
             * Create a server side bar on the very left corner of screen
             */}
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
                {/**Server Side Bar */}
                <ServerSidebar serverId={serverId}/>

                
            </div>
            <main className="h-full md:pl-60">
                {children}          {/**Children components*/}
            </main>
            
        </div>
    )

    


}


export default ServerIdLayout;