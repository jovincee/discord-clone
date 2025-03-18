import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ serverId: string }>}
) {

    try {
        const profile = await currentProfile();
        const { serverId } = await params;

        if (!profile){
            return new NextResponse("Unauthorized", { status: 401});
        }

        if (!serverId){
            return new NextResponse("Server ID missing", { status: 400});
        }
        /**
         * Run query where serverId and profileId is not admin's own personal server and members have some id on profile
         */
        const server = await db.server.update({
            where: {
                id: serverId,
                //ensure that admin cannot leave the server
                profileId: {
                    not: profile.id
                },
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            data: {
                members: {
                    deleteMany: {
                        profileId: profile.id
                    }
                }
            }
        })

        console.log(server)

        return NextResponse.json(server);
    } catch (error){
        console.log("[SERVER_ID_LEAVE]", error);
        return new NextResponse("Internal Error", { status: 500});
    }

}