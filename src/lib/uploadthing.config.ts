import { createUploadthing, type FileRouter } from "uploadthing/next";

// Check for missing environment variables
if (!process.env.UPLOADTHING_TOKEN || !process.env.UPLOADTHING_APP_ID) {
    throw new Error("UPLOADTHING_TOKEN and UPLOADTHING_APP_ID must be defined in environment variables.");
}

export const uploadthing = createUploadthing();

export const fileRouter = {
    imageUploader: uploadthing({
        image: { maxFileSize: "4MB", maxFileCount: 5 }
    })
        .middleware(async () => {
            return { uploadedBy: "user" };
        })
        .onUploadComplete(async ({ file }) => {
            console.log("Upload complete:", file.url);
            return { url: file.url };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof fileRouter;