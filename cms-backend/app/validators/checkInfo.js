import { LinValidator, Rule } from 'lin-mizar';

/* 姓名和手机号校验 */
class WufaNamePhoneValidator extends LinValidator {
  constructor () {
    super();
    this.username = [
      new Rule('isNotEmpty', '姓名不可为空'),
      new Rule('isLength', '姓名长度必须在2~10之间', 2, 10)
    ];
    this.phone = [
      new Rule('isNotEmpty', '手机号码不可为空'),
      new Rule('isMobilePhone', '手机号码格式不正确', 'zh-CN')
    ];
  }
}
export { WufaNamePhoneValidator };