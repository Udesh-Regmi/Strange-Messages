import { Message } from "@/model/User";

export interface ApiResponse {
    success: boolean; 
    message : string; 
    wishId?: string;
    birthdayWish?: any;
    isAcceptingMessages?: boolean; 
    messages ?: Array<Message>

}