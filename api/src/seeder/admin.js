import { UserModel } from '../models';
import { generatePassword, generateSalt, encryptPassword } from '../utils';

const addAdmin = async () => {
  const result = await UserModel.findOne({ email: 'mohit.b@chapter247.com' });
  if (!result) {
    const salt = generateSalt();
    let password = '123456';
    let encryptedPassword = encryptPassword(password, salt);
    await UserModel.create({
      firstName: 'mohit',
      lastName: 'bhati',
      middleName: 'singh',
      email: 'mohit.b@chapter247.com',
      password: encryptedPassword,
      gender: 'Male',
      role: 'Admin',
    });
  }
  // else {
  //   const salt = Password.generateSalt();
  //   let pass = Password.generatePassword();
  //   let x = Password.encryptPassword(pass, salt);
  //   let y = Password.comparePassword(pass, x);
  // }
};

export default { addAdmin };
