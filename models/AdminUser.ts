import mongoose, { Schema, type Document } from "mongoose"

export interface IAdminUser extends Document {
    email: string
    password: string
    name: string
    role: "admin"
    createdAt: Date
    updatedAt: Date
}

const AdminUserSchema = new Schema<IAdminUser>(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: "admin" },
    },
    { timestamps: true },
)

export default mongoose.models.AdminUser || mongoose.model<IAdminUser>("AdminUser", AdminUserSchema)
