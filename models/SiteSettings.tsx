import mongoose, { Schema, Document } from "mongoose";

export interface ISiteSettings extends Document {
    email: string;
    phoneNumber: string;
    whatsappNumber: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    maintenance: boolean;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
    {
        email: String,
        phoneNumber: String,
        whatsappNumber: String,
        facebook: String,
        instagram: String,
        twitter: String,
        youtube: String,
        maintenance: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.models.SiteSettings ||
    mongoose.model<ISiteSettings>("SiteSettings", SiteSettingsSchema);