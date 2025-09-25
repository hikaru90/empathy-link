#!/usr/bin/env node

import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function checkTracePatterns() {
    try {
        await pb.admins.authWithPassword('admin@localhost', 'password123');

        // Get traces from the last week to see patterns
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const dateFilter = oneWeekAgo.toISOString().split('T')[0] + ' 00:00:00';

        console.log('🔍 Checking trace patterns from last week...');
        console.log('Date filter:', dateFilter, '\n');

        const traces = await pb.collection('traces').getList(1, 1000, {
            filter: `created >= "${dateFilter}"`,
            fields: 'user,functionName,module,created,inputTokens,outputTokens',
            sort: '-created'
        });

        console.log(`Found ${traces.items.length} traces in the last week\n`);

        // Group by user
        const userGroups = traces.items.reduce((acc, trace) => {
            if (!acc[trace.user]) {
                acc[trace.user] = [];
            }
            acc[trace.user].push(trace);
            return acc;
        }, {});

        // Get user info
        const users = await pb.collection('users').getList(1, 100, {
            fields: 'id,email,firstName,lastName,role'
        });

        const userMap = users.items.reduce((acc, user) => {
            acc[user.id] = user;
            return acc;
        }, {});

        // Sort users by trace count (descending)
        const sortedUsers = Object.entries(userGroups).sort((a, b) => b[1].length - a[1].length);

        for (const [userId, userTraces] of sortedUsers) {
            const user = userMap[userId];
            const userName = user ? `${user.firstName} ${user.lastName} (${user.email})` : 'Unknown User';
            const userRole = user?.role || 'unknown';

            console.log(`👤 ${userName} [${userRole}]`);
            console.log(`   Traces this week: ${userTraces.length}`);

            // Module breakdown
            const moduleStats = userTraces.reduce((acc, trace) => {
                const module = trace.module || 'unknown';
                if (!acc[module]) acc[module] = 0;
                acc[module]++;
                return acc;
            }, {});

            console.log('   Modules:', Object.entries(moduleStats)
                .sort((a, b) => b[1] - a[1])
                .map(([module, count]) => `${module}: ${count}`)
                .join(', '));

            // Function breakdown for top functions
            const functionStats = userTraces.reduce((acc, trace) => {
                const fn = trace.functionName || 'unknown';
                if (!acc[fn]) acc[fn] = 0;
                acc[fn]++;
                return acc;
            }, {});

            const topFunctions = Object.entries(functionStats)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3)
                .map(([fn, count]) => `${fn}: ${count}`)
                .join(', ');

            console.log('   Top functions:', topFunctions);

            // Check for path-testing specifically
            const pathTestingTraces = userTraces.filter(t => t.module === 'path-testing');
            if (pathTestingTraces.length > 0) {
                console.log(`   ⚠️  Path-testing traces: ${pathTestingTraces.length} (${Math.round(pathTestingTraces.length / userTraces.length * 100)}%)`);

                // Show path-testing function breakdown
                const pathFunctions = pathTestingTraces.reduce((acc, trace) => {
                    const fn = trace.functionName || 'unknown';
                    if (!acc[fn]) acc[fn] = 0;
                    acc[fn]++;
                    return acc;
                }, {});

                console.log('   Path-testing functions:', Object.entries(pathFunctions)
                    .map(([fn, count]) => `${fn}: ${count}`)
                    .join(', '));
            }

            // Token usage
            const totalTokens = userTraces.reduce((sum, trace) =>
                sum + (trace.inputTokens || 0) + (trace.outputTokens || 0), 0);
            console.log(`   Total tokens this week: ${totalTokens.toLocaleString()}`);

            console.log('');
        }

        // Summary statistics
        console.log('📊 SUMMARY:');
        const totalUsers = Object.keys(userGroups).length;
        const avgTracesPerUser = traces.items.length / totalUsers;
        const totalPathTestingTraces = traces.items.filter(t => t.module === 'path-testing').length;

        console.log(`Total users with traces: ${totalUsers}`);
        console.log(`Average traces per user: ${avgTracesPerUser.toFixed(1)}`);
        console.log(`Path-testing traces: ${totalPathTestingTraces} (${Math.round(totalPathTestingTraces / traces.items.length * 100)}% of all traces)`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        pb.authStore.clear();
    }
}

checkTracePatterns();