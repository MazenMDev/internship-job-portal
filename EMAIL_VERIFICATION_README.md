# Email Verification Feature

## Overview

Added secure email verification to the registration system. Users must verify their email address before they can log in.

## What Was Implemented

### 1. Database Changes

- Added 3 new columns to the `users` table:
  - `email_verified` (BOOLEAN): Tracks if user verified their email
  - `verification_token` (VARCHAR(64)): Unique token sent in verification email
  - `token_expiry` (DATETIME): Token expiration timestamp (24 hours)

### 2. Modified Files

- **`sql/users.sql`**: Updated schema with new verification columns
- **`php/register.php`**:
  - Generates secure 64-character token using `random_bytes()`
  - Sets 24-hour expiry for verification link
  - Sends verification email with link
  - New users start with `email_verified = 0`
- **`php/login.php`**:
  - Checks `email_verified` status before allowing login
  - Returns error message if email not verified
- **`php/verify_email.php`** (NEW):
  - Validates verification token from URL
  - Checks token expiry
  - Marks user as verified
  - Beautiful HTML responses for all scenarios

### 3. Migration File

- **`sql/migrations/add_email_verification.sql`**: ALTER TABLE query to add columns to existing database

## Setup Instructions

### Step 1: Update Database

Run the migration SQL on your database:

```sql
ALTER TABLE users
ADD COLUMN email_verified BOOLEAN DEFAULT FALSE AFTER cv,
ADD COLUMN verification_token VARCHAR(64) DEFAULT NULL AFTER email_verified,
ADD COLUMN token_expiry DATETIME DEFAULT NULL AFTER verification_token;

CREATE INDEX idx_verification_token ON users(verification_token);
```

Or import: `sql/migrations/add_email_verification.sql`

### Step 2: Configure Mail Server

The `mail()` function in PHP requires a mail server. For **local development**, you have options:

#### Option A: Use a Test Email Service (Recommended for Dev)

Replace the `mail()` call in `register.php` with a service like:

- **Mailtrap** (free tier): Catches emails without sending them
- **SendGrid** / **Mailgun**: Free tiers available

#### Option B: Configure Local SMTP

Windows users can use:

1. **XAMPP Mercury Mail** (comes with XAMPP)
2. **Papercut SMTP** (free dev tool)
3. **MailHog** (Docker-based)

Update `php.ini`:

```ini
[mail function]
SMTP = localhost
smtp_port = 25
sendmail_from = noreply@jobconnect.com
```

#### Option C: For Production

Use a proper mail service and update `register.php` to use PHPMailer or similar library.

### Step 3: Update Verification Link URL

In `register.php` line 39, change the base URL to match your environment:

```php
$verificationLink = "http://your-domain.com/php/verify_email.php?token=" . $verificationToken;
```

## User Flow

1. **Register**: User submits registration form
2. **Email Sent**: System generates token, saves to DB, sends email with verification link
3. **Verify**: User clicks link in email → `verify_email.php` validates token
4. **Login**: User can now log in (login blocked until verified)

## Security Features

✅ **Cryptographically secure tokens** (64 random bytes)  
✅ **Token expiration** (24 hours)  
✅ **One-time use** (token cleared after verification)  
✅ **SQL injection protection** (prepared statements)  
✅ **Already-verified check** (prevents re-verification)

## Testing Checklist

- [ ] Run migration SQL on database
- [ ] Register new user → check email sent
- [ ] Click verification link → see success page
- [ ] Try logging in → should work
- [ ] Register another user → try logging in without verifying → should fail
- [ ] Wait 24+ hours → try old verification link → should show expired
- [ ] Click verification link twice → second time shows "already verified"

## API Responses

### Registration Success

```json
{
  "status": "success",
  "message": "Registration successful! Please check your email to verify your account."
}
```

### Login Before Verification

```json
{
  "status": "error",
  "message": "Please verify your email before logging in. Check your inbox for the verification link."
}
```

## File Structure

```
php/
├── register.php          (modified - generates token & sends email)
├── login.php            (modified - checks email_verified)
├── verify_email.php     (NEW - handles verification)
└── db_connection.php    (unchanged)

sql/
├── users.sql            (modified - added verification columns)
└── migrations/
    └── add_email_verification.sql  (NEW - migration for existing DBs)
```

## Future Enhancements

- Add "Resend verification email" feature
- Add email verification bypass for admin users
- Implement email change with re-verification
- Add notification for successful verification

---

**Created**: November 18, 2025  
**Status**: ✅ Complete and ready to deploy
