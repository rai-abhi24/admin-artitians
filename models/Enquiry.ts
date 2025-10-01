import mongoose, { Schema, type Document } from "mongoose"

export interface IEnquiry extends Document {
    name: string
    phone: string
    sendWhatsAppUpdate: boolean
    status: "new" | "seen"
    createdAt: Date
}

const EnquirySchema = new Schema<IEnquiry>(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        status: { type: String, enum: ["new", "seen"], default: "new" },
        sendWhatsAppUpdate: { type: Boolean, default: false },
    },
    { timestamps: true },
)

export default mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema)
