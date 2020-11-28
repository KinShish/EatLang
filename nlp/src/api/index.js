const natural = require('natural');
const Joi=require('joi')
natural.PorterStemmer.attach();
const tokenizer = new natural.TreebankWordTokenizer();
const sendLexicon=(text,finalText)=>{
    let arrayWords=tokenizer.tokenize(text),
        finalArrayWords=tokenizer.tokenize(finalText),
        arrayWordsStem=text.tokenizeAndStem(),
        finalArrayWordsStem=finalText.tokenizeAndStem(),
        count=0,
        countStem=0;
    arrayWords.forEach(word=>{
        for(let wordFinal of finalArrayWords){
            if(word===wordFinal){
                count++;
                break;
            }
        }
    })
    arrayWordsStem.forEach(word=>{
        for(let wordFinal of finalArrayWordsStem){
            if(word===wordFinal){
                countStem++;
                break;
            }
        }
    })
    return (count===0?1:Math.round(count/arrayWords.length*100))*(countStem===0?1:Math.round(countStem/arrayWordsStem.length*100))/100

}
const sendPhonetics=(finalText,array)=>{
    let arrayKeyWords=[];
    array.forEach(t=>{
        arrayKeyWords=t.tokenizeAndStem().concat(arrayKeyWords);
    })
    return (finalText.tokenizeAndStem().length/arrayKeyWords.length)*(11-array.length)*11
}
const addQuestions=(arrayTextVoic)=>{
    const questions=[
        ['Can you help me'],
        ['What can I visit in your city','What can I visit in your town','What can I visit in your place','What intresting places can I visit in your city'],
        ['Where is this church','Where is located this church'],
        ['How can I get this church']
    ];
    const answer=[
        ['Sure','Of course','Go on'],
        ['There is a nice ancient church. You should visit it','There is a wonderful ancient church. You should visit it'],
        ['In the suburb','In the outskirts','In the countryside'],
        ['You can take bus number 5']
    ]
    let finalText=arrayTextVoic[0].toLowerCase();
    let num=0,min=100,questionsNum,questionsText;
    questions.forEach(array=>{
        for(let t of array){
            let analysisNLP=natural.LevenshteinDistance(t.toLowerCase(), finalText.toLowerCase(), {search: true});
            //max=max===0?analysisNLP.distance:(max>analysisNLP.distance?max:analysisNLP.distance)
            min=min===100?analysisNLP.distance:(min<analysisNLP.distance?min:analysisNLP.distance)
            if(min===analysisNLP.distance){
                questionsNum=num;
                questionsText=t
            }
        }
        num++;
    })
    const faildAnswer=['I don\'t get you','I don\'t understand you','I can\'t understand','I don\'t get your','I don\'t know what you\'re talking about','Didn’t catch that']
    const random=(n)=>{return Math.floor(Math.random() * (n-1));}
    let analysisNLP=natural.LevenshteinDistance(questionsText.toLowerCase(),finalText, {search: true});
    /*arrayTextVoic.forEach(t=>{
        let analysisNLP=natural.LevenshteinDistance(text.toLowerCase(), t.toLowerCase(), {search: true});
        max=max===0?analysisNLP.distance:(max>analysisNLP.distance?max:analysisNLP.distance)
        min=min===0?analysisNLP.distance:(min<analysisNLP.distance?min:analysisNLP.distance)
        if(max===analysisNLP.distance){
            finalText=t.toLowerCase();
        }
    })*/

    const phonetics=sendPhonetics(finalText,arrayTextVoic)

    const lexicon=sendLexicon(questionsText.toLowerCase(),finalText);
    //console.log(Math.round(100-analysisNLP.distance/questionsText.length*100),lexicon,(1-analysisNLP.distance/questionsText.length)*lexicon)
    const grammar=Math.round((1-analysisNLP.distance/questionsText.length)*lexicon);
    //console.log(questionsNum,random(answer[questionsNum].length),answer[questionsNum].length,answer[questionsNum][random(answer[questionsNum].length)])
    return {err:false,phonetics,grammar,lexicon,text:finalText,answer:(grammar+lexicon)/2>50?answer[questionsNum][random(answer[questionsNum].length)]:faildAnswer[random(faildAnswer.length+1)]}
}

const checkQuestionSmallTalk=(id,arrayTextVote)=>{
    const answer=[
        ['Hi My name is Alex'],
        ['Yes I am new here I\'m from IT department','Yes I am new here I am from IT department'],
        ['I\'m from Russia I\'m apprentice here','I am from Russia I am apprentice here'],
        ['I arrived last week'],
        ['Yes it\'s lovely but a bit noisy I\'m not used to such a noise in my home town','Yes it is lovely but a bit noisy I am not used to such a noise in my home town'],
        ['I\'s a quiet and not so crowed place in the north of Russia','I is a quiet and not so crowed place in the north of Russia'],
        ['You should visit it one day. I\'m sure you\'ll love it','You should visit it one day. I am sure you will love it']
    ]
    const finalText=arrayTextVote[0].toLowerCase();
    let num=0,min=100,answerEnd;
    answer[id].forEach(text=>{
        let analysisNLP=natural.LevenshteinDistance(text.toLowerCase(), finalText, {search: true});
        //max=max===0?analysisNLP.distance:(max>analysisNLP.distance?max:analysisNLP.distance)
        min=min===100?analysisNLP.distance:(min<analysisNLP.distance?min:analysisNLP.distance)
        if(min===analysisNLP.distance){
            answerEnd={num,text:text.toLowerCase(),nlp:analysisNLP};
        }
        num++;
    })
    const errorAnswer=['I don\'t get you','I don\'t understand you','I can\'t understand','I don\'t get your','I don\'t know what you\'re talking about','Didn’t catch that']
    const random=(n)=>{return Math.floor(Math.random() * (n-1));}
    const phonetics=sendPhonetics(finalText,arrayTextVote)
    const lexicon=sendLexicon(answerEnd.text,finalText);
    console.log(answerEnd.nlp.distance,answerEnd.text.length)
    const grammar=Math.round((1-answerEnd.nlp.distance/answerEnd.text.length)*lexicon);
    return {
        err:false,
        phonetics,
        grammar,
        lexicon,
        text:finalText,
        result:(grammar+lexicon)/2>50,
        answer:errorAnswer[random(errorAnswer.length+1)]
    }
}

exports.plugin = {
    name:'distance',
    version:'0.0.1',
    register: async (server)=>{
        server.route({
            method: 'GET',
            path: '/distance/auth',
            config: {
                async handler(req) {
                    return true
                },
                description: 'Просмотр объявления',
                tags: ['api']
            }
        });
        server.route({
            method: 'POST',
            path: '/distance',
            config: {
                async handler(req) {
                    let {arrayTextVoic}=req.payload;
                    console.log(arrayTextVoic)
                    try{
                        return addQuestions(arrayTextVoic)
                    }catch (e) {
                        console.log(e)
                        return {err:true}
                    }
                },
                description: 'Просмотр объявления',
                tags: ['api'],
                validate: {
                    payload:Joi.object({
                        arrayTextVoic: Joi.any(),
                    })
                }
            }
        });
        server.route({
            method: 'POST',
            path: '/distance/{id}',
            config: {
                async handler(req) {
                    const {id}=req.params;
                    let {arrayTextVote}=req.payload;
                    try{
                        return checkQuestionSmallTalk(id,arrayTextVote)
                    }catch (e) {
                        console.log(e)
                        return {err:true}
                    }
                },
                description: 'Опрос Small talk',
                tags: ['api'],
                validate: {
                    params:Joi.object({
                        id: Joi.number().integer().min(0).allow(0),
                    }),
                    payload:Joi.object({
                        arrayTextVote: Joi.any(),
                    })
                }
            }
        });
    }
};