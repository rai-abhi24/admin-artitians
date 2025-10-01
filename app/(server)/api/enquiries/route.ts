import { connectToDB } from "@/lib/db";
import { Enquiry } from "@/models";
import { NextRequest, NextResponse } from "next/server";

function validateData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
        errors.push('Name is required and must be a non-empty string');
    }

    if (!data.phone || typeof data.phone !== 'string' || data.phone.trim().length === 0) {
        errors.push('Phone number is required');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

export async function POST(req: NextRequest) {
    try {
        await connectToDB();
        const body = await req.json();

        const validation = validateData(body);
        if (!validation.isValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Validation failed',
                    errors: validation.errors
                },
                { status: 400 }
            );
        }

        const { name, phone, wpUpdate = false } = body;

        const existingEnquiry = await Enquiry.findOne({ phone });

        if (existingEnquiry) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'We have already received your enquiry. We will get back to you soon.'
                },
                { status: 409 }
            );
        }

        const newEnquiry = new Enquiry({
            name: name.trim(),
            phone: phone?.trim() || undefined,
            sendWhatsAppUpdate: wpUpdate
        });

        await newEnquiry.save();
        return NextResponse.json(
            {
                success: true,
                message: 'Enquiry submitted successfully'
            },
            { status: 201 }
        );
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('duplicate key')) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'We have already received your enquiry. We will get back to you soon.'
                    },
                    { status: 409 }
                );
            }
        }

        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error'
            },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        await connectToDB();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const search = searchParams.get('search') || '';
        const status = searchParams.get('status') || '';

        const query: any = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) {
            query.status = status;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        const enquiries = await Enquiry.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Enquiry.countDocuments(query);

        return NextResponse.json(
            {
                success: true,
                data: {
                    enquiries,
                    pagination: {
                        page,
                        limit,
                        total,
                        pages: Math.ceil(total / limit)
                    }
                }
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Error fetching enquiries:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Internal server error'
            },
            { status: 500 }
        );
    }
}