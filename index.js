const SlackBot = require('slackbots');
const axios = require('axios')
const dotenv = require('dotenv')

dotenv.config()

const bot = new SlackBot({
    token: `${process.env.BOT_TOKEN}`,
    name: 'mathisonBot'
})

bot.on('start', () => {
    const params = {
        icon_emoji: ':robot_face:'
    }

    bot.postMessageToChannel(
        'random',
        'The Mathison Projects Skynet program has been activated. I can give you the nearest pay day ("@mathisonBot, when is payday?"), give you the time at my home-base of Houston, Texas ("@mathisonBot, what time is it?"), and of course, tell a joke ("@mathisonBot, tell me a joke"). Laugh or be assimilated.',
        params
    );

    bot.on('error', (err) => {
        console.log(err);
    })
})

function handleMessage(message) {
    if(message.includes(' what time is it')) {
        getCentralTime()
    } else if(message.includes(' when is payday')) {
        getPayday()
    } else if(message.includes(' help')) {
        runHelp()
    } else if(message.includes('tell me a joke')){
        getDadJoke()
    }
}

function getCentralTime() {
    axios.get('http://worldtimeapi.org/api/timezone/america/chicago')
      .then(res => {
            const data = res.data;
            const time = data.datetime;
            const startDst = data.dst_from;
            const endDst = data.dst_until;
            const params = {
                icon_emoji: ':cool_guy:'
            }
            bot.postMessageToChannel(
                'random',
                `:hourglass: It's currently ${time} ${data.abbreviation} according to the company Skynet program based in Houston, Texas. This year, daylight savings time started on ${startDst} and will end on ${endDst}`,
                params
            );
      })
}

function getPayday() {
    axios.get('http://worldtimeapi.org/api/timezone/america/chicago')
      .then(res => {
            const today = res.data;
            const payDays = ['2021/1/1', '2021/6/15', '2021/12/31']
            const covertedPayDays = payDays.map(convertDates);
            function convertDates(value, index, array){
              return value = new Date(value).getTime();
            }      
            const payDay = covertedPayDays.find(element => element > today);
            const nextPayDay = (new Date(payDay).getMonth() +1) + '/' + (new Date(payDay).getDate()) + '/' + (new Date(payDay).getFullYear());
            const params = {
                icon_emoji: ':cool_guy:'
            }
            bot.postMessageToChannel(
                'dev',
                `:moneybag: According to the company Skynet program. The next pay-day is going to be on ${nextPayDay}. Make sure to submit your invoices and hours by that preceding Monday.`,
                params
            );
      })
}

function getDadJoke() {
    axios.get('https://icanhazdadjoke.com/slack')
      .then(res => {
            const joke = res.attachments.text;
            const params = {
                icon_emoji: ':beared_person:'
            }
            bot.postMessageToChannel(
                'random',
                `${joke}`,
                params
            );
      })
}

function runHelp() {
    const params = {
        icon_emoji: ':question:'
    }
    bot.postMessageToChannel(
        'random',
        `Type *@mathisonBot* with *what time is it* to get the company time, *when is payday* to get the date for the next pay day :moneybag:, *tell me a joke* to get a random joke and *help* to get this instruction again`,
        params
    );
}