import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ClerkProvider, RedirectToSignIn, SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface InviteCodePageProps {
    params: Promise<{
        inviteCode: string;
    }>
}


const InviteCodePage = async ({
    params,
}:InviteCodePageProps) => {
    const { inviteCode } = await params;
    const profile = await currentProfile();

    //if profile doesn't exist, redirect user to sign in
    if (!profile) {
        return (
            <ClerkProvider>
                 <SignedOut>
                     <RedirectToSignIn />
                 </SignedOut>
             </ClerkProvider>
        )

    }

    if (!inviteCode){
        return redirect("/")        //redirect to root page
    }

    //check if user exists inside server
    const existingServer = await db.server.findFirst({
        where:{
            inviteCode: inviteCode,
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    if (existingServer) {
        return redirect(`/servers/${existingServer.id}`);
    }

    //update and modify server by adding new member:
    const server = await db.server.update({
        where:{
            inviteCode: inviteCode,
        },
        data: {
            members: {
                create: [
                    {
                        profileId: profile.id,
                        
                    }
                ]
            }
        }
    })

    return (
        <div>
        Hello Invite
        </div>
    )


}

export default InviteCodePage;