# Messaging System Setup Guide

This document explains how to set up the messaging system for Empathy Link, including public service announcements and automated reminders.

## Database Collections

### 1. Messages Collection

Create a new collection named `messages` with the following fields:

```json
{
  "name": "messages",
  "type": "base",
  "schema": [
    {
      "name": "userId",
      "type": "text",
      "required": false,
      "options": {
        "max": 15
      }
    },
    {
      "name": "fromUserId", 
      "type": "text",
      "required": false,
      "options": {
        "max": 15
      }
    },
    {
      "name": "type",
      "type": "select",
      "required": true,
      "options": {
        "maxSelect": 1,
        "values": [
          "system",
          "public_announcement", 
          "user",
          "reminder"
        ]
      }
    },
    {
      "name": "title",
      "type": "text",
      "required": true,
      "options": {
        "max": 255
      }
    },
    {
      "name": "content",
      "type": "editor",
      "required": true
    },
    {
      "name": "read",
      "type": "bool",
      "required": true
    },
    {
      "name": "scheduledFor",
      "type": "date",
      "required": false
    },
    {
      "name": "sentAt",
      "type": "date",
      "required": false
    },
    {
      "name": "priority",
      "type": "number",
      "required": true,
      "options": {
        "min": 1,
        "max": 3
      }
    },
    {
      "name": "reminderData",
      "type": "json",
      "required": false
    }
  ]
}
```

### 2. Reminders Collection

Create a new collection named `reminders` with the following fields:

```json
{
  "name": "reminders",
  "type": "base", 
  "schema": [
    {
      "name": "userId",
      "type": "relation",
      "required": true,
      "options": {
        "collectionId": "users",
        "cascadeDelete": true,
        "minSelect": 1,
        "maxSelect": 1
      }
    },
    {
      "name": "title",
      "type": "text",
      "required": true,
      "options": {
        "max": 255
      }
    },
    {
      "name": "message",
      "type": "editor",
      "required": true
    },
    {
      "name": "scheduledFor",
      "type": "date",
      "required": true
    },
    {
      "name": "recurring",
      "type": "select",
      "required": false,
      "options": {
        "maxSelect": 1,
        "values": [
          "daily",
          "weekly",
          "monthly"
        ]
      }
    },
    {
      "name": "recurringData",
      "type": "json",
      "required": false
    },
    {
      "name": "active",
      "type": "bool",
      "required": true
    },
    {
      "name": "lastSent",
      "type": "date",
      "required": false
    }
  ]
}
```

## API Rules

### Messages Collection Rules

**List/Search Rule:**
```javascript
// Users can see their own messages and public announcements
@request.auth.id != "" && (userId = @request.auth.id || type = "public_announcement")
```

**View Rule:**
```javascript
// Users can view their own messages and public announcements
@request.auth.id != "" && (userId = @request.auth.id || type = "public_announcement")
```

**Create Rule:**
```javascript
// Only authenticated users can create messages
@request.auth.id != ""
```

**Update Rule:**
```javascript
// Users can only update their own messages (mainly read status)
@request.auth.id != "" && userId = @request.auth.id
```

**Delete Rule:**
```javascript
// Users can only delete their own messages (not public announcements)
@request.auth.id != "" && userId = @request.auth.id && type != "public_announcement"
```

### Reminders Collection Rules

**List/Search Rule:**
```javascript
// Users can only see their own reminders
@request.auth.id != "" && userId = @request.auth.id
```

**View Rule:**
```javascript
// Users can only view their own reminders
@request.auth.id != "" && userId = @request.auth.id
```

**Create Rule:**
```javascript
// Only authenticated users can create reminders
@request.auth.id != "" && userId = @request.auth.id
```

**Update Rule:**
```javascript
// Users can only update their own reminders
@request.auth.id != "" && userId = @request.auth.id
```

**Delete Rule:**
```javascript
// Users can only delete their own reminders  
@request.auth.id != "" && userId = @request.auth.id
```

## Scheduled Message Processing

### Setting up the Cron Job

To process scheduled messages and reminders, set up a cron job to call the processing endpoint:

```bash
# Run every 5 minutes
*/5 * * * * curl -X POST https://your-domain.com/api/messages/process-scheduled \
  -H "Content-Type: application/json" \
  -d '{"authKey": "your-scheduled-task-auth-key"}'
```

### Security Configuration

1. **Update the auth key** in `/src/routes/api/messages/process-scheduled/+server.ts`:
   ```typescript
   if (authKey !== 'your-secure-scheduled-task-auth-key') {
   ```

2. **Set up environment variables** for the auth key instead of hardcoding it.

## Features

### 1. Public Service Announcements
- Admins can create announcements visible to all users
- Support for scheduling announcements for future delivery
- Priority levels (Normal, High, Urgent)
- Announcements appear in all user inboxes

### 2. Personal Reminders
- Users can create personal reminders
- Support for one-time and recurring reminders (daily, weekly, monthly)
- Configurable intervals (e.g., every 2 days, every 3 weeks)
- Optional end dates for recurring reminders
- Automatic conversion to inbox messages when due

### 3. Message Management
- Unified inbox for all message types
- Read/unread status tracking
- Message filtering by type
- Real-time unread count in header
- Mobile-responsive drawer interface

### 4. Admin Interface
- Dedicated admin panel for managing announcements
- Statistics and overview of all messages
- Scheduling interface for future announcements
- Draft management for unsent announcements

## Usage Examples

### Creating a Public Announcement (Admin)
1. Navigate to `/bullshift/admin/messages`
2. Click "Neue Ankündigung"
3. Fill in title, content, and priority
4. Optionally schedule for future delivery
5. Click "Sofort senden" or "Planen"

### Creating a Personal Reminder
1. Click user menu in header
2. Select "Meine Erinnerungen"
3. Click "Neue Erinnerung"
4. Set title, message, date/time
5. Configure recurring options if needed
6. Click "Erstellen"

### Viewing Messages
1. Click bell icon in header
2. Browse messages in unified inbox
3. Click message to view details and mark as read
4. Use filters to show specific message types

## Recurring Reminder Configuration

### Recurring Data Format
```json
{
  "interval": 1,           // How often to repeat
  "endDate": "2024-12-31", // Optional end date
  "daysOfWeek": [1, 3, 5], // Optional: specific days (0=Sunday, 6=Saturday)
  "dayOfMonth": 15         // Optional: specific day of month
}
```

### Examples
- **Daily reminder every 2 days:**
  ```json
  {
    "recurring": "daily",
    "recurringData": {"interval": 2}
  }
  ```

- **Weekly reminder on specific days:**
  ```json
  {
    "recurring": "weekly", 
    "recurringData": {"interval": 1, "daysOfWeek": [1, 3, 5]}
  }
  ```

- **Monthly reminder with end date:**
  ```json
  {
    "recurring": "monthly",
    "recurringData": {"interval": 1, "endDate": "2024-12-31"}
  }
  ```

## Troubleshooting

### Messages not appearing
- Check PocketBase collection rules are configured correctly
- Verify user authentication is working
- Check browser console for API errors

### Scheduled messages not processing
- Ensure cron job is running
- Verify auth key matches in processing endpoint
- Check server logs for processing errors

### Recurring reminders not working
- Verify recurring data JSON format
- Check date calculations in processing logic
- Ensure reminders collection has proper schema

## Future Enhancements

1. **Push Notifications**: Integrate with browser notification API
2. **Email Notifications**: Send email copies of important messages
3. **Message Templates**: Pre-defined message templates for common announcements
4. **User Preferences**: Allow users to configure notification preferences
5. **Message Archiving**: Archive old messages to keep inbox clean
6. **Rich Media**: Support for images and attachments in messages