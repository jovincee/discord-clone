import { Server, Member, Profile } from "@prisma/client";

/**
 * This file defines the datatype for Server, Member and Profile
 */
export type ServerWithMembersWithProfiles = 
Server & {
    members: (Member & { profile: Profile})[];
}