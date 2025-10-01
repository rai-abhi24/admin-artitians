import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
            match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
        },
        password: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            unique: true,
            sparse: true
        },
        role: {
            type: String,
            enum: ["employee", "admin"],
            default: "employee"
        },
        businessType: [{
            type: Schema.Types.ObjectId,
            ref: "BusinessType"
        }],
        status: {
            type: String,
            enum: ["active", "inactive", "suspended"],
            default: "active"
        },
        lastLogin: { type: Date },

    },
    { timestamps: true }
);

export type UserDocument = mongoose.InferSchemaType<typeof UserSchema>;
export const User = models.User || model<UserDocument>("User", UserSchema);