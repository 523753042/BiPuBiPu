'use strict';
// app/service/user.js
const Service = require('egg').Service;
class ScoreService extends Service {
  constructor(ctx) {
    super(ctx);
    this.CollectionVolume = this.ctx.model.CollectionVolume;
    this.User = this.ctx.model.User;
    this.Volume = this.ctx.model.Volume;
    this.Auhtor = this.ctx.model.Authorization;
    this.Score = this.ctx.model.Score;
    this.userUpload = this.ctx.model.userUpload;
    this.collectionVolume = this.ctx.model.collectionVolume;
    this.userStar = this.ctx.model.userStar;
    this.userFocus = this.ctx.model.userFocus;
  }
  async searchWord(sid) {
    const score = await this.Score.findOne({
      where: {
        id: sid
      }
    })
    return score;
  }
  async uploadScore(scoreData, uid) {
    const t = await this.ctx.model.transaction();
    try {
      // console.log('server:',this.Score)
      const data = await this.Score.create({
        name: scoreData.name,
        alias: scoreData.alias,
        addtion: scoreData.addtion,
        image_url: scoreData.image_url,
        tonality: scoreData.tonality,
        score_text: scoreData.score_text,
        description: scoreData.description,
        source_url: scoreData.source_url,
        provider: scoreData.provider,
        provider_url: scoreData.provider_url,
        performs: scoreData.performs,
        songs: scoreData.songs,
        other_url: scoreData.other_url,
        other_img: scoreData.other_img,
      });
      await this.userUpload.create({
        uid,
        sid: data.get('id'),
      })
      await t.commit();
      return data;
    } catch (err) {
      await t.rollback();
      return false;
    }
  }
  
  async addCollectionVolume(vid, uid) {
    //  const t = await this.ctx.model.transaction();
    const volume = await this.Volume.findOne({
      where: {
        id: vid
      }
    });
    if (volume == null) {
      return false
    } else {
      const data = await this.collectionVolume.findOrCreate({
        where: {
          vid,
          uid
        }
      })
      return data;
    }
  }
  async deleteCollectionVolume(vid,uid) {
    const volume = await this.Volume.findOne({
      where: {
        vid
      }
    });
    if (volume == null) {
      return false
    } else {
      const data = await this.collectionVolume.destroy({
        where: {
          vid,
          uid
        }
      })
      return data;
    }
  }

  async getAllScore(offset, pagesize){
    const data = await this.Volume.findAll({
      // attributes: ['vid', 'uid'],
      limit: pagesize,
      offset,
    });
    return data;
  }
}

module.exports = ScoreService;