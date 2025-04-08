import config from '../config';

const {url: apiUrl} = config;

export async function uploadFile(e: React.ChangeEvent<HTMLInputElement>, ownerEmail: string) {
    try {
        const input = e.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) {
            console.error('No file selected.');
            return;
        }

        const selectedFile = input.files[0];

        if (selectedFile.size > 20 * 1024 * 1024) {
            console.error('File size exceeds the 20MB limit.');
            return;
        }

        const response = await fetch(
            `${apiUrl}/file/uploads?fileName=${encodeURIComponent(selectedFile.name)}`,
        );

        if (!response.ok) {
            console.error('Failed to fetch presigned URL.');
            return;
        }

        const data = await response.json();

        if (!data.url) {
            console.error('Presigned URL is missing in response.');
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile, selectedFile.name);

        const uploadResponse = await fetch(data.url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'multipart/form-data',
            },

            body: formData,
        });

        if (!uploadResponse.ok) {
            console.error('File upload failed.');
            return;
        }


        console.log('File uploaded successfully.');

        return data.pathId
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

export async function acceptInvite(pathId: string, token: string) {
    const response = await fetch(
        `${apiUrl}/file/accept?pathId=${pathId}&token=${token}`,
    );

    if (!response.ok) {
        console.error('File upload failed.');
        throw Error('File upload failed.');
    }
}

export async function getAllRecords(ownerEmail: string) {
    const response = await fetch(
        `${apiUrl}/file/records?ownerEmail=${ownerEmail}`,
    );

    if (!response.ok) {
        console.error('File upload failed.');
        throw Error('File upload failed.');
    }

    return response.json();
}