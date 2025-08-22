import type { PageServerLoad } from './$types';
import { pb } from '$scripts/pocketbase';
import { CONVERSATION_PATHS, type PathMarker } from '$lib/server/paths';
import { redirect } from '@sveltejs/kit';
// Helper function to analyze path transitions from chat history
function analyzePathTransitions(history: any[]) {
    const pathTransitions: Array<{
        type: 'start' | 'end' | 'switch';
        path: string;
        timestamp: number;
        previousPath?: string;
        messageIndex: number;
    }> = [];

    const pathSegments: Array<{
        path: string;
        startTime: number;
        endTime?: number;
        messageCount: number;
        startIndex: number;
        endIndex?: number;
    }> = [];

    let currentPath: string | null = null;
    let currentSegmentStart = 0;
    let currentMessageCount = 0;

    history.forEach((message, index) => {
        // Check for path markers in system messages
        if (message.role === 'system' && message.pathMarker) {
            const marker = message.pathMarker as PathMarker;
            
            pathTransitions.push({
                type: marker.type === 'path_start' ? 'start' : 
                      marker.type === 'path_end' ? 'end' : 'switch',
                path: marker.path,
                timestamp: marker.timestamp,
                previousPath: marker.previousPath,
                messageIndex: index
            });

            if (marker.type === 'path_start') {
                currentPath = marker.path;
                currentSegmentStart = Date.now();
                currentMessageCount = 0;
            } else if (marker.type === 'path_end' && currentPath) {
                pathSegments.push({
                    path: currentPath,
                    startTime: currentSegmentStart,
                    endTime: marker.timestamp,
                    messageCount: currentMessageCount,
                    startIndex: pathSegments.length > 0 ? pathSegments[pathSegments.length - 1].endIndex || 0 : 0,
                    endIndex: index
                });
            }
        } else if (message.role === 'user' || message.role === 'model') {
            currentMessageCount++;
        }
    });

    // If there's an active path without an end, add it
    if (currentPath && pathSegments.length === 0 || 
        (pathSegments.length > 0 && !pathSegments[pathSegments.length - 1].endTime)) {
        pathSegments.push({
            path: currentPath,
            startTime: currentSegmentStart,
            messageCount: currentMessageCount,
            startIndex: pathSegments.length > 0 ? pathSegments[pathSegments.length - 1].endIndex || 0 : 0
        });
    }

    return { pathTransitions, pathSegments };
}

// Helper function to get path statistics
function getPathStatistics(pathSegments: any[], traces: any[]) {
    const pathStats = new Map();

    pathSegments.forEach(segment => {
        const pathInfo = CONVERSATION_PATHS[segment.path];
        if (!pathStats.has(segment.path)) {
            pathStats.set(segment.path, {
                name: pathInfo?.name || segment.path,
                totalTime: 0,
                messageCount: 0,
                sessions: 0,
                avgSessionLength: 0
            });
        }

        const stats = pathStats.get(segment.path);
        stats.sessions++;
        stats.messageCount += segment.messageCount;
        if (segment.endTime) {
            stats.totalTime += (segment.endTime - segment.startTime);
        }
    });

    // Calculate averages
    for (const [path, stats] of pathStats) {
        if (stats.sessions > 0) {
            stats.avgSessionLength = stats.totalTime / stats.sessions;
        }
    }

    return Array.from(pathStats.entries()).map(([path, stats]) => ({
        path,
        ...stats
    }));
}

export const load: PageServerLoad = async ({ locals, params }) => {
    const user = locals.user;
    const locale = locals.locale;
    const id = params.id;

    try {
        const traces = await pb.collection('traces').getFullList({
            filter: `chat = "${id}"`,
            sort: '-created'
        });
        const record = await pb.collection('chats').getOne(id);

        // Analyze path transitions from chat history
        const { pathTransitions, pathSegments } = analyzePathTransitions(record.history || []);
        
        // Get path statistics
        const pathStats = getPathStatistics(pathSegments, traces);

        // Get available path definitions for reference
        const availablePaths = Object.values(CONVERSATION_PATHS);

        return {
            record,
            traces,
            pathAnalysis: {
                transitions: pathTransitions,
                segments: pathSegments,
                statistics: pathStats,
                currentPath: record.pathState?.activePath || null,
                pathHistory: record.pathState?.pathHistory || []
            },
            availablePaths
        };
    } catch (error) {
        console.error('Error getting chat insights:', error);
        return {
            error: 'Error getting chat insights'
        };
    }
}; 