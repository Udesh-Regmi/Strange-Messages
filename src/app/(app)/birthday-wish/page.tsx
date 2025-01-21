"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Loader2, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useUploadThing } from "@/lib/uploadthing";
import Image from 'next/image';

// Date validation functions
const isValidAge = (dateString: string): boolean => {
    const birthDate = new Date(dateString);
    const now = new Date();
    
    // Check if it's a valid date
    if (isNaN(birthDate.getTime())) {
        return false;
    }

    // Calculate age in years
    let ageInYears = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
        ageInYears = ageInYears - 1;
    }
    
    // Check if date is in the future
    if (birthDate > now) {
        return false;
    }

    // Check age range (1-100 years)
    return ageInYears >= 1 && ageInYears <= 100;
};

// Define the form schema with custom validation
const birthdayWishSchema = z.object({
    recipientName: z.string()
        .min(1, 'Recipient name is required')
        .max(50, 'Name must be less than 50 characters'),
    dateOfBirth: z.string()
        .refine((date) => isValidAge(date), {
            message: 'Age must be between 1 and 100 years',
        }),
    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must be less than 1000 characters'),
    relationship: z.string()
        .min(1, 'Relationship is required'),
    imageUrls: z.array(z.string()).optional(),
});

type BirthdayWishForm = z.infer<typeof birthdayWishSchema>;

const BirthdayWishPage = () => {
    const { toast } = useToast();
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const { startUpload } = useUploadThing("birthdayImageUploader");

    const form = useForm<BirthdayWishForm>({
        resolver: zodResolver(birthdayWishSchema),
        defaultValues: {
            recipientName: '',
            dateOfBirth: '',
            description: '',
            relationship: '',
            imageUrls: [],
        },
    });

    // Calculate max date (today) and min date (100 years ago)
    const today = new Date();
    const maxDate = today.toISOString().split('T')[0];
    const minDate = new Date(
        today.getFullYear() - 100,
        today.getMonth(),
        today.getDate()
    ).toISOString().split('T')[0];

    const onSubmit = async (data: BirthdayWishForm) => {
        if (!isValidAge(data.dateOfBirth)) {
            toast({
                title: "Invalid Date",
                description: "Age must be between 1 and 100 years",
                variant: "destructive",
            });
            return;
        }

        try {
            setIsLoading(true);

            // Upload images first
            let imageUrls: string[] = [];
            if (selectedImages.length > 0) {
                console.log("Starting upload...");
                try {
                    const uploadResponse = await startUpload(selectedImages);
                    
                    if (!uploadResponse) {
                        throw new Error("No upload response received");
                    }
                    
                    imageUrls = uploadResponse.map(file => file.url);
                    console.log("Uploaded URLs:", imageUrls);
                } catch (uploadError: any) {
                    console.error("Upload error:", uploadError);
                    throw new Error(uploadError.message || "Failed to upload images");
                }
            }

            // Create birthday wish with image URLs
            const response = await axios.post('/api/birthday-wish', {
                ...data,
                imageUrls,
                createdBy: session?.user?.username
            });

            toast({
                title: "Success",
                description: "Birthday wish created successfully!"
            });

            router.push(`/birthday/${response.data.wishId}`);
        } catch (error: any) {
            console.error('Error:', error);
            toast({
                title: "Error",
                description: error.message || "Something went wrong",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + selectedImages.length > 5) {
            toast({
                title: "Error",
                description: "Maximum 5 images allowed",
                variant: "destructive",
            });
            return;
        }

        setSelectedImages(prev => [...prev, ...files]);
        
        // Create preview URLs
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrls(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
    };

    if (!session || !session.user) {
        return (
            <div className="flex items-center justify-center w-full min-h-screen">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">Please Login to Create Birthday Wishes!</h2>
                    <Link href="/sign-up">
                        <Button>Sign Up</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">Create Birthday Wish</h1>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <label htmlFor="recipientName" className="block mb-2 font-semibold">
                        Recipient Name
                    </label>
                    <Input
                        id="recipientName"
                        {...form.register('recipientName')}
                        placeholder="Enter recipient's name"
                    />
                    {form.formState.errors.recipientName && (
                        <p className="text-red-500 text-sm mt-1">
                            {form.formState.errors.recipientName.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="dateOfBirth" className="block mb-2 font-semibold">
                        Date of Birth
                    </label>
                    <Input
                        id="dateOfBirth"
                        type="date"
                        max={maxDate}
                        min={minDate}
                        {...form.register('dateOfBirth')}
                    />
                    {form.formState.errors.dateOfBirth && (
                        <p className="text-red-500 text-sm mt-1">
                            {form.formState.errors.dateOfBirth.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="relationship" className="block mb-2 font-semibold">
                        Relationship
                    </label>
                    <select
                        id="relationship"
                        {...form.register('relationship')}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select Relationship</option>
                        <option value="Brother">Brother</option>
                        <option value="Sister">Sister</option>
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Best Friend">Best Friend</option>
                        <option value="Friend">Friend</option>
                        <option value="Lover">Lover</option>
                        <option value="Girlfriend">Girlfriend</option>
                    </select>
                    {form.formState.errors.relationship && (
                        <p className="text-red-500 text-sm mt-1">
                            {form.formState.errors.relationship.message}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="description" className="block mb-2 font-semibold">
                        Birthday Message
                    </label>
                    <Textarea
                        id="description"
                        {...form.register('description')}
                        placeholder="Write your birthday message..."
                        rows={4}
                    />
                    {form.formState.errors.description && (
                        <p className="text-red-500 text-sm mt-1">
                            {form.formState.errors.description.message}
                        </p>
                    )}
                </div>

                <div>
                    <label className="block mb-2 font-semibold">
                        Upload Images (Max 5)
                    </label>
                    <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={selectedImages.length >= 5}
                        multiple
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        {selectedImages.length}/5 images selected
                    </p>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {previewUrls.map((url, index) => (
                            <div key={index} className="relative">
                                <Image
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    width={300}
                                    height={300}
                                    className="w-full h-40 object-cover rounded-lg"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                        <>
                            <Loader2 className="animate-spin mr-2" />
                            Creating...
                        </>
                    ) : (
                        'Create Birthday Wish'
                    )}
                </Button>
            </form>
        </div>
    );
};

export default BirthdayWishPage;
