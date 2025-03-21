import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ClerkProvider, RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Create interface for defining the datatype of each
 * props passed on as parameters
 */
interface ServerIdPageProps {
    params: Promise<{
        serverId: string;
    }>
}
const ServerIdPage = async ({
    params
}: ServerIdPageProps) => {
    const profile = await currentProfile();
    const { serverId } = await params;
    const user = await currentUser(); 


    


    if (!profile){
        <ClerkProvider>
            
                <RedirectToSignIn />
            
        </ClerkProvider>
    }

    // if (!profile && ){

    // }
    //get server first channel here:
    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: {
                    profileId: profile?.id,
                }
            }
        },
        include: {
            channels: {
                where: {
                    name: "general"
                },
                orderBy: {
                    createdAt: "asc"
                }
            }
        }
    })

    //get general channel here
    const initialChannel = server?.channels[0];

    if (initialChannel?.name !== "general"){
        return null;
    }

    // const name = server?.channels.find((e) => e.id === )


    //redirect server page to the initial channel
    return (redirect(`/servers/${serverId}/channels/${initialChannel?.id}`))
    
        
}
 
export default ServerIdPage;