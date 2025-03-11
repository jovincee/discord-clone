import { redirect } from "next/navigation";

import { initialProfile } from "@/lib/initial-profile";
import { db } from "@/lib/db";
import { InitialModal } from "@/components/modals/initial-modal";

const SetupPage = async () => {
    //grab profile from initialProfile lib
    const profile = await initialProfile();

    //query db to check if server exists
    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile?.id
                }
            }
        }
    });

    //if server exists:
    if (server){
        return redirect(`/servers/${server.id}`);
    }


    return <InitialModal />;
}
 
export default SetupPage;