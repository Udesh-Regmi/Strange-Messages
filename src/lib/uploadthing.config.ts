import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique route
  imageUploader: f({ image: { maxFileSize: "4MB" } })
   
.middleware(async () => {
    return { uploadedBy: "user" };
})
    .onUploadComplete(async ({  file }) => {
      console.log("Upload complete:", file.url);
      return { fileUrl: file.url };
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;
