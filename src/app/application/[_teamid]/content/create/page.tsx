"use client";
import { useEffect, useState } from 'react';
import React from 'react';

export default function TemplateManager({ params }: { params: Promise<{ _teamid: string }> }) {
    const [teamId, setTeamId] = useState<string | null>(null);
    const [templateId, setTemplateId] = useState<string | null>(null);

    useEffect(() => {
        // Resolve the params promise
        params.then(data => {
            setTeamId(data._teamid);
        }).catch(error => {
            console.error("Error fetching team ID:", error);
        });
    }, [params]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setTemplateId(urlParams.get('templateid'));
    }, []);

    return (
        <div>
            <h1>Create Content</h1>
            <p>Team ID: {teamId}</p>
            <p>Template ID: {templateId}</p>
        </div>
    );
}
