import {client} from '../IMAP/protonmail.ts';
import {simpleParser} from 'mailparser';

async function read_mail() {
    await client.connect();
    let imbox_lock;
    try {
        
        imbox_lock = await client.getMailboxLock('INBOX');
        const messages = client.fetch('1:*',{
            envelope:true,
            source:true,
            uid:true
        });

        for await (const msg of messages){
            if(msg.source){
                const parsed = await simpleParser(msg.source);
                console.log('From:', parsed.from?.text);
                console.log('Subject:', parsed.subject);
                console.log('Text:', parsed.text?.slice(0, 200));
                console.log('---');
            }
        }
    } catch (error) {
        console.log(error);
    } finally{
        if(imbox_lock){
            imbox_lock.release();
            await client.logout();
        }
        
    }
}

read_mail();