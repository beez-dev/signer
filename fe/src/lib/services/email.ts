import config from "@/lib/config";

const {url: apiUrl} = config;

export async function sendInvites(ownerEmail: string, emails: string[], pathId: string, fileName: string) {
    const inviteResponse = await fetch(
        `${apiUrl}/emails/invite`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ownerEmail, emails, pathId, fileName})
        }
    );

    if (!inviteResponse.ok) {
        console.error('Invite failed.');
        return;
    }

    const recordResponse = await fetch(
        `${apiUrl}/file/records`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ownerEmail,
                invites: emails,
                pathId,
                fileName
            }),
        }
    );

    if (!recordResponse.ok) {
        console.error(`Record couldn't be added.`);
        return;
    }


}