const router = require("express").Router()
const Movie = require("../models/Movie");
const validate = require("../validateToken");


router.post("/", validate, async (req, res) => { // POST isteğini yöneten route handler
    if (req.user.isAdmin) { // isAdmin doğrulanırsa
      const newMovie = new Movie(req.body); // Yeni film nesnesi oluştur
  
      try { // Kaydetmeye çalış
        const savedMovie = await newMovie.save(); // Veritabanına filmi kaydet
        res.status(201).json(savedMovie); // Film başarıyla oluşturulduğunda 201 Created durumu ve kaydedilen film nesnesi gönderilir
      } catch (err) { // Bir hata oluşursa, 500 Internal Server Error durumu gönderilir ve hata mesajı gösterilir
        res.status(500).json(err);
      }
    } else { // isAdmin doğrulanmazsa, 403 Forbidden durumu gönderilir ve erişim reddedilir
      res.status(403).json("You can not reach this area");
    }
});

router.put("/:id", validate, async (req, res) => {
    if (req.user.isAdmin) {
      try {
        const updatedMovie = await Movie.findByIdAndUpdate(
          req.params.id, // Güncellenecek film ID'si
          {
            $set: req.body, // İstek gövdesindeki verilerle güncellenen alanlar
          },
          { new: true } // Güncellenen filmi getirir
        );
        res.status(200).json(updatedMovie);
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("You can not reach this area");
    }
});


router.delete("/:id", validate, async (req, res) => {
    if (req.user.isAdmin) {
      try {
        await Movie.findByIdAndDelete(req.params.id); // ID'ye göre filmi sil
        res.status(200).json("Movie has been deleted");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("You can not reach this area");
    }
});

router.get("/:id", validate, async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id); // ID'ye göre filmi getir
    if (movie) {
      res.status(200).json(movie);
    } else {
      res.status(404).json("Movie not found");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});



router.get("/", verify, async (req, res) => {
  try {
    const movies = req.user.isAdmin ? await Movie.find().sort({ _id: -1 }) : null;
    const status = req.user.isAdmin ? 200 : 403;
    const message = req.user.isAdmin ? movies.reverse() : "You are not allowed!";
    res.status(status).json(message);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get("/random", validate, async (req, res) => {
  const type = req.query.type;
  let movie;
  try {
    if (type === "series") {
      movie = await Movie.aggregate([
        { $match: { isSeries: true } },
        { $sample: { size: 1 } },
      ]);
    } else {
      movie = await Movie.aggregate([
        { $match: { isSeries: false } },
        { $sample: { size: 1 } },
      ]);
    }
    res.status(200).json(movie);
  } catch (err) {
    res.status(500).json(err);
  }
}); 
