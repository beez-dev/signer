import config from "@/lib/config";

const {url: apiUrl} = config;

export async function sendInvites(ownerEmail: string, emails: string[], pathId: string, fileName: string) {
    return fetch(
        `${apiUrl}/emails/invite`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ownerEmail, emails, pathId, fileName})
        }
    );
}