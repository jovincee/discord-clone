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
        const { conversationId } = req.query;
        /**
         * Check if profile, serverId, channelId, and content are all obtained properly/ properly formatted
         */
        if (!profile){
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!conversationId){
            return res.status(400).json({ error: "Conversation ID missing" });
        }

       

        if (!content) {
            return res.status(400).json({ error: "Content missing" });
        }

        const conversation = await db.conversation.findFirst({
            where: {
                id: conversationId as string,
                OR: [
                    {
                        memberOne: {
                            profileId: profile.id,
                        }
                    },
                    {
                        memberTwo: {
                            profileId: profile.id,
                        }
                    }
                ]
            },
            include: {
                memberOne: {
                    include: {
                        profile: true,
                    }
                },
                memberTwo: {
                    include: {
                        profile: true,
                    }
                },
            }
        })

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found"});
        }



        const member = conversation.memberOne.profileId === profile.id ? 
        conversation.memberOne : conversation.memberTwo

        //if member doesn't exist
        if (!member) {
            return res.status(401).json({ message: "Member not found" });
        }

        //create a new message to send through the API:
        const message = await db.directMessage.create({
            data: {
                content,
                fileUrl,
                conversationId: conversationId as string,
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

        //channelkey is required to emit socket messages to ALL members of the channel (real-time)
        const channelKey = `chat:${conversationId}:messages`;

        //use socket to broadcast that a new message has been sent.
        res?.socket?.server?.io?.emit(channelKey, message);

        return res.status(200).json(message);
        
        
    } catch (error) {
        //return a JSON status error if request is not formatted properly
        console.log("[MESSAGES_POST_CONVERSATION]", error);
        return res.status(500).json({ message: "Internal Error"});
    }
}