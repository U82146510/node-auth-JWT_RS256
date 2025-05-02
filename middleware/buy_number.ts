import dotenv from 'dotenv';
dotenv.config();

const api = process.env.api_sim;
if(!api){
    console.error('missing api');
    process.exit(1);
};


async function get_price(service:string){
    const url_price = `https://5sim.net/v1/guest/prices`
    const app = [];
    try {
        const raw_data = await fetch(url_price);
        const data = await raw_data.json();
        
        for(const [country,srvs] of Object.entries(data)){
           for(const [srv,info] of Object.entries(srvs as any)){
               if(srv===service){
                   for(const [provider, data] of Object.entries(info as any)){
                       console.log(data)
                   }
               }
           }
        }
    } catch (error) {
        console.error(error);
    }
}

get_price('whatsapp')
