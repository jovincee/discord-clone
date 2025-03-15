import { v4 as uuidv4 } from "uuid";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function POST(req: Request) {
    try {
        const { name, imageUrl } = await req.json();
        const profile = await currentProfile();
        //check if profile exists
        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        //create server here:
        const server = await db.server.create({
            data: {
                profileId: profile.id,
                name,
                imageUrl,
                inviteCode: uuidv4(),
                channels: {
                    create: [
                        { name: "general", profileId: profile.id }
                    ]
                },
                members: {
                    create: [
                        { profileId: profile.id, role: MemberRole.ADMIN }       //assign user with admin privileges
                    ]
                }
            }
        })


        return NextResponse.json(server);

        



    } catch(error) {
        console.log("[SERVERS_POST]", error); //output servers_post to see which file needs to be debugged
        return new NextResponse("Internal Error", { status: 500 });
        
    
    
    }
}