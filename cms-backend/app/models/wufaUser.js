import { Sequelize, Model } from 'sequelize';
import sequelize from '../libs/db';

class WufaUser extends Model {

}

WufaUser.init(
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING(64),
      allowNull: false,
      defaultValue: '',
      comment: '姓名名'
    },
    phone: {
      type: Sequelize.STRING(64),
      defaultValue: '',
      comment: '用户手机号'
    }
  },
  {
    tableName: 'wufa_user',
    modelName: 'wufa_user',
    createdAt: 'create_time',
    paranoid: true,
    underscored: true,
    timestamps: false,
    sequelize
  }
);
export {
  WufaUser as WufaUserModel
};