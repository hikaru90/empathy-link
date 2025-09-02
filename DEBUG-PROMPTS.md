# Debugging Prompts Issue

## Steps to debug why prompts don't load:

### 1. Test Collection Access
Visit: `http://localhost:3001/api/test-prompts`

This will tell us:
- If the prompts collection is accessible
- How many prompts exist
- What the actual data structure looks like

### 2. Check Authentication
The prompts admin page requires authentication. Make sure you're logged in.

### 3. Check Collection Permissions
In PocketBase admin panel:
- Go to Collections → prompts
- Check the API Rules:
  - List/View rule should allow authenticated users
  - Create/Update/Delete rules should allow the users you want

### 4. Check Browser Network Tab
When visiting `/bullshift/backend/prompts`:
- Open browser dev tools → Network tab
- Check if there are any failed requests
- Look for any errors in the console

### 5. Current Collection Schema
Based on your example, your collection has these fields:
```json
{
  "id": "test",
  "slug": "test", 
  "name": "test",
  "content": "test",
  "recurring": true,
  "description": "test",
  "category": "rule",
  "active": true,
  "created": "2022-01-01 10:00:00.123Z",
  "updated": "2022-01-01 10:00:00.123Z"
}
```

Note: The code expects a `path_config` field but your collection doesn't have it. This has been handled in the code now.

### 6. Check Server Logs
Look at the server console output when visiting the prompts page. You should see:
```
🔍 Fetching prompts from database...
✅ Fetched prompts: X items
```

If you don't see this, there's an issue with the page load function.