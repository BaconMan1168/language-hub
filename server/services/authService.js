import bcrypt from 'bcryptjs';
import prisma from '../prisma.js';

export async function authenticateUser(
    identifier,
    password,
    prismaClient = prisma,
    comparePassword = bcrypt.compare
) {
    const candidates = await prismaClient.user.findMany({
        where: {
            OR: [
                { email: { equals: identifier, mode: 'insensitive' } },
                { username: identifier }
            ]
        }
    });

    const emailCandidate = candidates.find(
        user => user.email.toLowerCase() === identifier.toLowerCase()
    );
    const loginCandidates = emailCandidate ? [emailCandidate] : candidates;

    for (const user of loginCandidates) {
        if (await comparePassword(password, user.password)) return user;
    }

    return null;
}
