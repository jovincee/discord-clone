/**
 * This route file is for calling an API request to the server when admin changes a member's role
 */

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{memberId: string}> }

) {
    try {
        const { memberId } = await params;
        const profile = await currentProfile();
        const { searchParams } = new URL(req.url);

        const serverId = searchParams.get("serverId");

        if (!memberId) {
            return new NextResponse("Member ID missing", { status: 400 });
        }

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }

        //begin query to update kicked member:
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,

            },
            data: {
                members: {
                    deleteMany: {
                        id: memberId,
                        //admin can't delete themselves
                        profileId: {
                            not: profile.id
                        }
                    }
                }

            },
            include: {
                members: {
                    include: {
                        profile: true,
                    }
                }
            }


        })

        return NextResponse.json(server);

    } catch (error) {
        console.log("[MEMBER_TO_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });

    }
}
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{memberId: string}> }


) {
    try {
        const { memberId } = await params;
        const profile = await currentProfile();

        //create search params and get role from user
        const { searchParams } = new URL(req.url);
        const { role } = await req.json();

        //grab server id:
        const serverId = searchParams.get("serverId");

        if (!profile) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!serverId) {
            return new NextResponse("Server ID missing", { status: 400 });
        }

        if (!memberId) {
            return new NextResponse("Member ID missing", { status: 400 });
        }

        //begin updating server data
        const server = await db.server.update({
            where: {
                id: serverId,
                profileId: profile.id,
            },
            data: {
                //query through members
                members: {
                    //wrap with update
                    update: {
                        //find where id = member id and profile id is not the user's OWN id
                        where: {
                            id: memberId,
                            //admin can't change their own role 
                            profileId: {
                                not: profile.id
                            }
                        },
                        //set data to be the new role
                        data: {
                            role
                        }
                    }
                }
            },
            include: {
                members: {
                    include: {
                        profile: true,
                    },
                    orderBy: {
                        role: "asc",
                    }
                }
            }

        })

        return NextResponse.json(server);

    } catch (error){
        console.log("[MEMBERS_ID_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }

    
}