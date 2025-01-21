export default function BirthdayLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-pink-100 via-purple-100 to-indigo-100 overflow-hidden">
            <div className="relative w-full h-full">
                {children}
            </div>
        </div>
    );
}
