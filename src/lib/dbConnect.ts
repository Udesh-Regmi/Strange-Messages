import mongoose from "mongoose"


type ConnectionObject ={ 
    isConnected ?: number, 

}
const connection : ConnectionObject = {}
async function dbConnect(): Promise <void>{
    if(connection.isConnected){
        console.log("Connected to database already");
        return 
    }
    try{
        const db = await mongoose.connect(process.env.MONGODB_URI || " " , {  })
        connection.isConnected = db.connections[0].readyState
        console.log(`...................DB connection connected Successfully....................`)


    }catch(err){
        console.error(`Error is ${err} ----------------------DB Failed---------------- `)
        process.exit(1)
    }



}
export default dbConnect