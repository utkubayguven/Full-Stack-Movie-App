const router = require("express").Router()
const List = require("../models/List");
const validate = require("../validateToken");


router.post("/", validate, async (req, res) => { // POST isteğini yöneten route handler
    if (req.user.isAdmin) { // isAdmin doğrulanırsa
      const newMovie = new List(req.body); // Yeni list nesnesi oluştur
  
      try { // Kaydetmeye çalış
        const savedList = await newMovie.save(); // Veritabanına listi kaydet
        res.status(201).json(savedList); // Film başarıyla oluşturulduğunda 201 Created durumu ve kaydedilen film nesnesi gönderilir
      } catch (err) { // Bir hata oluşursa, 500 Internal Server Error durumu gönderilir ve hata mesajı gösterilir
        res.status(500).json(err);
      }
    } else { // isAdmin doğrulanmazsa, 403 Forbidden durumu gönderilir ve erişim reddedilir
      res.status(403).json("You can not reach this area");
    }
});

router.delete("/:id", validate, async (req, res) => {
    if (req.user.isAdmin) {
      try {
        await List.findByIdAndDelete(req.params.id); // ID'ye göre list sil
        res.status(200).json("Movie has been deleted");
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("You can not reach this area");
    }
});

router.get("/", validate, async (req, res) => {     // "/" yolunda bir GET isteği aldığında
    const typeQuery = req.query.type;               // "type" sorgu parametresini al
    const genreQuery = req.query.genre;             // "genre" sorgu parametresini al
    let list = [];                                 // boş bir liste oluştur
    try {                                          // hata yakalama bloğu başlat
      if (typeQuery) {                             // eğer "type" parametresi varsa
        if (genreQuery) {                          // eğer "genre" parametresi de varsa
          list = await List.aggregate([            // "List" koleksiyonunu filtrele ve ilk 10 belgeyi seç
            { $sample: { size: 10 } },
            { $match: { type: typeQuery, genre: genreQuery } },
          ]);
        } else {                                   // eğer sadece "type" parametresi varsa
          list = await List.aggregate([            // "List" koleksiyonunu filtrele ve ilk 10 belgeyi seç
            { $sample: { size: 10 } },
            { $match: { type: typeQuery } },
          ]);
        }
      } else {                                     // eğer hiç parametre yoksa
        list = await List.aggregate([{ $sample: { size: 10 } }]);  // rastgele 10 belge seç
      }
      res.status(200).json(list);                  // seçilen belgeleri JSON formatında yanıt olarak gönder
    } catch (err) {                                // hata olması durumunda
      res.status(500).json(err);                   // hata kodu ve mesajı JSON formatında yanıt olarak gönder
    }
});
  



module.exports = router