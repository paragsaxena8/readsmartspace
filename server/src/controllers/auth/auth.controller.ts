import { CookieOptions, NextFunction, Request, Response } from "express";
import { sign, verify } from "jsonwebtoken";
import { User } from "@schema/auth/auth.schema";
import { AppError } from "@utils/appError";
import catchAsync from "@utils/catchAsync";
import { transporter } from "@utils/transporter";
import { matchPassword, hashPassword, createHashFn } from "@services/users";

const signToken = (id: any) =>
  sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// Login

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Retrieve username and password from request body
    const { username, password } = req.body;
    if (!username || !password) {
      return next(new AppError("Please fill all the fields", 400));
    }

    const user = await User.findOne({ username }).select("+password");

    if (!user || matchPassword(password, hashPassword(user.password))) {
      return next(new AppError("Incorrect username or password", 401));
    } else if (user.status === "inactive") {
      return next(new AppError("Account not activated", 401));
    } else if (user.status === "banned") {
      return next(new AppError("Account banned", 401));
    }

    // Generate token
    const token = generateToken(user, res, next);

    // Remove field from response
    user.password = undefined;
    user.__v = undefined;
    user._id = undefined;

    // Example response
    res.status(200).json({ message: "Login successful", user, token });
  }
);

// Register
export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Retrieve username, email and password from request body
    const { name, username, email, password, passwordConfirm, profilePicture } =
      req.body;

    if (!name || !username || !email || !password || !passwordConfirm) {
      next(new AppError("Please provide all required fields", 400));
    }

    // Check if password is present and is at least 8 characters long
    if (password && password.length < 6) {
      next(new AppError("Password must be at least 6 characters long", 400));
    } else if (password !== passwordConfirm) {
      next(new AppError("Passwords do not match", 400));
    }

    // Check if user already exists
    const userEmail = await User.findOne({ email });
    const userName = await User.findOne({ username });
    if (userEmail) {
      next(new AppError("User already exists", 400));
    } else if (userName) {
      next(new AppError("Username already exists", 400));
    }

    // Create user
    const newUser = await User.create({
      name,
      username,
      email,
      password,
      passwordConfirm,
      profilePicture,
    });

    // Generate Activation Token
    const activationToken = newUser.createActivationToken();
    await newUser.save({ validateBeforeSave: false });

    // send email verification
    await sendEmailVerification(name, email, activationToken).catch(
      console.error
    );

    // Remove field from response
    newUser.password = undefined;
    newUser.passwordConfirm = undefined;
    newUser.activationToken = undefined;
    newUser.__v = undefined;

    res.status(201).json({
      message:
        "User registered successfully, check you email for activation of your account.",
      data: newUser,
    });
  }
);

// Logout
export const logout = catchAsync(
  async (_req: Request, res: Response, _next: NextFunction) => {
    // Clear cookie
    res.clearCookie("jwt");
    res.status(200).json({ message: "Logout successful" });
  }
);

// Protect User
export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Retrieve token and cookie from request header
    let token = null;
    const { authorization, cookie } = req.headers;

    // Check if token is present
    if (cookie) {
      token = cookie.split("=")[1];
    } else if (authorization && authorization.startsWith("Bearer")) {
      token = authorization.split(" ")[1];
    } else {
      return res
        .status(403)
        .json({ message: "You don't have permission to access this resource" });
    }
    // Verify token
    const decoded: any = verify(token, process.env.JWT_SECRET);

    // Check if user exists
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    // Check if user changed password after token was issued

    next();
  }
);

// Generate Token

const generateToken = (user: any, res: Response, next: NextFunction) => {
  try {
    const token = signToken(user._id);
    const cookieOptions: CookieOptions = {
      expires: new Date(
        Date.now() +
          parseInt(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    res.cookie("jwt", token, cookieOptions);
    return token;
  } catch (err) {
    next(new AppError("Error while creating token.", 500));
  }
};

// Send Email Verification

const sendEmailVerification = async (name: string, email: any, token: any) => {
  // Implement email verification logic here
  const template_details = {
    subject: "Account Verification",
    email: email,
    appName: process.env.APP_NAME,
    url: `${process.env.CLIENT_URL}/activate?token=${token}`,
    from: `${process.env.APP_NAME} <${process.env.EMAIL_FROM}>`,
    body: `Click the button below to verify your account`,
  };
  const email_body = `
    <!DOCTYPE html> <html lang="en"> <head> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>${template_details.subject}</title> <style media="all" type="text/css"> @media all { .btn-primary table td:hover { background-color: #ec0867 !important; } .btn-primary a:hover { background-color: #ec0867 !important; border-color: #ec0867 !important; } } @media only screen and (max-width: 640px) { .main p, .main td, .main span { font-size: 16px !important; } .wrapper { padding: 8px !important; } .content { padding: 0 !important; } .container { padding: 0 !important; padding-top: 8px !important; width: 100% !important; } .main { border-left-width: 0 !important; border-radius: 0 !important; border-right-width: 0 !important; } .btn table { max-width: 100% !important; width: 100% !important; } .btn a { font-size: 16px !important; max-width: 100% !important; width: 100% !important; } } @media all { .ExternalClass { width: 100%; } .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; } .apple-link a { color: inherit !important; font-family: inherit !important; font-size: inherit !important; font-weight: inherit !important; line-height: inherit !important; text-decoration: none !important; } #MessageViewBody a { color: inherit; text-decoration: none; font-size: inherit; font-family: inherit; font-weight: inherit; line-height: inherit; } } </style> </head> <body style="font-family: Helvetica, sans-serif; -webkit-font-smoothing: antialiased; font-size: 16px; line-height: 1.3; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; background-color: #f4f5f6; margin: 0; padding: 0;"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f4f5f6; width: 100%;" width="100%" bgcolor="#f4f5f6"> <tr> <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top"> </td> <td class="container" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; max-width: 600px; padding: 0; padding-top: 24px; width: 600px; margin: 0 auto;" width="600" valign="top"> <div class="content" style="box-sizing: border-box; display: block; margin: 0 auto; max-width: 600px; padding: 0;">  <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background: #ffffff; border: 1px solid #eaebed; border-radius: 16px; width: 100%;" width="100%">  <tr> <td class="wrapper" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; box-sizing: border-box; padding: 24px;" valign="top"> <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">Hi ${name}</p> <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;">${template_details.body}</p> <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; box-sizing: border-box; width: 100%; min-width: 100%;" width="100%"> <tbody> <tr> <td align="left" style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; padding-bottom: 16px;" valign="top"> <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;"> <tbody> <tr> <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top; border-radius: 4px; text-align: center; background-color: #0867ec;" valign="top" align="center" bgcolor="#0867ec"> <a href=${template_details.url} target="_blank" style="border: solid 2px #0867ec; border-radius: 4px; box-sizing: border-box; cursor: pointer; display: inline-block; font-size: 16px; font-weight: bold; margin: 0; padding: 12px 24px; text-decoration: none; text-transform: capitalize; background-color: #0867ec; border-color: #0867ec; color: #ffffff;">Activate</a> </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> <p style="font-family: Helvetica, sans-serif; font-size: 16px; font-weight: normal; margin: 0; margin-bottom: 16px;"> or copy and paste the link below into your browser: ${template_details.url}</p> </td> </tr>  </table> </div> </td> <td style="font-family: Helvetica, sans-serif; font-size: 16px; vertical-align: top;" valign="top"> </td> </tr> </table> </body> </html>
  `;

  await transporter.sendMail({
    from: template_details.from, // sender address
    to: template_details.email, // list of receivers
    subject: template_details.subject, // Subject line
    text: template_details.body, // plain text body
    html: email_body, // html body
  });
};

// Forgot Password
export const forgotPassword = catchAsync(
  async (req: Request, _res: Response, next: NextFunction) => {
    // Retrieve email from request body
    const { email } = req.body;

    // Check if email is present
    if (!email) {
      next(new AppError("Please provide an email address", 400));
    }

    // Check if user exists
    const user = await User.findOne({ email });

    if (!user) {
      next(new AppError("User not found", 404));
    } else {
      // TODO: Implement forgot password logic here
      // Generate reset token
      // Send email with token
      // Send response
    }
  }
);

// Acctivate Account

export const activateAccount = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.query as any;

    // Check if token is present
    if (!token) {
      next(new AppError("Invalid token", 400));
    }

    // Hash token
    const activationToken = createHashFn(token);

    // Find user with the activation token
    const user = await User.findOne({ activationToken });

    // Check if user exists
    if (!user) {
      next(new AppError("Invalid token or already activated", 400));
    }

    // Check if account is already activated
    if (user.status === "active") {
      next(new AppError("Account already activated", 400));
    }

    // Activate account
    user.status = "active";

    // Remove activation token
    user.activationToken = undefined;

    // Save user
    await user.save({ validateBeforeSave: false });

    // Send response
    res.status(200).json({ message: "Account activated successfully" });
  }
);

// Reset Password

// Activate Account

// Resend Email Verification

// Update Profile
