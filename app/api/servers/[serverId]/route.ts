/**
 * Route file for /api/servers/[serverId] to cast a PATCH request
 */

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ serverId: string }> }
) {

    try{
        const { serverId } = await params;
        const profile = await currentProfile();
        //if profile doesn't exist:
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 } );
        }

        //if serverId doesnt exist:
        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }
    

    //begin updating server data of specified serverId by running a query
    const server = await db.server.delete({
        where: {
            id: serverId,
            profileId: profile.id
        },
    });


    return NextResponse.json(server);
    } catch (error){
        console.log("[SERVER_ID_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}


export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ serverId: string }> }
) {

    try{
        const { serverId } = await params;
        const profile = await currentProfile();
        const { name, imageUrl } = await req.json();
        //if profile doesn't exist:
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 } );
        }

        //if serverId doesnt exist:
        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }
    

    //begin updating server data of specified serverId by running a query
    const server = await db.server.update({
        where: {
            id: serverId,
            profileId: profile.id
        },
        //data to update
        data: {
            name,
            imageUrl
        }
    })
    return NextResponse.json(server);
    } catch (error){
        console.log("[SERVER_ID]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

}


