const natural = require('natural');
const Joi=require('joi')
natural.PorterStemmer.attach();
const sendLexicon=(text,finalText)=>{
    const tokenizer = new natural.TreebankWordTokenizer();
    let arrayWords=tokenizer.tokenize(text),
        finalArrayWords=tokenizer.tokenize(finalText),
        arrayWordsStem=text.tokenizeAndStem(),
        finalArrayWordsStem=finalText.tokenizeAndStem(),
        count=0,
        countStem=0;
    console.log(arrayWords)
    console.log(arrayWordsStem)
    console.log(finalArrayWords)
    console.log(finalArrayWordsStem)
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
    console.log(Math.round(count/arrayWords.length*100))
    console.log(Math.round(countStem/arrayWordsStem.length*100))
    return (count===0?1:Math.round(count/arrayWords.length*100))*(countStem===0?1:Math.round(countStem/arrayWordsStem.length*100))/100

}

exports.plugin = {
    name:'distance',
    version:'0.0.1',
    register: async (server)=>{
        server.route({
            method: 'POST',
            path: '/distance',
            config: {
                async handler(req) {
                    let {text,arrayTextVoic}=req.payload;
                    let finalText=arrayTextVoic[0].toLowerCase(),min=0;
                    const faildAnswer=['I don\'t get you','I don\'t understand you','I can\'t understand','I don\'t get your','I don\'t know what you\'re talking about','Didn’t catch that']
                    const random=Math.floor(Math.random() * (faildAnswer.length + 1));
                    try {
                        let analysisNLP=natural.LevenshteinDistance(text.toLowerCase(),arrayTextVoic[0].toLowerCase(), {search: true});
                        /*arrayTextVoic.forEach(t=>{
                            let analysisNLP=natural.LevenshteinDistance(text.toLowerCase(), t.toLowerCase(), {search: true});
                            //max=max===0?analysisNLP.distance:(max>analysisNLP.distance?max:analysisNLP.distance)
                            min=min===0?analysisNLP.distance:(min<analysisNLP.distance?min:analysisNLP.distance)
                            if(min===analysisNLP.distance){
                                finalText=t.toLowerCase();
                            }
                        })*/
                        const phonetics=100-(arrayTextVoic.length-1)*5
                        const grammar=Math.round(100-analysisNLP.distance/text.length*100);
                        const lexicon=sendLexicon(text.toLowerCase(),finalText);
                        return {err:false,phonetics,grammar,lexicon,text:finalText,answer:((phonetics-50)*2+grammar+lexicon)/3>50?'Hello sure':faildAnswer[random]}
                    }catch (e) {
                        console.log(e)
                        return {err:true}
                    }

                },
                description: 'Просмотр объявления',
                tags: ['api'],
                validate: {
                    payload:Joi.object({
                        text: Joi.string().min(1),
                        arrayTextVoic: Joi.any(),
                    })
                }
            }
        });
    }
};