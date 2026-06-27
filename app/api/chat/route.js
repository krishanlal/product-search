import OpenAI from "openai";

const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});

export async function POST(req){
 try{
   const {product}=await req.json();

   const prompt=`Search the web for "${product}".
Return prices and links from Apple, Amazon, Flipkart, Croma, Reliance Digital, Vijay Sales, JioMart and other stores.
Format the response as a markdown table with Platform, Price and Link.`;

   const response=await client.responses.create({
      model:"gpt-4.1",
      tools:[{type:"web_search_preview"}],
      input:prompt
   });

   return Response.json({result:response.output_text});
 }catch(e){
   return Response.json({error:e.message},{status:500});
 }
}
