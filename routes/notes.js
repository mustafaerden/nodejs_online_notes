const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {ensureAuthenticated} = require('../helpers/auth');

//Load Note Model;
require('../models/Note');
const Note = mongoose.model('notes');

//Notes index page;
router.get('/', ensureAuthenticated, (req, res) => {
  Note.find({user: req.user.id}) //Idea modelini bul yada (select)
    .sort({date:'desc'}) //desc olarak sırala
    .then(notes => { //ideas tablosundakileri
      res.render('notes/index', { //bu sayfada
        notes:notes //göster
      });
    });
});

//Add Note Route;
router.get('/add', ensureAuthenticated, function (req, res) { //Bu root da,
  res.render('notes/add'); //bu dosyayı çağırdık.
});

// Process Form notes/add sayfasında girilecek formu notes sayfasında yakalıyoruz ve database e kaydediyoruz.;
router.post('/', (req, res) => {
  //form validation işlemi;
  let errors = []; //error larımızın tutulacağı array oluşturduk.

  if (!req.body.title) { //eger title girilmemişse veya boşsa(submit e basıldığında)
    errors.push({text: 'Please add a title'}); // Bu text i errors arrayine ekle.
  }
  if (!req.body.details) { //eger details girilmemişse veya boşsa(submit e basıldığında)
    errors.push({text: 'Please add some details'}); // Bu text i errors arrayine ekle.
  }
  //eğer error varsa;
  if (errors.length > 0) { //errors arrayinde error eklendiyse.
    res.render('/add', { //sayfayı refresh et.
      errors: errors, //hatalarımız: errors arrayindekiler
      title: req.body.title, //title da kullanıcıdan alınan
      details: req.body.details //details de kullanıcıdan alınan
    });
  } else { //insert işlemi yapıyoruz;
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      user: req.user.id
    }
    new Note(newUser) //Idea modelimizin adı
      .save()
      .then(note => {
        req.flash('success_msg', 'Note Added Successfully');
        res.redirect('/notes');
      });
  }
});

//Edit Note Route;
//Edit Note (Database den çekip edit sayfasında gösterme işlemi);
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Note.findOne({ //atadağımız edit butonu ile bu sayfaya id ile gönderdik
    _id: req.params.id //id yi yakaladık
  })
  .then(idea => {
    if(idea.user != req.user.id){
      req.flash('error_msg', 'Not Authorized');
      res.redirect('/ideas');
    } else{
      res.render('ideas/edit', {
        idea:idea //idea yı çektik.
      });
    }
    
  });
  
});

//Edit Form Process;(Update işlemini yapıyoruz);
router.put('/:id', ensureAuthenticated, (req, res) => {
  Note.findOne({
    _id: req.params.id //hangi post un edit edileceğini aldık.
  })
  .then(note =>{
    //new values;
    note.title = req.body.title;
    note.details = req.body.details;

    note.save()
      .then(note => {
        req.flash('success_msg', 'Note Updated');
        res.redirect('/notes'); //işlemden sonra bu sayfaya yönlendirdik.
      })
  });
});

//Delete Note (delete işlemi);
router.delete('/:id', ensureAuthenticated, (req, res) => {
  Note.remove({_id: req.params.id})
    .then(() => {
      req.flash('success_msg', 'Note Removed');
      res.redirect('/notes');
    });
});









module.exports = router;