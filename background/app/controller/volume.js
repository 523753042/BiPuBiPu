'use strict';
const Controller = require('egg').Controller;

const DEFAULTOFFSET = 0;
const DEFAULTVOLUMEPAGESIZE = 10;
const DEFAULTSCOREPAGESIZE = 20;

class VolumeController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.VolumeService = ctx.service.volumeService;
    // this.ctx.session.uid = 123; // 测试用
  }

  async getVolumeList() {
    const {
      offset = DEFAULTOFFSET, pagesize = DEFAULTVOLUMEPAGESIZE, role = 'normal'
    } = this.ctx.query;
    const response = await this.VolumeService.getVolumeList(offset, pagesize, role);
    this.ctx.helper.successRes('sucess', response);
  }

  async createVolume() {
    let {
      title,
      describe,
      img
    } = this.ctx.request.body;
    if (img == null){
      img = 'https://bipu.oss-cn-beijing.aliyuncs.com/bipuText/Spectrum.png'
    }
    const uid = this.ctx.session.user.id;
    const response = await this.VolumeService.createVolume(title, describe, img, uid);
    this.ctx.helper.successRes('sucess', response);
  }
  async getVolumeAuthor(){
    const {
      vid
    } = this.ctx.params;
    const response = await this.VolumeService.getVolumeAuthor(vid);
    this.ctx.helper.successRes('sucess', response);
  }
  async getVolumeCollector(){
    const {
      vid
    } = this.ctx.params;
    const {
      offset = DEFAULTOFFSET, pagesize = DEFAULTSCOREPAGESIZE
    } = this.ctx.query;
    const response = await this.VolumeService.getVolumeCollector(vid, offset, pagesize);
    this.ctx.helper.successRes('sucess', response);
  }
  async getVolumeType(){
    const {
      vid
    } = this.ctx.params;
    const uid = this.ctx.session.user.id
    const response = await this.VolumeService.getVolumeType(vid, uid);
    if (response === 'author') {
      this.ctx.helper.successRes('success', { type :'author'});
    } else if (response === 'collector') {
      this.ctx.helper.successRes('success', { type :'collector'});
    } else {
      this.ctx.helper.successRes('success',{type: 'visitor'})
    }
  }

  async editVolume() {
    const {
      name,
      describe,
      photo
    } = this.ctx.request.body;
    const {
      vid
    } = this.ctx.params;
    const volume = await this.VolumeService.findOwner(vid);
    if (volume.get('uid') !== this.ctx.session.user.id) {
      this.ctx.helper.createRes(403, 'permission denied ಠ益ಠ');
    }
    const response = await this.VolumeService.editVolume(vid, name, describe, photo);
    this.ctx.helper.successRes('sucess', response);
  }
  async getVolumeType() {
    const {
      vid
    } = this.ctx.params;
  }
  async deleteVolume() {
    const {
      vid
    } = this.ctx.params;
    const uid = this.ctx.session.user.id;
    const response = await this.VolumeService.deleteVolume(vid, uid);
    if (response) {
      this.ctx.helper.createRes(200, 'Delete success QwQ');
    } else {
      this.ctx.helper.createRes(409, 'Delete err Orz  ');
    }
  }

  async getVolumeInfo() {
    const {
      vid
    } = this.ctx.params;
    const response = await this.VolumeService.getVolumeInfo(vid);
    this.ctx.helper.successRes('sucess', response);
  }

  async getVolumeScore() {
    const {
      vid
    } = this.ctx.params;
    const {
      offset = DEFAULTOFFSET, pagesize = DEFAULTSCOREPAGESIZE
    } = this.ctx.query;
    const response = await this.VolumeService.getVolumeScore(vid, offset, pagesize);
    // console.log(response)
    this.ctx.helper.successRes('sucess', response);
  }

  async addVolumeScore() {
    const {
      sid
    } = this.ctx.request.body;
    const {
      vid
    } = this.ctx.params;
    const volume = await this.VolumeService.findOwner(vid);
    if (volume.get('uid') !== this.ctx.session.user.id) {
      this.ctx.helper.createRes(403, 'permission denied ಠ益ಠ');
    }
    const response = await this.VolumeService.addVolumeScore(vid, sid);
    this.ctx.helper.successRes('sucess', response);
  }

  async deleteVolumeScore() {
    const {
      sid
    } = this.ctx.request.body;
    const {
      vid,
    } = this.ctx.params;
    const volume = await this.VolumeService.findOwner(vid);
    if (volume.get('uid') !== this.ctx.session.user.id) {
      this.ctx.helper.createRes(403, 'permission denied ಠ益ಠ');
    }
    const response = await this.VolumeService.deleteVolumeScore(vid, sid);
    this.ctx.helper.successRes('sucess', response);
  }

  async getComment() {
    const {
      vid
    } = this.ctx.params;
    const response = await this.VolumeService.getComment(vid);
    this.ctx.helper.successRes('sucess', response);
  }

  async addComment() {
    const {
      vid
    } = this.ctx.params;
    const {
      replyid,
      text,
      targetid
    } = this.ctx.request.body;
    const uid = this.ctx.session.user.id;
    let response;
    if (replyid) {
      response = await this.VolumeService.addCommentToComment(replyid, text, uid, targetid);
    } else {
      response = await this.VolumeService.addCommentToVolume(vid, text, uid);
    }
    this.ctx.helper.successRes('sucess', response);
  }

  async delectComment() {
    const {
      cid
    } = this.ctx.params;
    const response = await this.VolumeService.delectComment(cid);
    this.ctx.helper.successRes('sucess', response);
  }

  async delectSubcomment() {
    const {
      cid
    } = this.ctx.params;
    const response = await this.VolumeService.delectSubcomment(cid);
    this.ctx.helper.successRes('sucess', response);
  }
}

module.exports = VolumeController;