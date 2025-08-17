'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getAllRecords, uploadFile } from '@/lib/services/file';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils/css';
import { sendInvites } from '@/lib/services/email';
import {
    Upload,
    FileText,
    Mail,
    Users,
    CheckCircle,
    Clock,
    Search,
} from 'lucide-react';

type FileInputProps = {
    ownerEmail: string;
};

export function FileInput({ ownerEmail }: FileInputProps) {
    const [uploadState, setUploadState] = useState(false);
    const [uploadedId, setUploadedId] = useState<string>();
    const [file, setFile] = useState<File>();
    const inputRef = useRef<HTMLInputElement>(null);
    const [isSendingInvite, setIsSendingInvite] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [allRecords, setAllRecords] = useState<
        { fileName: string; status: Record<string, string> }[]
    >([]);

    useEffect(() => {
        getAllRecords(ownerEmail).then((data) => {
            setAllRecords(data);
        });
    }, [ownerEmail]);

    const uploadFileCallback = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            // Simple implementation to indicate uploading state
            setUploadState(true);
            const id = await uploadFile(e);
            setUploadedId(id);
            setFile(e?.target?.files?.[0] as File);
            setUploadState(false);
        },
        [],
    );

    const sendEmailInvites = useCallback(async () => {
        const values = inputRef?.current?.value ?? '';
        const allEmails = values
            .split(',')
            .filter((e) => e)
            .map((e) => e.trim());

        if (!file || !uploadedId || allEmails.length === 0) {
            return;
        }

        if (allEmails.length > 5) {
            alert('Cannot invite more than 5 people.');
            return;
        }

        // NOTE: Could use something like tanstack
        setIsSendingInvite(true);
        await sendInvites(ownerEmail, allEmails, uploadedId, file.name);
        getAllRecords(ownerEmail).then((data) => {
            setAllRecords(data);
        });
        setIsSendingInvite(false);
    }, [uploadedId, file, ownerEmail]);

    if (!ownerEmail) {
        return null;
    }

    return (
        <div className="space-y-6">
            {/* Modern File Upload Area */}
            <div className="relative">
                <div className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center hover:border-white/40 transition-all duration-200 bg-white/5 backdrop-blur-sm">
                    <div className="absolute left-6 top-6 flex items-center space-x-2 text-sm text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                        <Users className="h-4 w-4" />
                        <span>Owner: {ownerEmail}</span>
                    </div>

                    <div className="space-y-6">
                        <div className="mx-auto h-20 w-20 bg-blue-500/20 rounded-full flex items-center justify-center">
                            <Upload className="h-10 w-10 text-blue-400" />
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-white mb-2">
                                Upload your document
                            </h3>

                            <div className="relative">
                                <Input
                                    id="file-upload"
                                    type="file"
                                    className={cn(
                                        'cursor-pointer w-full max-w-md mx-auto bg-blue-600 hover:bg-blue-700 border-blue-500 text-white focus:border-blue-400 focus:ring-blue-400 transition-all duration-200 font-medium h-14 text-lg',
                                        'file:bg-transparent file:border-0 file:text-transparent file:placeholder-transparent',
                                        'placeholder:text-transparent',
                                        'text-transparent',
                                    )}
                                    multiple={false}
                                    onChange={uploadFileCallback}
                                />
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="flex items-center space-x-3">
                                        <Upload className="h-6 w-6 text-white" />
                                        <span className="text-white font-semibold text-lg">
                                            Browse Files
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {uploadState && (
                            <div className="flex items-center justify-center space-x-3 text-blue-400">
                                <Spinner size="sm" className="bg-blue-400" />
                                <span>Uploading document...</span>
                            </div>
                        )}

                        {uploadedId && (
                            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 max-w-md mx-auto">
                                <div className="flex items-center space-x-3 mb-4">
                                    <CheckCircle className="h-6 w-6 text-green-400" />
                                    <span className="text-green-400 font-medium">
                                        File uploaded successfully!
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <Label
                                            htmlFor="send-invite"
                                            className="text-sm font-medium text-gray-300 block mb-2"
                                        >
                                            Invite people to sign
                                        </Label>
                                        <Input
                                            ref={inputRef}
                                            id="send-invite"
                                            type="text"
                                            className="bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="Enter email addresses separated by commas"
                                        />
                                    </div>

                                    <Button
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                        onClick={sendEmailInvites}
                                    >
                                        {isSendingInvite ? (
                                            <div className="flex items-center space-x-2">
                                                <Spinner
                                                    size="sm"
                                                    className="bg-white"
                                                />
                                                <span>Sending invites...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <Mail className="h-4 w-4" />
                                                <span>Send invites</span>
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Document Records */}
            {allRecords.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-white mb-4">
                        Your Documents
                    </h3>

                    {/* Search Bar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search documents by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    {/* Filtered Records */}
                    {(() => {
                        const filteredRecords = allRecords.filter((record) =>
                            record.fileName
                                .toLowerCase()
                                .includes(searchTerm.toLowerCase()),
                        );

                        if (filteredRecords.length === 0) {
                            return (
                                <div className="text-center py-8">
                                    <FileText className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                                    <p className="text-gray-400 text-lg">
                                        {searchTerm
                                            ? 'No documents found matching your search.'
                                            : 'No documents uploaded yet.'}
                                    </p>
                                </div>
                            );
                        }

                        return filteredRecords.map((eachRecord, idx) => {
                            const acceptedCount = Object.values(
                                eachRecord.status,
                            ).filter((e) => e === 'accepted').length;
                            const totalCount = Object.values(
                                eachRecord.status,
                            ).length;
                            const isCompleted = acceptedCount === totalCount;

                            return (
                                <div
                                    key={idx}
                                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div
                                                className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                                                    isCompleted
                                                        ? 'bg-green-500/20'
                                                        : 'bg-blue-500/20'
                                                }`}
                                            >
                                                <FileText
                                                    className={`h-6 w-6 ${
                                                        isCompleted
                                                            ? 'text-green-400'
                                                            : 'text-blue-400'
                                                    }`}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-medium text-lg">
                                                    {eachRecord.fileName}
                                                </h4>
                                                <p className="text-gray-400">
                                                    {acceptedCount} out of{' '}
                                                    {totalCount} people have
                                                    accepted invitation
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                    isCompleted
                                                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                        : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                                }`}
                                            >
                                                {isCompleted ? (
                                                    <>
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Completed
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock className="h-3 w-3 mr-1" />
                                                        Pending
                                                    </>
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        });
                    })()}
                </div>
            )}
        </div>
    );
}
