import { UserModel, SettingModel } from '../models';
import { generatePassword, generateSalt, encryptPassword } from '../utils';

const addSetting = async () => {
  const result = await SettingModel.find();

  if (result.length <= 0) {
    await SettingModel.create({
      websiteUrl: 'www.chapter247.com',
      youtubeUrl: 'www.youtube.com/chapter247',
      linkedinUrl: 'www.linkedin.com/chapter247',
      twitterUrl: 'www.twitter.com/chapter247',
      orgName: 'chapter247',
      email: ['mohit.b@chapter247.com'],
    });
  }
};

export default { addSetting };
