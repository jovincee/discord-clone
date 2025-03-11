import { currentUser } from "@clerk/nextjs/server";
import { auth } from '@clerk/nextjs/server'

import { db } from "@/lib/db"
/**
 * This initialProfile lib tool gets info from the current user, and goes through the
 * process of authentication.
 * It checks if the user is either logged in or not. If it is logged in, find the profile
 * from the db and checks if profile exists or not.
 * If profile doesn't exist, then create a new profile.
 * 
 * @returns profile
 */
export const initialProfile = async () => {
    //get logged in user
    const user = await currentUser()
    const { userId, redirectToSignIn } = await auth()
    //if both user or userId doesn't exist, redirect to sign in
    if (!user || !userId) {
        return redirectToSignIn()
    }
    //find profile
    const profile = await db.profile.findUnique({
        where: {
            userId: user.id
        }
    });

    if (profile) {
        return profile;
    }
    //if profile doesn't exist, create new profile here:
    const newProfile = await db.profile.create({
        data: {
            userId: user.id,
            name: `${user.firstName} ${user.lastName}`,
            imageUrl: user.imageUrl,
            email: user.emailAddresses[0].emailAddress
        }
    })




}