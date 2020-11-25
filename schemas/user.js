/**
 * Created by Administrator on 2017/3/8.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 10;
var UserSchema= new mongoose.Schema({
    name: {
        unique: true,
        type: String
    },
    password: String,
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    },
    // 0: nomal user
    // 1: verified user
    // 2: professional user
    // >10: admin
    // >50: super admin
    role: {
        type: Number,
        default: 0
    }
})

UserSchema.pre('save',function (next) {    //每次存储数据都会调用该方法
    var user = this;
    if (this.isNew){        //判断数据是否为新
        this.meta.createAt=this.meta.updateAt=Date.now();
    }
    else{
        this.meta.updateAt=Date.now();
    }
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        })

    });

    //next();     //存储流程走下去
})

UserSchema.statics={
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

UserSchema.methods = {
    comparePassword: function(_password, cb) {
        bcrypt.compare(_password, this.password, function(err, isMatch) {
            if (err) {
              return cb(err);  
          }
          cb(null, isMatch)
        });
    }
};

module.exports=UserSchema;     //导出