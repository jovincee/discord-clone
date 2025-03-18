/**
 * This is the route handler for sending a post request to server when user creates a channel
 */

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const profile = await currentProfile();
        const { name, type } = await req.json();
        const { searchParams } = new URL(req.url);
        
        const serverId = searchParams.get("serverId");
        //check if profile exists
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }

        if (name === "general") {
            return new NextResponse("Name cannot be 'general'", { status: 400 });
        }

        //create server here:
        //define server here with a list of channels and members; invite code is of uuid
        const server = await db.server.update({
            where: {
                id: serverId,
                members: {
                    some: {
                        profileId: profile.id,
                        role: {
                            in: [MemberRole.ADMIN, MemberRole.MODERATOR]
                        }
                    }
                }
            },
            data: {
                channels: {
                    //create a new channel here:
                    create: {
                        profileId: profile.id,
                        name,
                        type
                    }
                }
            }
            
        })


        return NextResponse.json(server);

        



    } catch(error) {
        console.log("[CHANNELS_POST]", error); //output servers_post to see which file needs to be debugged
        return new NextResponse("Internal Error", { status: 500 });
        
    
    
    }
}