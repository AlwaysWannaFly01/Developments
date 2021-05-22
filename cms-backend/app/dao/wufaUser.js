// import { RepeatException } from 'lin-mizar';
import { WufaUserModel } from '../models/wufaUser';

class WufaUserDao {
  static async addUser (v) {
    // console.log('v', v)
    /* 如果用户名不需要做唯一校验,表里面的索引关联由之前的username改为id,否则提交同样的名称会失败 */

    // let user = await WufaUserModel.findOne({
    //   where: {
    //     username: v.username
    //   }
    // });
    // console.log(user);
    // if (user) {
    //   throw new RepeatException({
    //     msg: '已经有用户使用了该名称，请重新输入新的用户名',
    //     errorCode: 10071
    //   });
    // }
    return WufaUserModel.create(v);
  }
}
export { WufaUserDao };