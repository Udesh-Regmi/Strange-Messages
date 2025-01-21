import { createUploadthing, type FileRouter } from "uploadthing/next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
    birthdayImageUploader: f({
        image: {
            maxFileSize: "2MB",
            maxFileCount: 5
        }
    })
    .middleware(async () => {
        const session = await getServerSession(authOptions);
        if (!session) throw new Error("Unauthorized");

        return { userId: session.user._id };
    })
    .onUploadComplete(async ({  file }) => {
        return { url: file.url };
    })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 