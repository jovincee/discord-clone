import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io"; 
import { Server, Member, Profile } from "@prisma/client";

/**
 * This file defines the datatype for Server, Member and Profile
 */
export type ServerWithMembersWithProfiles = 
Server & {
    members: (Member & { profile: Profile})[];
}

export type NextApiResponseServerIo = NextApiResponse & {
    socket: Socket & {
        server: NetServer & {
            io: SocketIOServer;
        };
    };
};