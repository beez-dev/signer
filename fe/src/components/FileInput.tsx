'use client';

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {uploadFile} from "@/lib/services/file";
import React, {useCallback, useState} from "react";
import {Button} from "@/components/ui/button";

type FileInputProps = {
    ownerEmail: string;
}

export function FileInput({ownerEmail}: FileInputProps) {
    const [uploadState, setUploadState] = useState(false);
    const [uploadedId, setUploadedId] = useState<number>();


    const uploadFileCallback = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        // Simple implementation to indicate uploading state
        setUploadState(true);
        const id = await uploadFile(e);
        setUploadedId(id);
        setUploadState(false)
    }, [])

    if (!ownerEmail) {
        return null;
    }

    return (
        <div
            className="h-[500px] w-[1200px] border-2 border-dotted border-gray-400 hover:border-gray-600 rounded-lg text-center flex items-center justify-center relative">
            <div className="absolute left-5 top-5 text-sm text-gray-400">Owner: {ownerEmail}</div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="file-upload" className="text-xl"></Label>

                <Input id="file-upload" type="file"
                       placeholder={"select files"}
                       multiple={false} onChange={uploadFileCallback}/>

                <div className="text-gray-600">
                    {uploadState ? 'Uploading...' : ''}
                </div>
                {uploadedId &&
                    <div>
                        <Input id="send-invite" type="text"/>
                        <Button onClick={() => {
                        }}>Send invites</Button>
                    </div>}
            </div>
        </div>

    )
}
