import { getAuth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { NextApiRequest } from "next";

/**
 * This function gets the current profile by fetching information to the database
 * by running a query on finding the unique userId.
 * @returns user profile
 */
export const currentProfilePages = async (req: NextApiRequest) => {
    const { userId } = await getAuth(req);

    //check if user is authorized by checking if userId exists
    if (!userId) {
        return null;
    }
    //run a query where userId; profile should be the corresponding userId
    const profile = await db.profile.findUnique({
        where: {
            userId
        }
    });

    return profile;



}