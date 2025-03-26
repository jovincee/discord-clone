import { currentProfilePages } from "@/lib/current-profile-pages";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";
import { db } from "@/lib/db";

/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponseServerIo,
) {
    console.log("sent");
    //if http request is not post, then return a JSON status error (405)
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed"});
    }

    try {
        const profile = await currentProfilePages(req);
        const { content, fileUrl } = req.body;
        const { serverId, channelId } = req.query;
        /**
         * Check if profile, serverId, channelId, and content are all obtained properly/ properly formatted
         */
        if (!profile){
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!serverId){
            return res.status(400).json({ error: "Server ID missing" });
        }

        if (!channelId) {
            return res.status(400).json({ error: "Channel ID missing" });
        }

        if (!content) {
            return res.status(400).json({ error: "Content missing" });
        }

        //query through server where user belongs inside the server
        const server = await db.server.findFirst({
            where: {
                id: serverId as string,
                members: {
                    some: {
                        profileId: profile.id
                    }
                }
            },
            include: {
                members: true,
            }
        });

        //if server doesn't exist
        if (!server) {
            return res.status(404).json({ message: "Server not found" });
        }

        //query through channel and find where current channel id and server id matches 
        const channel = await db.channel.findFirst({
            where: {
                id: channelId as string,
                serverId: serverId as string,
            }
        });

        //if channel doesn't exist
        if (!channel) {
            return res.status(404).json({ message: "Channel not found" });
        }

        const member = server.members.find((member) => member.profileId === profile.id);

        //if member doesn't exist
        if (!member) {
            return res.status(404).json({ message: "Member not found" });
        }

        //create a new message to send through the API:
        const message = await db.message.create({
            data: {
                content,
                fileUrl,
                channelId: channelId as string,
                memberId: member.id,
            },
            include: {
                member: {
                    include: {
                        profile: true,
                    }
                }
            }
        });

        //if member doesn't exist
        if (!message) {
            return res.status(404).json({ message: "Message not created" });
        }
        //channelkey is required to emit socket messages to ALL members of the channel (real-time)
        const channelKey = `chat:${channelId}:messages`

        //use socket to broadcast that a new message has been sent.
        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);
        
        
    } catch (error) {
        //return a JSON status error if request is not formatted properly
        console.log("[MESSAGES_POST]", error);
        return res.status(500).json({ message: "Internal Error"});
    }
}