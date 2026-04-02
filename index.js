const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const Gamedig = require('gamedig');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const TOKEN = process.env.TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const SERVER_IP = '194.110.12.211';
const SERVER_PORT = 30120;

let lastStatus = "online";
let loadingInterval = null;
let fakeCount = 0;

async function sendEmbed(count) {
    const channel = await client.channels.fetch(CHANNEL_ID);

    const embed = new EmbedBuilder()
        .setTitle('📦 Resources Loading')
        .setDescription(`\`\`\`${count} resources\`\`\``)
        .setColor(0xF1C40F);

    channel.send({ embeds: [embed] });
}

async function checkServer() {
    try {
        await Gamedig.query({
            type: 'fivem',
            host: SERVER_IP,
            port: SERVER_PORT
        });

        if (lastStatus === "offline") {
            clearInterval(loadingInterval);
            sendEmbed(313);
        }

        lastStatus = "online";

    } catch {
        if (lastStatus === "online") {
            fakeCount = 150;

            loadingInterval = setInterval(() => {
                fakeCount += 30;

                if (fakeCount > 313) fakeCount = 313;

                sendEmbed(fakeCount);

                if (fakeCount >= 313) {
                    clearInterval(loadingInterval);
                }

            }, 5000);
        }

        lastStatus = "offline";
    }
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    setInterval(checkServer, 10000);
});

client.login(TOKEN);
