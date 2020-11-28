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
    return (count===0?1:Math.round(count/arrayWords.length*100))*(countStem===0?1:Math.round(countStem/finalArrayWordsStem.length*100))/100

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
                    let finalText='',min=0;
                    try {
                        arrayTextVoic.forEach(t=>{
                            let analysisNLP=natural.LevenshteinDistance(text.toLowerCase(), t.toLowerCase(), {search: true});
                            //max=max===0?analysisNLP.distance:(max>analysisNLP.distance?max:analysisNLP.distance)
                            min=min===0?analysisNLP.distance:(min<analysisNLP.distance?min:analysisNLP.distance)
                            if(min===analysisNLP.distance){
                                finalText=t.toLowerCase();
                            }
                        })
                        const phonetics=100-(arrayTextVoic.length-1)*5
                        const grammar=Math.round(100-min/text.length*100);
                        const lexicon=sendLexicon(text.toLowerCase(),finalText);
                        return {err:false,phonetics,grammar,lexicon,text:finalText,answer:'Hello Sure'}
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