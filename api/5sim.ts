import dotnev from 'dotenv';
dotnev.config();

const api = process.env.api_sim
if(!api){
    console.error('missing api');
    process.exit(1);
};

const link = "https://5sim.net/v1/user/profile";

async function fetch_data(){
    try {
        const raw_data = await fetch(link,{
            headers:{"Authorization":`Bearer ${api}`}
        });
        const data = await raw_data.json();
        console.log(data);

    } catch (error) {
        console.error(error);
    }
}

fetch_data()