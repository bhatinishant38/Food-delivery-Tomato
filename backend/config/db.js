import mongoose from "mongoose";
export const connectDB = async () => {
  await mongoose
    .connect(
      "mongodb://root:bhati@ac-ioskdyj-shard-00-00.vbj5pd7.mongodb.net:27017,ac-ioskdyj-shard-00-01.vbj5pd7.mongodb.net:27017,ac-ioskdyj-shard-00-02.vbj5pd7.mongodb.net:27017/food-del?ssl=true&replicaSet=atlas-7v719i-shard-0&authSource=admin&appName=Cluster0",
    )
    .then(() => {
      // console.log('DB Connected')
    });
};
