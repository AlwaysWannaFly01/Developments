import { LinRouter } from 'lin-mizar';
import {
  WufaNamePhoneValidator
} from '../../validators/checkInfo';
import { wufaUserService } from '../../service/wufaUser';
// 酬信接口实例
const wufalawApi = new LinRouter({
  prefix: '/wufalaw/content'
});

wufalawApi.post('/addUser', async ctx => {
  // const test = {
  //   res: true
  // };
  // return ctx.json(test);

  // 1.参数校验
  const v = await new WufaNamePhoneValidator().validate(ctx);
  // 2.执行业务逻辑
  // 3.插入数据库
  await wufaUserService.addUser(v.get('body'));
  // 4/返回成功
  ctx.success({
    msg: '新增用户成功'
  });
});
module.exports = {
  wufalawApi
};