// هنا بنستورد الفانكشن loginApi
// الفانكشن دي موجودة في ملف auth.api
// ووظيفتها تبعت request للسيرفر باستخدام axios
import { loginApi } from "../apis/auth.api";

// هنا بنعمل function اسمها loginService
// وظيفتها تستقبل بيانات تسجيل الدخول
// (username و password) اللي جاية من الفورم
export const loginService = async (data: {
  username: string;
  password: string;
}) => {

  // هنا بننادي loginApi ونبعتلها البيانات
  // loginApi هتكلم السيرفر وتعمل POST request
  // على endpoint اسمه /auth/login
  const response = await loginApi(data);

  // axios بيرجع response فيه حاجات كتير
  // زي status و headers و data
  // احنا مش محتاجين غير data بس
  // اللي فيها النتيجة اللي رجعها السيرفر
  return response.data;

};
// servie is for
// calculations
// checks
// rules
// transform data
// save token
// filter data