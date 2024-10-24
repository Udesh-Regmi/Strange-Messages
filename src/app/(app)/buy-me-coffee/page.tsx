import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';

const BuyMeCoffee = () => {
    return (
        <div className="flex flex-grow justify-center items-center min-h-screen bg-gradient-to-r from-indigo-50 via-indigo-100 to-indigo-200 text-indigo-900">
            <div className="text-center p-8 rounded-lg shadow-lg bg-white">
                <h1 className="text-3xl font-bold mb-6 text-black">Buy Me a Coffee</h1>
                <p className="text-lg font-medium mb-4 text-black">We are currently working on this page. Please wait!</p>
                <Link href='/dashboard'>
                        <Button className="ml-2 bg-indigo-600 text-white hover:bg-indigo-700 transition duration-300">
                            Back to Dashboard
                        </Button>
                    </Link>
            </div>
        </div>
    );
};

export default BuyMeCoffee;
