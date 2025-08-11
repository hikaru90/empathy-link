# Historical Chat Evaluation System

This system allows you to evaluate your historical AI chat conversations for NVC conformance, safety, helpfulness, and user experience metrics directly from your Bullshift backend.

## Features

### Evaluation Metrics

1. **NVC Conformance (0-10 scores)**
   - Observation: How factual/observational the AI responses are
   - Feelings: How well feelings were addressed
   - Needs: How well needs were identified
   - Requests: How actionable the responses were
   - Overall: Overall NVC adherence score

2. **Safety Assessment**
   - Harmful suggestions detection
   - Risk level classification (low/medium/high)
   - Flagged content identification
   - Safety score (0-10)

3. **Helpfulness Metrics**
   - User satisfaction prediction
   - Response clarity
   - Actionability of advice
   - Empathy shown

4. **User Experience**
   - Frustration indicators
   - Frustration level (0-10)
   - Engagement signals
   - Completion likelihood

## Setup

### 1. Create the Database Collection

You'll need to create a `chat_evaluations` collection in PocketBase with these fields:

```json
{
  "id": "string",
  "chatId": "string",
  "userId": "string", 
  "evaluation": "json",
  "created": "date",
  "updated": "date"
}
```

## Usage

### Accessing the Evaluation Backend

1. **Via Direct URL (Admin Only):**
   - Navigate to `/bullshift/backend/evals` in your browser
   - This is an admin-only function, not available in regular user navigation

2. **Via Admin Backend:**
   - Access the main backend at `/bullshift/backend`
   - Navigate to the evaluations section

### Running Historical Evaluations

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the evaluation backend:**
   - Go to `/bullshift/backend/evals`
   - Or use the navigation menu

3. **Run evaluations:**
   - Click "Start Evaluation" to begin processing all unevaluated chats
   - Monitor progress with the real-time progress bar
   - View results and any errors that occurred

The backend will:
- Find all unevaluated chats for your user
- Process them in batches of 3 (to be respectful to the AI API)
- Evaluate each chat using Gemini AI
- Save results to the `chat_evaluations` collection
- Provide real-time progress updates and error reporting

### API Endpoint

You can also evaluate specific chats via the API:

```bash
POST /api/ai/evaluate-historical-chats
{
  "chatIds": ["chat_id_1", "chat_id_2"],
  "batchSize": 10
}
```

### Viewing Results

1. **Check PocketBase Admin:**
   - Navigate to the `chat_evaluations` collection
   - View individual evaluation results

2. **Use the Dashboard Component:**
   - Click "Show Evaluation Dashboard" in the backend interface
   - Displays metrics, trends, and recent evaluations

## Configuration

### Batch Processing

- Default batch size: 3 chats (optimized for backend processing)
- Delay between batches: 2 seconds
- Adjust these in the backend evaluation logic if needed

### AI Model Settings

- Model: `gemini-2.0-flash`
- Temperature: 0.1 (for consistent evaluations)
- Structured JSON output with validation

## Monitoring

### Key Metrics to Watch

1. **NVC Conformance Trends**
   - Are scores improving over time?
   - Which components need attention?

2. **Safety Incidents**
   - High-risk chat frequency
   - Harmful suggestion patterns

3. **User Experience**
   - Frustration level trends
   - Engagement patterns

### Alerts

Consider setting up alerts for:
- High-risk chats (risk level = "high")
- Harmful suggestions detected
- Low NVC conformance scores (< 6/10)

## Troubleshooting

### Common Issues

1. **API Rate Limits**
   - The backend automatically handles rate limiting
   - Processes chats in small batches with delays

2. **Memory Issues**
   - Backend processing is more memory-efficient
   - No need to restart scripts

3. **Evaluation Failures**
   - Check chat history format
   - Verify AI API key and quotas
   - Review error messages in the backend interface

### Debug Mode

The backend provides detailed logging:
- Progress updates in real-time
- Error details for failed evaluations
- Success confirmations for completed evaluations

## Integration

### Real-time Evaluation

To evaluate new chats as they're created:

1. Hook into your chat completion flow
2. Call the evaluation endpoint
3. Store results immediately

### Continuous Monitoring

The backend interface allows you to:
- Run evaluations on-demand
- Monitor progress in real-time
- Review results immediately
- Track evaluation coverage over time

## Best Practices

1. **Start Small**: Begin with a few chats to test the system
2. **Monitor Costs**: Track AI API usage and costs
3. **Regular Reviews**: Schedule time to review evaluation results
4. **Iterate**: Use insights to improve your AI prompts and responses
5. **Backup**: Keep evaluation results for historical analysis

## Support

If you encounter issues:

1. Check the browser console for errors
2. Verify PocketBase collection structure
3. Test with a single chat first
4. Review AI API quotas and limits

The evaluation system provides valuable insights into your AI's performance and helps ensure your NVC-based communication remains safe, helpful, and effective. Access it directly from your Bullshift backend for seamless integration with your existing workflow.
