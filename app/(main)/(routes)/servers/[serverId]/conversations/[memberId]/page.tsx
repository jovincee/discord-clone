import ChatHeader from "@/components/chat/chat-header";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { ClerkProvider, RedirectToSignIn, SignedOut } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface ConvesationPageProps {
    params: Promise<{
        memberId: string
        serverId: string
    }>
}



const ConversationPage = async ({
    params,
} : ConvesationPageProps) => {

    const {memberId, serverId} = await params;
    const profile = await currentProfile();

    if (!profile) {
        return (
            <ClerkProvider>
                <SignedOut>
                    <RedirectToSignIn/>
                </SignedOut>
            </ClerkProvider>
        )
    }

    const currentMember = await db.member.findFirst({
        where: {
            serverId: serverId,
            profileId: profile.id,
        },
        include: {
            profile: true,
        }
    });

    //if member doesn't exist:
    if (!currentMember){
        return redirect("/");
    }

    //get conversation:
    const conversation = await getOrCreateConversation(currentMember.id, memberId);

    //if conversation doesn't exist, thenr edirect to server page
    if (!conversation) {
        return redirect(`/servers/${serverId}`);
    }

    const { memberOne, memberTwo } = conversation;

    //check to see which one is the authorized member (member one in this case). If member one is not
    //the auth user, then other member should be member one.
    const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne;

    return ( 
        
        <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
            <ChatHeader 
                imageUrl={otherMember.profile.imageUrl}
                name={otherMember.profile.name}
                serverId={serverId}
                type="conversation"    
            
            />
        </div>
        
    )
        
}
 
export default ConversationPage;