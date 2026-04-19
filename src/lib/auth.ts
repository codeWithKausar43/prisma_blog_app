import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";
 

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS,
  },
});
 
  
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",  
    }),
trustedOrigins: [process.env.APP_URL!],
    user : {
        additionalFields: {
            role: {
                type: "string",
                default: "USER",        
                required: false
            }, 
            phone: {
                type: "string",
                required: false
            }, 
            status: {
                type: "string",
                default: "ACTIVE",
                required: false
            }
        }
    },
 
  emailAndPassword:{
    enabled: true,
    autoSignup: false,
    requireEmailVerification: true,
  }, 
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
  sendVerificationEmail: async ( { user, url, token }, request) => {
    const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
    const info = await transporter.sendMail({
    from: '"Prisma Blog" <prismablog@ph.com>',  
    to:  user.email, 
    subject: "Hello",  
    text: "Hello world?",  
    html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
    
    <h2 style="color: #333;">Verify Your Email</h2>
    
    <p style="font-size: 16px; color: #555;">
      Hi ${user.name || "there"},
    </p>

    <p style="font-size: 16px; color: #555;">
      Thank you for signing up for <strong>Prisma Blog</strong> 🎉  
      Please confirm your email address by clicking the button below:
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" 
         style="background-color: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-size: 16px;">
         Verify Email
      </a>
    </div>

    <p style="font-size: 14px; color: #999;">
      If you did not create an account, you can safely ignore this email.
    </p>

    <p style="font-size: 14px; color: #999;">
      This link will expire in 1 hour.
    </p>

    <hr style="margin: 20px 0;" />

    <p style="font-size: 12px; color: #aaa;">
      If the button doesn't work, copy and paste this link into your browser:
    </p>

    <p style="font-size: 12px; color: #555; word-break: break-all;">
      ${verificationUrl}
    </p>

  </div>
  `,
  });
     
    },
  },
 socialProviders: {
        google: { 
          accessType: "offline",
          prompt: "select_account consent",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },

});