import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { Noto_Sans_Tamil_Supplement } from "next/font/google";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
    if (req.method !== "DELETE" && req.method !== "PATCH") {
        return res.status(405).json({ error: "Method not allowed"});
    }

    try {
        const profile = await currentProfilePages(req);
        const {messageId, serverId, channelId } = req.query;
        const { content } = req.body;

        if (!profile) {
            return res.status(401).json({error: "Unauthorized"});
        }

        if (!serverId) {
            return res.status(400).json({error: "Server ID missing"});
        }

        if (!channelId) {
            return res.status(400).json({error: "Channel ID missing"});
        }

        //query server where member is a part of the provided server id
        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id,
                    }
                }
            },
            include: {
                members: true,
            }
        });

        if (!server) {
            return res.status(404).json({ error: "Server not found" });
        }

        //query channel
        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            },
        });

        

        if (!channel) {
            return res.status(404).json({ error: "Channel not found" });
        }

        //query member
        const member = server.members.find((member) => member.profileId === profile.id);

        if (!member) {
            return res.status(404).json({ error: "Member not found" });
        }

        //query existing message 
        let message = await db.message.findFirst({
            where: {
                id: messageId as string,
                channelId: channelId as string,
            },
            include: {
                member:{
                    include: {
                        profile: true,
                    }
                }
            }
        })

        if (!message || message.deleted) {
            return res.status(404).json({ error: "Message not found" });
        }

        const isMessageOwner = message.memberId === member.id;
        const isAdmin = member.role === MemberRole.ADMIN;
        const isModerator = member.role === MemberRole.MODERATOR;
        const canModify = isMessageOwner || isAdmin || isModerator;

        if (!canModify) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        //check if user is deleting the message
        if (req.method === "DELETE") {
            message = await db.message.update({
                where: {
                    id: messageId as string,
                },
                data: {
                    fileUrl: null,
                    content: "This message has been deleted",
                    deleted: true,
                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                }
            })
        }

        //check if user is editing message
        if (req.method === "PATCH") {
            //check if the owner of the message is the user; if not, then return a 401 error
            if (!isMessageOwner) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            message = await db.message.update({
                where: {
                    id: messageId as string,
                },
                data: {

                    content,

                },
                include: {
                    member: {
                        include: {
                            profile: true,
                        }
                    }
                }
            })
        }

        const updateKey = `chat:${channelId}:messages:update`;

        res?.socket?.server?.io?.emit(updateKey, message);

        return res.status(200).json(message);

    } catch (error) {
        console.log("[MESSAGE_ID]", error);
        return res.status(500).json({ error: "Internal Error"});
    }
}