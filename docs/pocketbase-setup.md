# PocketBase Setup for Chat Evaluations

## Creating the chatEvals Collection

To use the chat evaluation system, you need to create a new collection in PocketBase.

### Step 1: Access PocketBase Admin

1. Go to your PocketBase admin panel (usually `http://your-domain.com/_/`)
2. Log in with your admin credentials

### Step 2: Create New Collection

1. Click **"Collections"** in the left sidebar
2. Click **"New collection"**
3. Set the collection name to: `chatEvals`
4. Set the collection type to: `Base`
5. Click **"Create"**

### Step 3: Add Fields

Add the following fields to your collection:

| Field Name | Type | Options | Required |
|------------|------|---------|----------|
| `id` | Text | Auto ID | Yes |
| `chatId` | Text | - | Yes |
| `userId` | Text | - | Yes |
| `evaluation` | JSON | - | Yes |
| `created` | Date | Auto | Yes |
| `updated` | Date | Auto | Yes |

### Step 4: Configure Field Details

#### chatId Field
- **Type**: Text
- **Required**: ✅ Yes
- **Max length**: 255

#### userId Field  
- **Type**: Text
- **Required**: ✅ Yes
- **Max length**: 255

#### evaluation Field
- **Type**: JSON
- **Required**: ✅ Yes
- **Default value**: `{}`

### Step 5: Set Permissions

1. Go to **"API rules"** tab
2. Set the following rules:

**List records:**
```javascript
// Allow users to see only their own evaluations
@request.auth.id = userId
```

**View single record:**
```javascript
// Allow users to view only their own evaluations
@request.auth.id = userId
```

**Create records:**
```javascript
// Allow authenticated users to create evaluations
@request.auth.id != ""
```

**Update records:**
```javascript
// Allow users to update only their own evaluations
@request.auth.id = userId
```

**Delete records:**
```javascript
// Allow users to delete only their own evaluations
@request.auth.id = userId
```

### Step 6: Save and Test

1. Click **"Save"** to create the collection
2. Test by creating a sample record
3. Verify the API endpoints work

## Verification

After creating the collection, you should be able to:

1. Access `/bullshift/backend/evals` without errors
2. See the evaluation interface load properly
3. Run evaluations on your historical chats

## Troubleshooting

### Collection Not Found Error
- Verify the collection name is exactly `chatEvals`
- Check that the collection is published (not in draft mode)
- Ensure you have proper permissions

### Permission Denied Errors
- Verify the API rules are set correctly
- Check that users are authenticated
- Ensure the `userId` field matches the authenticated user's ID

### Field Type Errors
- Make sure the `evaluation` field is set to JSON type
- Verify all required fields are marked as required
- Check field names match exactly (case-sensitive)

## Next Steps

Once the collection is set up:

1. Navigate to `/bullshift/backend/evals`
2. The system will automatically detect the collection
3. You can start evaluating your historical chats
4. View results in the evaluation dashboard

The evaluation system will now work seamlessly with your existing Bullshift setup!
