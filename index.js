const { Client, Events, GatewayIntentBits, Collection} = require('discord.js');
// dotenv
const dotenv = require("dotenv");
dotenv.config()
const {TOKEN} = process.env

// importação dos comandos
const fs = require("node:fs")
const path = require("node:path")
const commandsPasth = path.join(__dirname, "commands")
const commandFiles = fs.readdirSync(commandsPasth).filter(file => file.endsWith(".js"))

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection()

for(const file of commandFiles){
    const filePath = path.join(commandsPasth, file)
    const command = require(filePath)
    if ("data" in command && "execute" in command){ //ta dando erro aq
        client.commands.set(command.data.name, command)
    } else{
        console.log(`Esse comando em ${filePath} está com "data" ou "execute" ausente`)
    }
}
//console.log(client.commands)

// Login do bot
client.once(Events.ClientReady, c => {
	console.log(`Pronto! Logado como ${c.user.tag}`);
});
client.login(TOKEN);

// listener de interações com o bot
client.on(Events.InteractionCreate, async interaction=> {
    if (!interaction.isChatInputCommand()) return
    const command = interaction.client.commands.get(interaction.commandName)
    if(!command){
        console.error("Comando não encontrado")
        return
    }try{
        await command.execute(interaction)
    }catch (error){
        console.error(error)
        await interaction.reply("Houve um erro ao executar esse comado")
    }
})