const express = require('express');
const cities = require('./cities');
const app = express();
const {places,descriptors} = require('./seedHelpers')
const path = require('path');
const mongoose = require('mongoose');
const methodoverride = require('method-override')
const Accomo = require('../models/accomo');
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/Accomo',
  {useNewUrlParser:true ,useUnifiedTopology:true});
   console.log("connection open");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const sample = (array)=> array[Math.floor(Math.random()*array.length)]
const seedDB = async ()=>
{
    await Accomo.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const accom = new Accomo({
            author: "64aad3e89c81365d3adf8a5c",
            location: `${cities[random].city},${cities[random].state}`,
             title: `${sample(descriptors)} ${sample(places)}`,
             images:
             [
                {
                  url: 'https://res.cloudinary.com/dzhkmbnbn/image/upload/v1689343037/Accomodo/h5gw9bokrqs84ufhmvu6.jpg',
                  filename: 'Accomodo/h5gw9bokrqs84ufhmvu6',
                },
                {
                  url: 'https://res.cloudinary.com/dzhkmbnbn/image/upload/v1689343043/Accomodo/jtqtmkb356z5aszwpwqz.jpg',
                  filename: 'Accomodo/jtqtmkb356z5aszwpwqz',
                },
                {
                  url: 'https://res.cloudinary.com/dzhkmbnbn/image/upload/v1689343047/Accomodo/wtcstcnuejyibweqkgcc.jpg',
                  filename: 'Accomodo/wtcstcnuejyibweqkgcc',
                }
              ],
             description : 'check out my house ',
             price,
             geometry: { 
              type : "Point", 
             coordinates :
             [
              cities[random].longitude,
              cities[random].latitude
             ] 
            }
        })
        await accom.save();
    }
}

seedDB().then(()=>
{
    mongoose.connection.close().then(()=>
    {
        console.log('close');
    });
});