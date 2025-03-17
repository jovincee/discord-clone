import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
/**
 * Create a route for grabbing new invite code when inviting a user; only an admin can create this call
 */
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{serverId: string}> }


) {
    try{
        const { serverId } = await params;
        const profile = await currentProfile();

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }

        //begin updating server data
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                inviteCode: uuidv4(),
            } 

        })

        return NextResponse.json(server);

    } catch (error){
        console.log("[SERVER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

    
}