"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import axios, { AxiosError } from "axios";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { ApiResponse } from "@/types/ApiResponse";

const Connections = () => {
  const [usernames, setUsernames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const currentUser = session?.user?.name || null;
  const [friends, setFriends] = useState<string[]  >(session?.user?.friendList || []);

  useEffect(() => {
    const fetchUsernames = async () => {
      try {
        const response = await axios.get("/api/get-all-username");
        if(!response || !response.data ){
          toast({
            title: 'Error',
            description:  'Something went wrong while fetching usernames for  connections',
            variant: 'destructive',
        })
              }
        console.log(response.data)
        const data = response.data;
        setUsernames(data.usernames);
      } catch (error) {
        console.error("Error fetching usernames:", error);
      }
    };

    fetchUsernames();
  }, []);

  const AddConnection = async (username: string) => {
    if (loading) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/get-all-username", { username });
      if(!response || !response.data ){
        toast({
          title: 'Error',
          description:  'Something went wrong while adding connections',
          variant: 'destructive',
      })
    }
      console.log("Connection added:", response.data);
      setFriends((prevFriends) => [...prevFriends, username]);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
          title: 'Error',
          description: axiosError.response?.data.message || 'Error while fetching messages',
          variant: 'destructive',
      });
        } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gradient-to-r from-blue-100 via-indigo-50 to-purple-100 p-6 text-gray-900">
      <h1 className="text-3xl font-extrabold p-2 text-indigo-900">Connections</h1>
      <div className="flex flex-grow w-full max-w-7xl space-x-6">
        <section className="flex-1 bg-white p-6 rounded-lg shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-4">Connection Requests</h2>
          <ScrollArea className="h-[70vh] w-full rounded-md border border-gray-200 p-4">
            <div className="space-y-3">
              {usernames.map((username) => (
                <div key={username} className="flex justify-between items-center text-lg">
                  <span className="font-medium">{username}</span>
                  <Button className="bg-green-500 text-white hover:bg-green-600 transition">
                    Confirm
                  </Button>
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </section>

        <section className="flex-1 bg-white p-6 rounded-lg shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold mb-4">Add Connection</h2>
          <ScrollArea className="h-[70vh] w-full rounded-md border border-gray-200 p-4">
            <div className="space-y-3">
              {usernames.map((username) => (
                <div key={username} className="flex justify-between items-center text-lg">
                  <span className="font-medium">{username}</span>
                  {username !== currentUser && !friends.includes(username) ? (
                    <Button
                      className="bg-blue-500 text-white hover:bg-blue-600 transition"
                      onClick={() => AddConnection(username)}
                      disabled={loading}
                    >
                      {loading ? "Adding..." : `Add Connection to ${username}`}
                    </Button>
                  ) : (
                    <Button className="bg-gray-300 text-gray-600 cursor-not-allowed">
                      Already Added
                    </Button>
                  )}
                  <Separator className="my-2" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </section>
      </div>
    </main>
  );
};

export default Connections;
