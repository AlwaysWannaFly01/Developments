import { WufaUserDao } from '../dao/wufaUser';
import { NotFound } from 'lin-mizar/lin';

class WufaUser {
  static async addUser (v) {
    switch (v['type']) {
      case "100":
        await WufaUserDao.addUser(v);
        break;
      default:
        throw new NotFound({ msg: '内容类型不存在' });
    }
  }
}

export { WufaUser as wufaUserService };