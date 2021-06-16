/**
 * Created by Administrator on 2017/3/8.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var ArticleSchema= new mongoose.Schema({
    title:String,
    content: String,
    abstract: String,
    p_level: String,
    pv: {
        type: Number,
        default: 0
    },
    pc: {
        type: Number,
        default: 0
    },
    author: {type: ObjectId, ref: 'User'},
    category: {
        type: ObjectId,
        ref: 'Category'
    },
    meta:{
        createAt:{
            type:Date,
            defult:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
})

ArticleSchema.pre('save',function (next) {    //每次存储数据都会调用该方法
    if (this.isNew){        //判断数据是否为新
        this.meta.createAt=this.meta.updateAt=Date.now();
    }
    else{
        this.meta.updateAt=Date.now();
    }
    next();     //存储流程走下去
})

ArticleSchema.statics={
    fetch:function (cb) {       //取出数据库所有数据
        return this
            .find({})
            .sort({'meta.updateAt': 'desc'})  //排序
            .exec(cb)
    },
    findById:function (id,cb) {     //查询单条数据
        return this
            .findOne({_id:id})
            .exec(cb)
    },
    findList: function(pageIndex, pageSize, sort, cb) { //去除所有要查询的数据
        sort = sort? sort: {'meta.createAt': 'desc'};
        return this
            .find({}, {content:0})
            .populate('author', 'name')
            .populate('category', 'name')
            .sort(sort)  //排序
            .skip(parseInt(pageSize)*(parseInt(pageIndex)-1))
            .limit(parseInt(pageSize))
            .exec(cb)
    },
    getTotal: function(cb) {
        return this
        .find({}, {content:0}).exec(cb)
    }
}

module.exports=ArticleSchema;     //导出