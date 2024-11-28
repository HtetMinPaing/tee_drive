'use server';

import { ID, Query } from "node-appwrite";
import { createAdminClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { string } from "zod";
import { parseStringify } from "../utils";

const getUserByEmail = async (email: string) => {
    const { databases } = await createAdminClient();

    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("email", [email])],
    );

    return result.total > 0 ? result.documents[0]: null;
}

const handleError = (error: unknown, message: string) => {
    console.log(error, message);
    throw error;
}

const sendEmailOTP = async ({ email }: { email: string }) => {
    const { account } = await createAdminClient();

    try {
        const session = await account.createEmailToken(ID.unique(), email)
        return session.userId;
    } catch(error) {
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
    const existingAccount = getUserByEmail(email);

    const accountId = await sendEmailOTP({ email });

    if(!accountId) throw new Error("Failed to send an OTP");

    if(!existingAccount) {
        const { databases } = await createAdminClient();

        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                fullName,
                email,
                avatar: "https://www.google.com/imgres?q=random%20user&imgurl=https%3A%2F%2Ficons-for-free.com%2Fiff%2Fpng%2F512%2Fuser%2Bicon-1320190636314922883.png&imgrefurl=https%3A%2F%2Ficons-for-free.com%2Fuser%2Bicon-1320190636314922883%2F&docid=BQTQJ9gkG6AXpM&tbnid=lEFP7TVGJInLYM&vet=12ahUKEwj_rsT22PuJAxWLxDgGHQKnPPEQM3oECDAQAA..i&w=512&h=512&hcb=2&ved=2ahUKEwj_rsT22PuJAxWLxDgGHQKnPPEQM3oECDAQAA",
                accountId,
            }
        )
    }

    return parseStringify({ accountId })
}