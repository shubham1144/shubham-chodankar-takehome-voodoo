const express = require('express');
const bodyParser = require('body-parser');
const db = require('./models');
const { Op } = require("sequelize");
const fetch = require("node-fetch");

const app = express();

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/static`));

app.get('/api/games', async (req, res) => {
  try {
    const games = await db.Game.findAll()
    return res.send(games)
  } catch (err) {
    console.error('There was an error querying games', err);
    return res.send(err);
  }
})

app.post('/api/games', async (req, res) => {
  const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
  try {
    const game = await db.Game.create({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished })
    return res.send(game)
  } catch (err) {
    console.error('***There was an error creating a game', err);
    return res.status(400).send(err);
  }
})

app.delete('/api/games/:id', async (req, res) => {
  try {
    const game = await db.Game.findByPk(parseInt(req.params.id))
    await game.destroy({ force: true })
    return res.send({ id: game.id  })
  } catch (err) {
    console.error('***Error deleting game', err);
    return res.status(400).send(err);
  }
});

app.put('/api/games/:id', async (req, res) => {
  // eslint-disable-next-line radix
  const id = parseInt(req.params.id);
  const { publisherId, name, platform, storeId, bundleId, appVersion, isPublished } = req.body;
  try {
    const game = await db.Game.findByPk(id)
    await game.update({ publisherId, name, platform, storeId, bundleId, appVersion, isPublished })
    return res.send(game)
  } catch (err) {
    console.error('***Error updating game', err);
    return res.status(400).send(err);
  }
});

app.post('/api/games/search', async (req, res) => {
  try {
    const { name, platform } = req.body
    const queryFilters = {
      ...{
        name: {
          [Op.like]: `%${name}%`
        },
      },
      ...!!platform && { platform }
    }
    const games = await db.Game.findAll({
      where : queryFilters
    })
    return res.send(games)
  } catch(err) {
    console.error('There was an error searching games', err)
    return res.send(err)
  } 
})

app.post('/api/games/populate', async( req, res) => {
  try {
    const S3BucketData = [], gamesData = []
    const urls = [
    "https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/android.top100.json", 
    "https://interview-marketing-eng-dev.s3.eu-west-1.amazonaws.com/ios.top100.json"]
    for(let url of urls) {
      const response = await fetch(url);
      const data = await response.json();
      S3BucketData.push(...data)
    }
    for(let record of S3BucketData) {
      for(let game of record) {
        const { publisher_id, name, os, app_id, bundle_id, version} = game
        let gameRecord = {
          publisherId:publisher_id,
          name: name,
          platform: os,
          storeId: app_id,
          bundleId: bundle_id,
          appVersion: version,
          isPublished: true,
        }
        gamesData.push(gameRecord)
      }
    }
    const games = await db.Game.bulkCreate(gamesData);
    res.send(games)
  } catch(err) {
    console.error('There was a error populating games', err)
    return res.send(err)
  }
})

app.listen(3000, () => {
  console.log('Server is up on port 3000');
});

module.exports = app;
