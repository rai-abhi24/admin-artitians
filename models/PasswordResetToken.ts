import mongoose, { Schema, model, models } from "mongoose";

const PasswordResetTokenSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        // Store only a hashed token (never raw)
        tokenHash: {
            type: String,
            required: true,
            index: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            index: true,
        },
        status: {
            type: String,
            enum: ["unused", "used"],
            default: "unused",
            index: true,
        },
        // Optional for security/monitoring
        ip: { type: String },
        userAgent: { type: String },
    },
    { timestamps: true }
);

export type PasswordResetTokenDocument = mongoose.InferSchemaType<typeof PasswordResetTokenSchema>;
export const PasswordResetToken =
    models.PasswordResetToken || model<PasswordResetTokenDocument>("PasswordResetToken", PasswordResetTokenSchema);


