// app/commands/test_email.ts
import EmailService from '#services/email_services';
import { BaseCommand } from '@adonisjs/core/ace';
export default class TestEmail extends BaseCommand {
    static commandName = 'test:email';
    static description = 'Test email service';
    async run() {
        const emailService = new EmailService();
        // Test connection
        this.logger.info('Testing SMTP connection...');
        const isConnected = await emailService.verifyConnection();
        if (!isConnected) {
            this.logger.error('❌ SMTP connection failed');
            this.logger.info('Please check your SMTP credentials in .env file');
            return;
        }
        this.logger.success('✅ SMTP connection successful');
        // Test email sending
        this.logger.info('Sending test email...');
        try {
            const testEmail = 'test@example.com';
            await emailService.sendOtpEmail(testEmail, '123456', 'email_verification');
            this.logger.success(`✅ Test email sent successfully to ${testEmail}`);
            this.logger.info('Check your email inbox (and spam folder)');
        }
        catch (error) {
            this.logger.error('❌ Test email failed:', error.message);
            this.logger.info('In development, OTP should be logged to console');
        }
    }
}
//# sourceMappingURL=test_email.js.map