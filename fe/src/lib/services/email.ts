import config from "@/lib/config";

const {url: apiUrl} = config;

export async function sendInvites(emails: string, fileName: string, id: string) {
    return fetch(
        `${apiUrl}/emails/invite`, {
            method: 'POST',
            body: JSON.stringify({emails, fileName, id})
        }
    );
}