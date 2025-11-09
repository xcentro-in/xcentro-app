# KYC Callback Integration Guide

## Overview

This document describes how to implement the backend callback endpoint that handles KYC verification completion and communicates with the frontend using `postMessage`.

**Backend Domain:** `api.xcentro.in`
**Frontend Domain:** (Your production frontend URL, e.g., `app.xcentro.in`)

## Flow Summary

1. **Frontend** initiates KYC by opening a popup to the KYC provider's verification URL
2. **KYC Provider** completes verification and POSTs data to your backend callback endpoint at `https://api.xcentro.in/api/kyc/callback`
3. **Backend** validates and stores the verification data
4. **Backend** responds with an HTML page that:
   - Sends a `postMessage` to the parent window (opener)
   - Attempts to auto-close the popup
   - Shows a fallback message if auto-close fails
5. **Frontend** receives the `postMessage`, verifies the origin (`https://api.xcentro.in`), and proceeds with onboarding

## Backend Implementation

### Callback Endpoint: `https://api.xcentro.in/api/kyc/callback`

**Method:** `POST`

**Request Body:** (Provided by KYC provider)
- Contains verification data from the KYC provider
- Format depends on your KYC provider's specifications

**Response:** HTML page (see template below)

**IMPORTANT:** This HTML page will be served from `api.xcentro.in` domain and must send `postMessage` to the frontend domain.

### HTML Response Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Complete</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border-radius: 1rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .success-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }
    h1 {
      font-size: 1.5rem;
      margin: 0 0 0.5rem;
    }
    p {
      margin: 0;
      opacity: 0.9;
    }
    .close-info {
      margin-top: 1.5rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 0.5rem;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="success-icon">✓</div>
    <h1>Verification Complete!</h1>
    <p>Returning to application...</p>
    <div class="close-info">
      If this window doesn't close automatically,<br>
      you may close it manually.
    </div>
  </div>

  <script>
    (function() {
      // Configuration
      const config = {
        // Frontend domain configuration
        // Set this based on your deployment environment
        frontendOrigin: window.location.hostname.includes('localhost')
          ? 'http://localhost:8080'                    // Local development
          : window.location.hostname.includes('dev')
          ? 'https://app-dev.xcentro.in'              // Development environment
          : window.location.hostname.includes('staging')
          ? 'https://app-staging.xcentro.in'          // Staging environment
          : 'https://app.xcentro.in',                 // Production (update with actual domain)

        // KYC completion data
        message: {
          type: 'KYC_COMPLETE',
          status: '{{STATUS}}', // Backend should replace with 'success' or 'failed'
          tx_id: '{{TX_ID}}'    // Backend should replace with actual transaction ID
        },

        // Auto-close delay (ms)
        closeDelay: 1500
      };

      // Send postMessage to parent/opener window
      function notifyParent() {
        try {
          // Try window.opener first (for popup windows)
          if (window.opener && !window.opener.closed) {
            console.log('Sending KYC completion message to opener:', config.message);
            window.opener.postMessage(config.message, config.frontendOrigin);
            return true;
          }

          // Fallback to parent (for iframe case)
          if (window.parent && window.parent !== window) {
            console.log('Sending KYC completion message to parent:', config.message);
            window.parent.postMessage(config.message, config.frontendOrigin);
            return true;
          }

          console.warn('No parent or opener window found');
          return false;
        } catch (error) {
          console.error('Error sending postMessage:', error);
          return false;
        }
      }

      // Auto-close window
      function closeWindow() {
        setTimeout(function() {
          try {
            // Try to close the window
            window.close();

            // If close didn't work (some browsers prevent it),
            // at least the user has the manual close message
            setTimeout(function() {
              if (!window.closed) {
                console.log('Auto-close not supported, user must close manually');
              }
            }, 500);
          } catch (error) {
            console.error('Error closing window:', error);
          }
        }, config.closeDelay);
      }

      // Execute on load
      window.addEventListener('load', function() {
        // Send message to parent
        const sent = notifyParent();

        if (sent) {
          // Only attempt auto-close if message was sent successfully
          closeWindow();
        }
      });

      // Also try immediately in case load event already fired
      if (document.readyState === 'complete') {
        notifyParent();
        closeWindow();
      }
    })();
  </script>
</body>
</html>
```

## Backend Template Variables

The backend must replace these placeholder variables with actual values:

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| `{{STATUS}}` | Verification status | `success` or `failed` |
| `{{TX_ID}}` | Transaction/session ID | `txn_abc123xyz456` |

### Example Backend Response (Node.js/Express)

```javascript
app.post('/api/kyc/callback', async (req, res) => {
  try {
    // 1. Validate and process KYC provider's POST data
    const kycData = req.body;

    // 2. Verify signature/authenticity (depends on your KYC provider)
    // ... verification logic ...

    // 3. Store verification result in database
    const txId = req.body.transaction_id || generateTxId();
    await db.kycVerifications.create({
      txId: txId,
      userId: req.body.user_id,
      status: 'verified',
      data: kycData,
      verifiedAt: new Date()
    });

    // 4. Read HTML template
    const htmlTemplate = fs.readFileSync('./templates/kyc_callback.html', 'utf-8');

    // 5. Replace placeholders
    const html = htmlTemplate
      .replace('{{STATUS}}', 'success')
      .replace('{{TX_ID}}', txId);

    // 6. Return HTML response
    res.setHeader('Content-Type', 'text/html');
    res.send(html);

  } catch (error) {
    console.error('KYC callback error:', error);

    // Return error HTML
    const htmlTemplate = fs.readFileSync('./templates/kyc_callback.html', 'utf-8');
    const html = htmlTemplate
      .replace('{{STATUS}}', 'failed')
      .replace('{{TX_ID}}', '');

    res.status(500).setHeader('Content-Type', 'text/html');
    res.send(html);
  }
});
```

### Example Backend Response (Python/Django)

```python
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.template import Template, Context

@csrf_exempt
def kyc_callback(request):
    if request.method == 'POST':
        try:
            # 1. Validate and process KYC provider's POST data
            kyc_data = request.POST

            # 2. Verify signature/authenticity
            # ... verification logic ...

            # 3. Store verification result
            tx_id = kyc_data.get('transaction_id') or generate_tx_id()
            KYCVerification.objects.create(
                tx_id=tx_id,
                user_id=kyc_data.get('user_id'),
                status='verified',
                data=kyc_data
            )

            # 4. Read and render HTML template
            with open('templates/kyc_callback.html', 'r') as f:
                html_template = f.read()

            template = Template(html_template)
            context = Context({
                'STATUS': 'success',
                'TX_ID': tx_id
            })
            html = template.render(context)

            return HttpResponse(html, content_type='text/html')

        except Exception as e:
            print(f'KYC callback error: {e}')

            # Return error HTML
            with open('templates/kyc_callback.html', 'r') as f:
                html_template = f.read()

            template = Template(html_template)
            context = Context({
                'STATUS': 'failed',
                'TX_ID': ''
            })
            html = template.render(context)

            return HttpResponse(html, status=500, content_type='text/html')
```

## Security Considerations

### 1. Origin Validation
- **Frontend:** Validates `event.origin` in the `postMessage` listener
- **Backend:** Should validate KYC provider's webhook signature

### 2. postMessage Security
- Always specify the target origin in `postMessage(message, targetOrigin)`
- Never use `'*'` as target origin in production
- Frontend validates origin before trusting the message

### 3. HTTPS Only
- Always use HTTPS in production
- Mixed content (HTTP iframe in HTTPS page) will be blocked by browsers

### 4. CSRF Protection
- Consider exempting the callback endpoint from CSRF protection if needed
- Use alternative verification (webhook signature validation)

## Message Format

### Success Message

```json
{
  "type": "KYC_COMPLETE",
  "status": "success",
  "tx_id": "txn_abc123xyz456"
}
```

### Failure Message

```json
{
  "type": "KYC_COMPLETE",
  "status": "failed",
  "tx_id": ""
}
```

## Frontend Configuration

The frontend is already configured to accept messages from these origins:

```javascript
const trustedOrigins = [
  window.location.origin,              // Same origin (for local testing)
  apiBaseUrl,                          // From VITE_API_URL env variable
  'http://localhost:8888',             // Local backend development
  'https://api.xcentro.in',            // Production backend ✓
  'https://api-staging.xcentro.in',    // Staging backend ✓
  'https://api-dev.xcentro.in',        // Development backend ✓
];
```

The configuration is in `src/pages/UserOnboarding.tsx:94-101` and supports all Xcentro backend environments.

## Testing

### Local Development

1. Backend serves HTML from `http://localhost:8888`
2. Frontend runs on `http://localhost:8080`
3. HTML template auto-detects localhost and uses `http://localhost:8080` as `frontendOrigin`
4. Open popup from frontend and verify console logs show message sent and received

### Staging Testing

1. Backend: `https://api-staging.xcentro.in/api/kyc/callback`
2. Frontend: `https://app-staging.xcentro.in` (or your staging URL)
3. HTML template auto-detects 'staging' in hostname and uses staging frontend URL
4. Test with actual KYC provider in staging environment
5. Verify popup closes and onboarding completes

### Production Testing

1. Backend: `https://api.xcentro.in/api/kyc/callback`
2. Frontend: `https://app.xcentro.in` (update with your actual production domain)
3. HTML template uses production frontend URL
4. Test end-to-end KYC flow
5. Verify popup closes and user proceeds to dashboard

## Optional: Fetch KYC Result API

If you need to fetch additional KYC details after receiving the `postMessage`, implement this endpoint:

```
GET /api/kyc/result?tx_id={tx_id}
```

**Response:**
```json
{
  "tx_id": "txn_abc123xyz456",
  "status": "verified",
  "user_id": "user_123",
  "verified_at": "2024-01-15T10:30:00Z",
  "data": {
    // Additional KYC details
  }
}
```

Uncomment line 125 in `UserOnboarding.tsx` to enable this:

```javascript
// const kycResult = await userAPI.getKYCResult(message.tx_id);
```

## Troubleshooting

### Popup doesn't close automatically
- This is normal in some browsers for security reasons
- The fallback message tells users to close manually
- Ensure `window.close()` is called from the opened window, not parent

### postMessage not received
- **Check browser console** for origin mismatch warnings
- **Verify origins match:**
  - HTML sends to: `https://app.xcentro.in` (or your frontend domain)
  - Frontend accepts from: `https://api.xcentro.in`, `https://api-staging.xcentro.in`, etc.
- **Check environment:** Make sure backend serves from expected domain (api.xcentro.in)
- **Console logs:** Look for "Sending KYC completion message" in popup and "KYC completion message received" in parent

### Mixed content errors
- Ensure both frontend and backend use HTTPS in production
- Use relative URLs or same protocol for resources
- Backend (`api.xcentro.in`) must use HTTPS to communicate with HTTPS frontend

### Origin mismatch for localhost
- Local backend should be `http://localhost:8888` (matches .env.example)
- Local frontend should be `http://localhost:8080` (default Vite port)
- HTML template auto-detects localhost and adjusts accordingly

## Environment Summary

| Environment | Backend Callback URL | Frontend URL | Status |
|-------------|---------------------|--------------|--------|
| Local | `http://localhost:8888/api/kyc/callback` | `http://localhost:8080` | ✓ Configured |
| Development | `https://api-dev.xcentro.in/api/kyc/callback` | `https://app-dev.xcentro.in` | ✓ Configured |
| Staging | `https://api-staging.xcentro.in/api/kyc/callback` | `https://app-staging.xcentro.in` | ✓ Configured |
| Production | `https://api.xcentro.in/api/kyc/callback` | `https://app.xcentro.in` | ⚠️ Update frontend domain |

**Action Required:** Update the production frontend domain in the HTML template if it differs from `app.xcentro.in`

## Support

For questions or issues with this integration, contact the frontend team or refer to:
- Frontend implementation: `src/pages/UserOnboarding.tsx:86-147`
- Frontend trusted origins: `src/pages/UserOnboarding.tsx:94-101`
- Environment variables: `.env.example`
- postMessage docs: https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
