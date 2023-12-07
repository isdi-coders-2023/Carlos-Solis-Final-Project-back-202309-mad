import mongoose from 'mongoose';
import 'dotenv/config';

export const dbConnect = () => {
  const user = process.env.USER_DB;
  const passwd = process.env.PASSWD_DB;
  // Const cluster = process.env.DB_CLUSTER;
  // const dataBase = process.env.DB_NAME;
  const uri = `mongodb+srv://${user}:${passwd}@cluster0.sbe0mg5.mongodb.net/?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};
// mongodb+srv://mrsoliscalderon:<password>@cluster0.sjl4iz6.mongodb.net/?retryWrites=true&w=majority
