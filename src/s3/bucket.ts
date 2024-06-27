import * as AWS from 'aws-sdk'
// не трогать! иначе не будет env
import 'dotenv/config'

class YandexCloud {
  aws: any

  constructor() {
    this.aws = new AWS.S3({
      endpoint: 'https://storage.yandexcloud.net',
      accessKeyId: process.env.YC_KEY_ID, // берем ключ из переменной окружения
      secretAccessKey: process.env.YC_SECRET, // берем секрет из переменной окружения
      region: 'ru-central1',
      httpOptions: {
        timeout: 10000,
        connectTimeout: 10000
      },
    });
  }

  Upload = async ({ file, path, fileName }): Promise<any> => {
    try {
      const params = {
        Bucket: process.env.YC_BUCKET_NAME, // название созданного bucket
        Key: `${path}/${fileName}`, // путь и название файла в облаке (path без слэша впереди)
        Body: file.buffer, // сам файл
        ContentType: 'text/plain', // тип файла
      }

      const aws = this.aws
      const result = await new Promise(function (resolve, reject) {

        aws.upload(params, function (err, data) {
          if (err) return reject(err);
          return resolve(data);
        });
      });
      return result;
    } catch (e) {

      console.error(e);
    }
  }
}

const YaCloud = new YandexCloud();
export default YaCloud