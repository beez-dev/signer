'use client';

import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {uploadFile} from "@/lib/services/file";
import React, {useCallback, useRef, useState} from "react";
import {Button} from "@/components/ui/button";
import {Spinner} from "@/components/ui/spinner";
import {cn} from "@/lib/utils/css";
import {sendInvites} from "@/lib/services/email";

type FileInputProps = {
    ownerEmail: string;
}

export function FileInput({ownerEmail}: FileInputProps) {
    const [uploadState, setUploadState] = useState(false);
    const [uploadedId, setUploadedId] = useState<string>();
    const [file, setFile] = useState<File>();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isSendingInvite, setIsSendingInvite] = useState(false);


    const uploadFileCallback = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        // Simple implementation to indicate uploading state
        setUploadState(true);
        const id = await uploadFile(e, ownerEmail);
        setUploadedId(id);
        setFile(e?.target?.files?.[0] as File);
        setUploadState(false)
    }, [])

    const sendEmailInvites = useCallback(async () => {

        const values = inputRef?.current?.value ?? '';
        const allEmails = values.split(',').filter(e => e).map(e => e.trim());

        if (!file || !uploadedId || allEmails.length === 0) {
            return;
        }

        if (allEmails.length > 5) {
            alert('Cannot invite more than 5 people.');
            return;
        }

        // NOTE: Could use something like tanstack
        setIsSendingInvite(true)
        await sendInvites(ownerEmail, allEmails, uploadedId, file.name)
        setIsSendingInvite(false);
    }, [uploadedId, file, ownerEmail])

    if (!ownerEmail) {
        return null;
    }

    return (
        <div
            className="h-[500px] w-[1200px] border-2 border-dotted border-gray-400 hover:border-gray-600 rounded-lg text-center flex items-center justify-center relative">
            <div className="absolute left-5 top-5 text-sm text-gray-400">Owner: {ownerEmail}</div>
            <div className="grid w-full max-w-sm items-center">
                <Label htmlFor="file-upload" className="text-xl"></Label>

                <Input id="file-upload" type="file"
                       className={cn("cursor-pointer")}
                       placeholder={"select files"}
                       multiple={false} onChange={uploadFileCallback}
                />

                <div className="text-gray-600">
                    {uploadState ?
                        <div className="w-full p-4">
                            <div className="flex flex-row items-center justify-center gap-x-4">
                                <div>Uploading documents...</div>
                                <Spinner size="sm"
                                         className="bg-black dark:bg-white"/></div>
                        </div> : ''}
                </div>

                {uploadedId &&
                    <div className="flex flex-col mt-8 gap-y-2">
                        <Input ref={inputRef} id="send-invite" type="text"
                               placeholder="Enter valid email addresses; separate using commas(,)"/>
                        <Button className="w-full cursor-pointer"
                                onClick={sendEmailInvites}>{isSendingInvite ? 'Sending...' : 'Send invites'}</Button>
                    </div>}
            </div>
        </div>

    )
}
