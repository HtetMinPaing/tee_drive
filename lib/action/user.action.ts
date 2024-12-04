'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "@/constants";
import { redirect } from "next/navigation";

const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", [email])],
    );

    return result.total > 0 ? result.documents[0] : null;
}

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
}

export const sendEmailOTP = async ({ email }: { email: string }) => {
    const { account } = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(), email)
        return session.userId;
    } catch (error) {
        handleError(error, "Failed to send Email OTP");
    }
}

export const createAccount = async ({
    fullName,
    email
}: {
    fullName: string
    email: string
}) => {
    const existingAccount = await getUserByEmail(email);
    // console.log("Existing Account: (createAccount) " + existingAccount);

    const accountId = await sendEmailOTP({ email });
    // console.log("Account Id: (createAccount) " + accountId);

    if (!accountId) throw new Error("Failed to send an OTP");

    if (!existingAccount) {
        const { databases } = await createAdminClient();

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                accountId,
                email,
                fullName,
                avatar: avatarPlaceholderUrl,
            }
        )
    }

    return parseStringify({ accountId })
}

export const verifySecret = async ({ accountId, password }: {
    accountId: string
    password: string
}) => {
    try {
        const { account } = await createAdminClient();

        const session = await account.createSession(accountId, password);
        // console.log("AccountId: (verifyAccount)" + accountId);
        // console.log("Password: (verifyAccount)" + password);
        // console.log(parseStringify({ sessionId: session.$id }));

        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        })

        return parseStringify({ sessionId: session.$id })
    } catch (error) {
        handleError(error, "Failed to verify OTP.")
    }
}

export const getCurrentUser = async () => {
    try {
        const { databases, account } = await createSessionClient();

        const result = await account.get();
        // console.log("User is authenticated: (getCurrentUser)", result);
        // console.log("ID: (getCurrentUser)", result.$id);

        const user = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            [Query.equal("accountId", result.$id)],
        )

        // console.log("User: (getCurrentUser)", user)
        // console.log("User[0]: (getCurrentUser)",user.documents[0]);
        if (user.total <= 0) return null;

        return parseStringify(user.documents[0]);
    } catch (error) {
        console.error("Error retrieving user:", error);
        return null;
    }
}

export const signOutUser = async () => {
    const { account } = await createSessionClient();
    try {
        await account.deleteSession("current");
        (await cookies()).delete("appwrite-session");
    } catch (error) {
        handleError(error, "Failed to sign out user");
    } finally {
        redirect("/sign-in");
    }
}

export const signInUser = async ({ email }: { email: string }) => {
    try {
        const existingUser = await getUserByEmail(email);
        if(existingUser) {
            await sendEmailOTP({ email });
            return parseStringify({ accountId: existingUser.accountId })
        }
        return parseStringify({ accountId: null, error: "User is not found." })
    } catch (error) {
        handleError(error, "Failed to sign in")
    }
}