import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPartner {
  _id: Types.ObjectId;
  title: string;
  logoUrl: string;
  isActive: boolean;
  order: number;
}

export interface ITestimonial {
  _id: Types.ObjectId;
  text: string;
  name: string;
  role: string;
  image?: string;
  isActive: boolean;
  order: number;
}

export interface IModule {
  _id: Types.ObjectId;
  heading: string;
  description: string;
  image?: string;
  type?: string;
  isActive: boolean;
  order: number;
}

export interface ISection extends Document {
  type: "hero" | "testimonial" | "partner" | "before-after" | "module";

  // HERO fields
  highlightedText?: string;
  normalText?: string;
  subtitle?: string;
  backgroundImage?: string;
  content?: {
    galleryImages?: string[];
  };

  // PARTNER container (single doc holds array)
  partners?: IPartner[];

  // TESTIMONIAL container (single doc holds array)
  testimonials?: ITestimonial[];

  // MODULE container (single doc holds array)
  modules?: IModule[];

  // Generic fields
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  icon?: string;
  link?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// ✅ Partner Schema (unchanged)
const PartnerItemSchema = new Schema<IPartner>(
  {
    title: { type: String, required: true },
    logoUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

// ✅ New: Testimonial Schema
const TestimonialItemSchema = new Schema<ITestimonial>(
  {
    text: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
    image: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

// ✅ New: Module Schema
const ModuleItemSchema = new Schema<IModule>(
  {
    heading: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, default: "" },
    type: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

// ✅ Main Section Schema
const SectionSchema = new Schema<ISection>(
  {
    type: { type: String, required: true, enum: ["hero", "testimonial", "partner", "before-after", "module"] },

    // HERO
    highlightedText: String,
    normalText: String,
    subtitle: String,
    backgroundImage: String,
    content: {
      galleryImages: [String],
    },

    // PARTNER container
    partners: { type: [PartnerItemSchema], default: [] },

    // TESTIMONIAL container
    testimonials: { type: [TestimonialItemSchema], default: [] },

    // MODULE container
    modules: { type: [ModuleItemSchema], default: [] },

    // Generic
    description: String,
    imageUrl: String,
    videoUrl: String,
    icon: String,
    link: String,
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Section || mongoose.model<ISection>("Section", SectionSchema);