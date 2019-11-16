const express = require('express');
const ejs = require('ejs');
const cheerio = require('cheerio');
const request = require('request');
const app = express();
app.set('view engine','ejs');
app.use(express.static('public'));
// app.use(bodyParser.urlencoded({extended:true}));

app.get('/',(req,res) => {
    res.render('home');
})

app.get('/news/:id',(req,res) => {
    let data = [];
    request.get(`https://news.google.com/search?q=${req.params.id}&hl=en-CA&gl=CA&ceid=CA%3Aen`,(error,response,html) => {
       return new Promise((request,resolve) => {
            let $ = cheerio.load(html);
            $('.NiLAwe').each((i,el)=>{
                let news = {
                    title : $(el).find('.ipQwMb').text(),
                    link : $(el).find('.DY5T1d').attr(),
                    img : $(el).find('.tvs3Id').attr('src')
                }
                data.push(news)
            })
            res.render('search',{data:data.slice(0,10)});
       })
       .catch(err => {
           console.log(err);
       })
    })
})
let PORT = process.env.PORT || 3000
app.listen(PORT, console.log(`App is running successfully on port ${PORT}`))