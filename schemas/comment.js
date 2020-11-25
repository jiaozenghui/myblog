/**
 * Created by Administrator on 2017/3/8.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var CommentSchema= new mongoose.Schema({
    article: {type: ObjectId, ref: 'Article'},
    from: {type: ObjectId, ref: 'User'},
    reply: [{
        from: {type: ObjectId, ref: 'User'},
        to: {type: ObjectId, ref: 'User'},
        content: String,
    }],
    content: String,
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
})

CommentSchema.pre('save',function (next) {    //每次存储数据都会调用该方法
    if (this.isNew){        //判断数据是否为新
        this.meta.createAt=this.meta.updateAt=Date.now();
    }
    else{
        this.meta.updateAt=Date.now();
    }
    next();     //存储流程走下去
})

CommentSchema.statics={
    fetch:function (cb) {       //取出数据库所有数据
        return this
            .find({})
            .sort('meta.updateAt')  //排序
            .exec(cb)
    },
    findById:function (id,cb) {     //查询单条数据
        return this
            .findOne({_id:id})
            .exec(cb) 
    }
}

module.exports = CommentSchema;     //导出