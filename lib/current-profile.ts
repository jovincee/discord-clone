import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";

/**
 * This function gets the current profile by fetching information to the database
 * by running a query on finding the unique userId.
 * @returns user profile
 */
export const currentProfile = async () => {
    const { userId } = await auth();

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