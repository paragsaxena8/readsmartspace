import { Schema, model } from "mongoose";
import { createHashFn, generateRandomToken, hashPassword } from "@services/users";

interface UserSchema {
    name: string;
    username: string;
    email: string;
    password: string;
    passwordConfirm: string;
    role: "user" | "admin";
    profilePicture: Buffer;
    lastLogin: Date;
    status: "active" | "inactive" | "banned";
    passwordChangedAt: Date;
    passwordResetToken: string;
    passwordResetExpires: Date;
    activationToken: string;
    createActivationToken: Function;
}

const userSchema = new Schema<UserSchema>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        passwordConfirm: {
            type: String,
            required: [true, "Password confirm is required"],
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        profilePicture: {
            type: Buffer,
            default: null,
        },
        status: {
            type: String,
            enum: ["active", "inactive", "banned"],
            default: "inactive",
        },
        passwordChangedAt: Date,
        passwordResetToken: String,
        passwordResetExpires: Date,
        activationToken: String,
    }
);

userSchema.pre("save", function (next) {
    this.password = hashPassword(this.password);
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.createActivationToken = function () {
    const activationToken = generateRandomToken(8);
    this.activationToken = createHashFn(activationToken);
    return activationToken;
};

export const User = model("User", userSchema);
