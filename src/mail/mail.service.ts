import { Injectable } from '@nestjs/common';
import  * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_USER, //use env variable in prod
            pass: process.env.SMTP_PASS//you App Password in gmail
        },
    });
    

    // Send email to user upon new user registration
    async sendWelcomeMail(to: string, username:string, password: string) {

        //valdiate config in your app
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error('SMTP credentials are missing');
        }

        const mailOption = { 
            from : '"AV Human Resources" dummybusiness29@gmail.com',
            to,
            subject: 'Welcome to the ABAS-v3 system! Here is your Temporary password',
            html: `
                <h3>Hello ${username},</h3>
                <p>Your account has been created successfully.</p>
                <p><strong>Username:</strong> ${username} </p>
                <p><strong>Temporary Password:</strong> ${password} </p>
                <p>Please login and change your password immediately</p>
            `,
         };

         return await this.transporter.sendMail(mailOption);
    }
}
